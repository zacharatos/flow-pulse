// Minimal Home Assistant frontend types used by the card.
// Kept local so the card has no dependency on custom-card-helpers (same as the other Pulse cards).

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    icon?: string;
    /** The automation's config id: links to its editor and its traces. */
    id?: string;
    /** ISO time of the last trigger, or null when it never ran. */
    last_triggered?: string | null;
    /** How many runs are in progress right now. */
    current?: number;
    mode?: string;
  };
  last_changed: string;
  last_updated: string;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string | null;
  area_id?: string | null;
  hidden?: boolean;
  labels?: string[];
}

export interface HassConnection {
  subscribeMessage: <T>(callback: (msg: T) => void, msg: Record<string, unknown>) => Promise<() => Promise<void> | void>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  areas?: Record<string, { area_id: string; name: string }>;
  user?: { is_admin?: boolean };
  language: string;
  locale?: { language: string; time_format?: string };
  themes?: { darkMode?: boolean };
  connection: HassConnection;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
}

export type GroupBy = "none" | "label" | "area" | "category";

export interface FlowPulseCardConfig {
  type: string;
  /** Header title. Default "Automations"; an empty text hides it. */
  title?: string;
  /** Automations shown first, in this order. */
  entities?: string[];
  /** Label ids: every automation carrying one of them is shown too, after `entities`, by name. */
  label?: string | string[];
  /** Never shown, even when they carry the label. */
  exclude?: string[];
  /** Section titles by label, area or Home Assistant category. Default none. */
  group_by?: GroupBy;
  /** Ask before turning these off, running, stopping or snoozing them. */
  confirm?: string[];
}

/** The latest trace of one automation, as `trace/list` sends it (subset). */
export interface TraceSummary {
  item_id: string;
  run_id?: string;
  state?: string;
  script_execution?: string | null;
  error?: string;
  timestamp: { start: string; finish?: string | null };
}

export interface LabelEntry {
  label_id: string;
  name: string;
  icon?: string | null;
}

export interface CategoryEntry {
  category_id: string;
  name: string;
}

/** Native Home Assistant action config (subset). Passed through untouched to HA's `hass-action`. */
export interface ActionConfig {
  action: "none" | "more-info" | "navigate" | "perform-action";
  navigation_path?: string;
  perform_action?: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: boolean | { text?: string };
}
