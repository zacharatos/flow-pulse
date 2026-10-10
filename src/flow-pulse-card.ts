import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import type { ActionConfig, CategoryEntry, FlowPulseCardConfig, HomeAssistant, LabelEntry, TraceSummary } from "./types";
import {
  applyFilter,
  asList,
  buildRows,
  groupRows,
  latestTraces,
  menuFor,
  selectAutomations,
  SNOOZE_PRESETS,
  stubEntities,
  summary,
  traceKey,
  watched,
  type Filter,
  type Group,
  type MenuKey,
  type Row,
} from "./flows";
import { actionHandler, type ActionKind } from "./action-handler";
import { localize, relativeTime, snoozedLabel } from "./localize";
import { errorMessage, toast } from "./ha";
import { cardStyles } from "./styles";
import { defineElement } from "./register";
import { FlowPulseCardEditor } from "./editor";

export const VERSION = "0.1.0";

/** How long a flipped switch waits for its automation to answer before it stops breathing. */
const PENDING_MS = 8000;
/** Traces are written when a run ends: wait a moment after a trigger before reading them. */
const TRACE_DELAY_MS = 1500;

interface Pending {
  on: boolean;
  timer: number;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

export class FlowPulseCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: FlowPulseCardConfig;
  @state() private _snoozes: Record<string, string> = {};
  /** Whether the Flow Pulse integration answered (snooze is offered only then). */
  @state() private _snoozeOk = false;
  @state() private _traces = new Map<string, TraceSummary>();
  @state() private _labelNames: Record<string, string> = {};
  @state() private _categoryOf: Record<string, string | undefined> = {};
  @state() private _categoryNames: Record<string, string> = {};
  @state() private _filter: Filter = "all";
  @state() private _menu?: string;

