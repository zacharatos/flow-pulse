// Pure card logic: hass + config in, plain data out. No DOM, so it runs under `node --test`.

import type { FlowPulseCardConfig, GroupBy, HassEntity, HomeAssistant, TraceSummary } from "./types";

export const DOMAIN = "automation";

/** What a row says about its automation, most important first. */
export type Status = "broken" | "running" | "failed" | "snoozed" | "off" | "on";

export interface Row {
  entity_id: string;
  name: string;
  status: Status;
  /** On or off as far as the switch is concerned (running and failed automations are on). */
  on: boolean;
  /** ISO time of the last trigger, if any. */
  last?: string;
  /** ISO time the snooze ends, if snoozed. */
  snoozedUntil?: string;
  /** Config id: links to the editor and traces. */
  id?: string;
  confirm: boolean;
}

export interface Group {
  key: string;
  /** Section title; empty for the single ungrouped list. */
  title: string;
  rows: Row[];
}

/** Snooze presets offered in the menu, in minutes. */
export const SNOOZE_PRESETS: { key: string; minutes: number }[] = [
  { key: "1h", minutes: 60 },
  { key: "8h", minutes: 8 * 60 },
  { key: "1d", minutes: 24 * 60 },
  { key: "1w", minutes: 7 * 24 * 60 },
];

export const asList = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export const isAutomation = (id: string) => id.startsWith(`${DOMAIN}.`);

export function displayName(hass: HomeAssistant, id: string): string {
  const s = hass.states[id];
  return String(hass.entities[id]?.name || s?.attributes.friendly_name || id.split(".")[1]?.replace(/_/g, " ") || id);
}

const byName = (hass: HomeAssistant) => (a: string, b: string) =>
  displayName(hass, a).localeCompare(displayName(hass, b), undefined, { sensitivity: "base", numeric: true });

/**
 * The automations the card shows, in order. Explicit `entities` first, in their order; then everything
 * carrying one of the labels, by name. With neither, every automation in the house, by name.
 * `exclude` applies to all of it. Filtering happens only here, so everything downstream sees one set.
 */
export function selectAutomations(hass: HomeAssistant, config: FlowPulseCardConfig): string[] {
  const exclude = new Set(config.exclude ?? []);
  const explicit = (config.entities ?? []).filter((id) => isAutomation(id) && !exclude.has(id));
  const labels = asList(config.label);
  const seen = new Set(explicit);
  const all = Object.keys(hass.states).filter((id) => isAutomation(id) && !exclude.has(id) && !seen.has(id));
  let extra: string[];
  if (labels.length) {
    extra = all.filter((id) => (hass.entities[id]?.labels ?? []).some((l) => labels.includes(l)));
  } else if (!explicit.length) {
    extra = all.filter((id) => !hass.entities[id]?.hidden);
  } else {
    extra = [];
  }
  return [...new Set([...explicit, ...extra.sort(byName(hass))])];
}

export const isUnavailable = (s?: HassEntity) => !s || s.state === "unavailable" || s.state === "unknown";
export const isRunning = (s?: HassEntity) => Number(s?.attributes.current ?? 0) > 0;

/** True when the last run ended in an error. */
export function isFailure(t?: TraceSummary): boolean {
  if (!t) return false;
  return !!t.error || t.script_execution === "error";
}

/** The newest trace of every automation, by config id. */
export function latestTraces(traces: TraceSummary[]): Map<string, TraceSummary> {
  const out = new Map<string, TraceSummary>();
  for (const t of traces) {
    const prev = out.get(t.item_id);
    if (!prev || Date.parse(t.timestamp.start) > Date.parse(prev.timestamp.start)) out.set(t.item_id, t);
  }
  return out;
}

export function statusOf(s: HassEntity | undefined, trace: TraceSummary | undefined, snoozedUntil: string | undefined): Status {
  if (isUnavailable(s)) return "broken";
  if (isRunning(s)) return "running";
  if (s!.state === "off") return snoozedUntil ? "snoozed" : "off";
  // A failure only counts while it is still the latest run.
  if (isFailure(trace)) {
    const last = s!.attributes.last_triggered;
    if (!last || Date.parse(trace!.timestamp.start) >= Date.parse(last) - 2000) return "failed";
  }
  return "on";
}

export function buildRows(
  hass: HomeAssistant,
  config: FlowPulseCardConfig,
  ids: string[],
  traces: Map<string, TraceSummary>,
  snoozes: Record<string, string>
): Row[] {
  const confirm = new Set(config.confirm ?? []);
  return ids.map((entity_id) => {
    const s = hass.states[entity_id];
    const id = s?.attributes.id ? String(s.attributes.id) : undefined;
    const snoozedUntil = s?.state === "off" ? snoozes[entity_id] : undefined;
    const status = statusOf(s, id ? traces.get(id) : undefined, snoozedUntil);
    return {
      entity_id,
      name: displayName(hass, entity_id),
      status,
      on: s?.state === "on",
      last: s?.attributes.last_triggered ? String(s.attributes.last_triggered) : undefined,
      snoozedUntil,
      id,
      confirm: confirm.has(entity_id),
    };
  });
}

