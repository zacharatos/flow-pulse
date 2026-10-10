import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { FlowPulseCardConfig, HomeAssistant } from "./types";
import { asList } from "./flows";
import { localize } from "./localize";
import { loadHaElements } from "./ha";

type Schema = Record<string, unknown>;

const AUTOMATIONS = { entity: { multiple: true, filter: [{ domain: "automation" }] } };

/** Values left out of the YAML when they equal the default. */
function clean(v: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(v)) {
    if (x === undefined || x === null || x === "") continue;
    if (Array.isArray(x) && !x.length) continue;
    if (k === "group_by" && x === "none") continue;
    out[k] = x;
  }
  return out;
}

export class FlowPulseCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: FlowPulseCardConfig;
  @state() private _ready = false;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: FlowPulseCardConfig): void {
    this._config = config;
  }

  private _t = (key: string) => localize(this.hass, key);

  private _schema(): Schema[] {
    const t = this._t;
    return [
      { name: "title", selector: { text: {} } },
      { name: "label", selector: { label: { multiple: true } } },
      { name: "entities", selector: AUTOMATIONS },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_more"),
        icon: "mdi:tune-variant",
        flatten: true,
        schema: [
          {
            name: "group_by",
            selector: {
              select: {
                mode: "dropdown",
                options: ["none", "label", "area", "category"].map((v) => ({ value: v, label: t(`ed_group_${v}`) })),
              },
            },
          },
          { name: "confirm", selector: AUTOMATIONS },
          { name: "exclude", selector: AUTOMATIONS },
        ],
      },
    ];
  }

  private _label = (s: { name: string }) => {
    const key = `ed_${s.name}`;
    const v = this._t(key);
    return v === key ? s.name : v;
  };

  private _changed(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    // One label stays a plain text in YAML, several become a list.
    const labels = asList(v.label as string | string[] | undefined);
    v.label = labels.length === 1 ? labels[0] : labels;
    const config = { ...clean(v), type: this._config!.type } as FlowPulseCardConfig;
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  protected render() {
    if (!this.hass || !this._config || !this._ready) return nothing;
    const data = { group_by: "none", ...this._config, label: asList(this._config.label) };
    return html`
      <p class="hint">${this._t("ed_hint")}</p>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .hint {
      margin: 0 0 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
  `;
}