  private _ids: string[] = [];
  private _deps: unknown[] = [];
  private _watched = new Set<string>();
  private _pending = new Map<string, Pending>();
  private _ticker?: number;
  private _unsub?: Promise<(() => Promise<void> | void) | undefined>;
  private _traceKey = "";
  private _traceTimer?: number;
  private _labelsLoaded = false;
  private _categoryKey = "";

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement() {
    return document.createElement("flow-pulse-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): Partial<FlowPulseCardConfig> {
    const entities = stubEntities(hass);
    return entities.length ? { entities } : {};
  }

  setConfig(config: FlowPulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    for (const key of ["entities", "exclude", "confirm"] as const) {
      const v = config[key];
      if (v !== undefined && (!Array.isArray(v) || v.some((x) => typeof x !== "string"))) {
        throw new Error(`\`${key}\` must be a list of automation entity ids`);
      }
    }
    if (config.label !== undefined && asList(config.label).some((x) => typeof x !== "string")) {
      throw new Error("`label` must be a label id or a list of them");
    }
    if (config.group_by !== undefined && !["none", "label", "area", "category"].includes(config.group_by)) {
      throw new Error("`group_by` must be none, label, area or category");
    }
    this._config = { ...config };
    this._deps = [];
    this._filter = "all";
  }

  getCardSize(): number {
    return 1 + Math.max(1, this._ids.length);
  }

  getGridOptions() {
    return { columns: 6, min_columns: 4, rows: "auto" as const };
  }

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // "3 hours ago" and "until tomorrow" change with time, not with states.
    this._ticker = window.setInterval(() => this.requestUpdate(), 60_000);
    this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) window.clearInterval(this._ticker);
    if (this._traceTimer) window.clearTimeout(this._traceTimer);
    for (const p of this._pending.values()) window.clearTimeout(p.timer);
    this._pending.clear();
    this._unsubscribe();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass) return true;
    if (old.entities !== hass.entities || old.areas !== hass.areas || old.language !== hass.language || old.locale !== hass.locale) {
      return true;
    }
    for (const id of this._watched) if (old.states[id] !== hass.states[id]) return true;
    return false;
  }

  protected willUpdate(): void {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;
    // Selection scans every state: only when the registry or the config change.
    const deps = [hass.entities, config];
    if (deps.some((d, i) => d !== this._deps[i])) {
      this._deps = deps;
      this._ids = selectAutomations(hass, config);
      this._watched = watched(this._ids);
    }
    // A flipped switch stops waiting as soon as its automation reaches the wanted state.
    for (const [id, p] of this._pending) {
      if ((hass.states[id]?.state === "on") === p.on) {
        window.clearTimeout(p.timer);
        this._pending.delete(id);
      }
    }
  }

  protected updated(): void {
    if (!this.hass || !this._config) return;
    this._subscribe();
    this._scheduleTraces();
    this._loadGroupSources();
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  private get _admin(): boolean {
    return this.hass?.user?.is_admin === true;
  }

  // ---- Data from Home Assistant ------------------------------------------

  private _subscribe() {
    if (this._unsub || !this.hass?.connection || !this.isConnected) return;
    this._unsub = this.hass.connection
      .subscribeMessage<{ snoozes: Record<string, string> }>(
        (msg) => {
          this._snoozes = msg.snoozes ?? {};
          this._snoozeOk = true;
        },
        { type: "flow_pulse/subscribe" }
      )
      .catch(() => {
        // The card can be used without the integration (as a Lovelace resource): just no snooze.
        this._snoozeOk = false;
        return undefined;
      });
  }

  private _unsubscribe() {
    const unsub = this._unsub;
    this._unsub = undefined;
    unsub?.then((fn) => fn?.()).catch(() => undefined);
  }

  /** Re-read the traces when one of the shown automations ran or finished (admins only: HA's rule). */
  private _scheduleTraces() {
    if (!this._admin) return;
    const key = traceKey(this.hass!, this._ids);
    if (key === this._traceKey) return;
    const first = this._traceKey === "";
    this._traceKey = key;
    if (this._traceTimer) window.clearTimeout(this._traceTimer);
    this._traceTimer = window.setTimeout(() => this._loadTraces(), first ? 0 : TRACE_DELAY_MS);
  }

  private async _loadTraces() {
    try {
      const list = await this.hass!.callWS<TraceSummary[]>({ type: "trace/list", domain: "automation" });
      this._traces = latestTraces(list ?? []);
    } catch {
      /* traces are a nicety; a failure here must never break the card */
    }
  }

  private async _loadGroupSources() {
    const by = this._config!.group_by;
    if (by === "label" && !this._labelsLoaded) {
      this._labelsLoaded = true;
      try {
        const labels = await this.hass!.callWS<LabelEntry[]>({ type: "config/label_registry/list" });
        this._labelNames = Object.fromEntries(labels.map((l) => [l.label_id, l.name]));
      } catch {
        /* label ids are shown instead */
      }
    }
    if (by === "category") {
      const key = this._ids.join(",");
      if (key === this._categoryKey) return;
      this._categoryKey = key;
      try {
        const [cats, entries] = await Promise.all([
          this.hass!.callWS<CategoryEntry[]>({ type: "config/category_registry/list", scope: "automation" }),
          this.hass!.callWS<Record<string, { categories?: Record<string, string> } | null>>({
            type: "config/entity_registry/get_entries",
            entity_ids: this._ids,
          }),
        ]);
        this._categoryNames = Object.fromEntries(cats.map((c) => [c.category_id, c.name]));
        this._categoryOf = Object.fromEntries(
          Object.entries(entries).map(([id, e]) => [id, e?.categories?.automation ?? undefined])
        );
      } catch {
        /* falls back to one list */
      }
    }
  }

  // ---- Render -------------------------------------------------------------

  private _rows(): Row[] {
    const rows = buildRows(this.hass!, this._config!, this._ids, this._traces, this._snoozes);
    return rows.map((r) => {
      const p = this._pending.get(r.entity_id);
      return p ? { ...r, on: p.on } : r;
    });
  }

  protected render() {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return nothing;
    const rows = this._rows();
    const counts = summary(rows);
    // A filter whose count dropped to zero would show an empty card: fall back to everything.
    const filter = this._filter !== "all" && counts[this._filter] === 0 ? "all" : this._filter;
    const shown = applyFilter(rows, filter);
    const groups = groupRows(hass, config, shown, config.group_by ?? "none", {
      labelNames: this._labelNames,
      categoryOf: this._categoryOf,
      categoryNames: this._categoryNames,
      other: this._t("other"),
    });
    return html`<ha-card>
      ${this._renderHeader(counts, filter)}
      ${!rows.length
        ? html`<div class="empty">
            <ha-icon icon="mdi:robot-outline"></ha-icon>
            <span>${this._t("empty")}</span>
            <span class="hint">${this._t("empty_hint")}</span>
          </div>`
        : !shown.length
        ? html`<div class="empty"><span>${this._t("empty_filter")}</span></div>`
        : groups.map((g) => this._renderGroup(g))}
      ${this._renderMenu(rows)}
    </ha-card>`;
  }

  private _renderHeader(counts: { off: number; attention: number }, filter: Filter) {
    const title = this._config!.title ?? this._t("title");
    if (!title && !counts.off && !counts.attention) return nothing;
    const chip = (key: Filter, n: number, icon: string, label: string) =>
      n
        ? html`<button
            class=${classMap({ chip: true, selected: filter === key, attention: key === "attention" })}
            aria-pressed=${filter === key ? "true" : "false"}
            @click=${() => (this._filter = filter === key ? "all" : key)}
          >
            <ha-icon .icon=${icon}></ha-icon>${label}
          </button>`
        : nothing;
    return html`<div class="header">
      <span class="title">${title}</span>
      <div class="chips">
        ${chip("attention", counts.attention, "mdi:alert-circle-outline", this._t("chip_attention", { n: counts.attention }))}
        ${chip("off", counts.off, "mdi:robot-off-outline", this._t("chip_off", { n: counts.off }))}
      </div>
    </div>`;
  }

  private _renderGroup(g: Group) {
    return html`${g.title ? html`<div class="section-title">${g.title}</div>` : nothing}
      <div class="list">${g.rows.map((r) => this._renderRow(r))}</div>`;
  }

  private _icon(r: Row): string {
    const custom = this.hass!.states[r.entity_id]?.attributes.icon;
    switch (r.status) {
      case "broken":
        return "mdi:alert-outline";
      case "failed":
        return "mdi:alert-circle-outline";
      case "snoozed":
        return "mdi:alarm-snooze";
      case "off":
        return custom ? String(custom) : "mdi:robot-off-outline";
      default:
        return custom ? String(custom) : "mdi:robot";
    }
  }

  private _secondary(r: Row): string {
    const hass = this.hass;
    const when = r.last ? relativeTime(hass, r.last) : "";
    switch (r.status) {
      case "broken":
        return this._t("broken");
      case "running":
        return this._t("running");
      case "failed":
        return when ? this._t("failed", { when }) : this._t("failed_now");
      case "snoozed":
        return snoozedLabel(hass, r.snoozedUntil!);
      default:
        return when || this._t("never_ran");
    }
  }

  private _renderRow(r: Row) {
    const secondary = this._secondary(r);
    const pending = this._pending.has(r.entity_id);
    return html`<div class=${classMap({ row: true, [r.status]: true })} data-eid=${r.entity_id}>
      <div
        class="main"
        role="button"
        tabindex="0"
        aria-label=${`${r.name}, ${secondary}`}
        ${actionHandler({ hasHold: true })}
        @fpc-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          ev.detail.action === "hold" ? this._openMenu(r.entity_id) : this._moreInfo(r.entity_id)}
      >
        <div class="disc"><ha-icon .icon=${this._icon(r)}></ha-icon></div>
        <div class="text">
          <span class="name">${r.name}</span>
          <span class="secondary">${secondary}</span>
        </div>
      </div>
      <button
        class=${classMap({ switch: true, on: r.on, pending })}
        role="switch"
        aria-checked=${r.on ? "true" : "false"}
        aria-label=${this._t("toggle", { name: r.name })}
        ?disabled=${r.status === "broken"}
        @click=${() => this._toggle(r)}
      >
        <span class="track"><span class="thumb"></span></span>
      </button>
      <button
        class="more"
        aria-label=${this._t("more", { name: r.name })}
        aria-haspopup="menu"
        aria-expanded=${this._menu === r.entity_id ? "true" : "false"}
        @click=${() => this._openMenu(r.entity_id)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    </div>`;
  }

  // ---- Menu ---------------------------------------------------------------

  private _renderMenu(rows: Row[]) {
    const row = this._menu ? rows.find((r) => r.entity_id === this._menu) : undefined;
    const keys = row ? menuFor(row, { admin: this._admin, snooze: this._snoozeOk }) : [];
    const item = (key: MenuKey, icon: string) =>
      html`<button class="item" role="menuitem" @click=${() => this._menuAction(row!, key)}>
        <ha-icon .icon=${icon}></ha-icon><span>${this._t(`menu_${key}`)}</span>
      </button>`;
    const has = (k: MenuKey) => keys.includes(k);
    return html`<div class="menu" popover="auto" role="menu" @toggle=${this._menuToggled}>
      ${row
        ? html`<div class="menu-head">${row.name}</div>
            ${has("run") ? item("run", "mdi:play") : nothing}
            ${has("run_check") ? item("run_check", "mdi:play-circle-outline") : nothing}
            ${has("stop") ? item("stop", "mdi:stop-circle-outline") : nothing}
            ${has("resume") ? item("resume", "mdi:alarm-off") : nothing}
            ${has("snooze")
              ? html`<div class="snooze">
                  <span class="snooze-label"><ha-icon icon="mdi:alarm-snooze"></ha-icon>${this._t("menu_snooze")}</span>
                  <div class="presets">
                    ${SNOOZE_PRESETS.map(
                      (p) => html`<button class="chip" @click=${() => this._snooze(row, p.minutes)}>${this._t(`snooze_${p.key}`)}</button>`
                    )}
                  </div>
                </div>`
              : nothing}
            ${has("edit") ? html`<div class="sep"></div>${item("edit", "mdi:pencil-outline")}` : nothing}
            ${has("traces") ? item("traces", "mdi:timeline-text-outline") : nothing}`
        : nothing}
    </div>`;
  }

  private async _openMenu(eid: string) {
    if (this._menu === eid) {
      this._closeMenu();
      return;
    }
    this._menu = eid;
    await this.updateComplete;
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");
    const anchor = this.renderRoot.querySelector<HTMLElement>(`.row[data-eid="${CSS.escape(eid)}"] .more`);
    if (!menu || !anchor) return;
    try {
      if (!menu.matches(":popover-open")) menu.showPopover();
    } catch {
      menu.classList.add("open"); // browsers without popovers: a plain fixed box
    }
    const a = anchor.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const left = Math.min(Math.max(8, a.right - m.width), window.innerWidth - m.width - 8);
    let top = a.bottom + 4;
    if (top + m.height > window.innerHeight - 8) top = Math.max(8, a.top - m.height - 4);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.querySelector<HTMLElement>("button")?.focus();
  }

  private _closeMenu() {
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");
    try {
      if (menu?.matches(":popover-open")) menu.hidePopover();
    } catch {
      /* not a popover */
    }
    menu?.classList.remove("open");
    this._menu = undefined;
  }

  private _menuToggled = (ev: Event) => {
    if ((ev as ToggleEvent).newState === "closed") this._menu = undefined;
  };

  private _menuAction(row: Row, key: MenuKey) {
    this._closeMenu();
    const id = row.id ? encodeURIComponent(row.id) : "";
    switch (key) {
      case "run":
        return this._perform(row, "automation", "trigger", { skip_condition: true }, "confirm_run", "started");
      case "run_check":
        return this._perform(row, "automation", "trigger", { skip_condition: false }, "confirm_run");
      case "stop":
        return this._perform(row, "automation", "turn_off", { stop_actions: true }, "confirm_stop");
      case "resume":
        return this._perform(row, "flow_pulse", "resume", {});
      case "edit":
        return this._navigate(`/config/automation/edit/${id}`);
      case "traces":
        return this._navigate(`/config/automation/trace/${id}`);
      default:
        return undefined;
    }
  }

  // ---- Actions ------------------------------------------------------------

  private _toggle(r: Row) {
    if (r.status === "broken") return;
    const on = !r.on;
    const confirmed = !on && r.confirm;
    this._perform(r, "automation", on ? "turn_on" : "turn_off", {}, on ? undefined : "confirm_off");
    if (confirmed) return; // the dialog may be cancelled: don't pretend
    const prev = this._pending.get(r.entity_id);
    if (prev) window.clearTimeout(prev.timer);
    const timer = window.setTimeout(() => {
      this._pending.delete(r.entity_id);
      this.requestUpdate();
    }, PENDING_MS);
    this._pending.set(r.entity_id, { on, timer });
    this.requestUpdate();
  }

  private _snooze(row: Row, minutes: number) {
    this._closeMenu();
    this._perform(row, "flow_pulse", "snooze", { duration: { minutes } }, "confirm_snooze", "snoozed_toast");
  }

  /**
   * Call an action on one automation. With `confirm` listed for it, HA's own confirmation dialog asks
   * first (through `hass-action`); otherwise the call goes straight out and a failure shows as a toast.
   */
  private async _perform(
    row: Row,
    domain: string,
    service: string,
    data: Record<string, unknown>,
    confirmKey?: string,
    toastKey?: string
  ) {
    const target = { entity_id: row.entity_id };
    if (row.confirm && confirmKey) {
      this._fire(row.entity_id, {
        action: "perform-action",
        perform_action: `${domain}.${service}`,
        data,
        target,
        confirmation: { text: this._t(confirmKey, { name: row.name }) },
      });
      return;
    }
    try {
      await this.hass!.callService(domain, service, data, target);
      if (toastKey) toast(this, this._t(toastKey, { name: row.name }));
    } catch (err) {
      this._pending.delete(row.entity_id);
      this.requestUpdate();
      toast(this, this._t("error", { error: errorMessage(err) }));
    }
  }

  private _moreInfo(eid: string) {
    this._fire(eid, { action: "more-info" });
  }

  private _navigate(path: string) {
    this._fire("", { action: "navigate", navigation_path: path });
  }

  /** Hand the action to Home Assistant's own handler (confirmation, navigate, more-info, perform-action). */
  private _fire(entity: string, tap_action: ActionConfig) {
    this.dispatchEvent(
      new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config: { entity, tap_action }, action: "tap" } })
    );
  }
}

if (!customElements.get("flow-pulse-card")) {
  Promise.all([
    defineElement("flow-pulse-card", FlowPulseCard),
    defineElement("flow-pulse-card-editor", FlowPulseCardEditor),
  ]).then(() => {
    window.customCards = window.customCards || [];
    if (!window.customCards.some((c) => c.type === "flow-pulse-card")) {
      window.customCards.push({
        type: "flow-pulse-card",
        name: "Flow Pulse Card",
        description: "Your automations at a glance: turn them on or off, run them, snooze them, and see which ones failed.",
        preview: true,
      });
    }
    // eslint-disable-next-line no-console
    console.info(
      `%c FLOW-PULSE-CARD %c v${VERSION} `,
      "color:#fff;background:#03a9f4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px",
      "color:#03a9f4;background:#fff0;font-weight:700;padding:2px 4px"
    );
  });
}