/** Header counts. Only what needs a look: off (incl. snoozed) and failed or broken. */
export function summary(rows: Row[]): { off: number; attention: number } {
  let off = 0;
  let attention = 0;
  for (const r of rows) {
    if (r.status === "off" || r.status === "snoozed") off++;
    if (r.status === "failed" || r.status === "broken") attention++;
  }
  return { off, attention };
}

export type Filter = "all" | "off" | "attention";

export function applyFilter(rows: Row[], filter: Filter): Row[] {
  if (filter === "off") return rows.filter((r) => r.status === "off" || r.status === "snoozed");
  if (filter === "attention") return rows.filter((r) => r.status === "failed" || r.status === "broken");
  return rows;
}

export interface GroupSources {
  labelNames?: Record<string, string>;
  /** entity id → category id (from the full entity registry). */
  categoryOf?: Record<string, string | undefined>;
  categoryNames?: Record<string, string>;
  /** Title for automations that fit no group. */
  other: string;
}

/**
 * Split rows into titled sections. Rows keep their order inside a section; sections are sorted by title
 * with "other" last. Labels used to *select* automations are skipped when grouping by label, since every
 * row would share them; a row with several remaining labels goes under the first by name.
 */
export function groupRows(
  hass: HomeAssistant,
  config: FlowPulseCardConfig,
  rows: Row[],
  by: GroupBy,
  src: GroupSources
): Group[] {
  if (by === "none" || !rows.length) return [{ key: "", title: "", rows }];
  const selecting = new Set(asList(config.label));
  const keyOf = (r: Row): { key: string; title: string } | undefined => {
    const reg = hass.entities[r.entity_id];
    if (by === "area") {
      const area = reg?.area_id;
      return area ? { key: area, title: hass.areas?.[area]?.name ?? area } : undefined;
    }
    if (by === "category") {
      const cat = src.categoryOf?.[r.entity_id];
      return cat ? { key: cat, title: src.categoryNames?.[cat] ?? cat } : undefined;
    }
    const names = src.labelNames ?? {};
    const labels = (reg?.labels ?? [])
      .filter((l) => !selecting.has(l))
      .map((l) => ({ key: l, title: names[l] ?? l }))
      .sort((a, b) => a.title.localeCompare(b.title));
    return labels[0];
  };
  const groups = new Map<string, Group>();
  const other: Group = { key: "__other", title: src.other, rows: [] };
  for (const r of rows) {
    const k = keyOf(r);
    if (!k) {
      other.rows.push(r);
      continue;
    }
    if (!groups.has(k.key)) groups.set(k.key, { key: k.key, title: k.title, rows: [] });
    groups.get(k.key)!.rows.push(r);
  }
  const sorted = [...groups.values()].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
  if (other.rows.length) sorted.push(other);
  // One section only: a title adds nothing.
  if (sorted.length === 1) return [{ key: "", title: "", rows: sorted[0].rows }];
  return sorted;
}

export type MenuKey = "run" | "run_check" | "stop" | "snooze" | "resume" | "edit" | "traces";

/** Which menu entries a row offers. */
export function menuFor(row: Row, opts: { admin: boolean; snooze: boolean }): MenuKey[] {
  const out: MenuKey[] = [];
  if (row.status !== "broken") out.push("run", "run_check");
  if (row.status === "running") out.push("stop");
  if (row.status === "snoozed") out.push("resume");
  else if (opts.snooze && row.on && row.status !== "broken") out.push("snooze");
  if (opts.admin && row.id) out.push("edit", "traces");
  return out;
}

/** The entity ids whose changes re-render the card. */
export const watched = (ids: string[]) => new Set(ids);

/** A string that changes whenever one of the shown automations ran or finished: the cue to re-read traces. */
export function traceKey(hass: HomeAssistant, ids: string[]): string {
  return ids
    .map((id) => {
      const s = hass.states[id];
      return `${s?.attributes.last_triggered ?? ""}|${s?.attributes.current ?? 0}`;
    })
    .join(";");
}

/** When the card opens with nothing configured in the picker: the four most recently triggered automations. */
export function stubEntities(hass: HomeAssistant | undefined, n = 4): string[] {
  if (!hass) return [];
  return Object.values(hass.states)
    .filter((s) => isAutomation(s.entity_id) && !hass.entities?.[s.entity_id]?.hidden)
    .sort((a, b) => Date.parse(String(b.attributes.last_triggered ?? 0)) - Date.parse(String(a.attributes.last_triggered ?? 0)))
    .slice(0, n)
    .map((s) => s.entity_id);
}

/** How the end of a snooze reads: later today, tomorrow, this week, or further away. */
export type UntilKind = "today" | "tomorrow" | "week" | "date";

export function untilKind(until: Date, now: Date): UntilKind {
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((day(until) - day(now)) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 7) return "week";
  return "date";
}
