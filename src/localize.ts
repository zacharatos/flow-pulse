import type { HomeAssistant } from "./types";
import { untilKind } from "./flows";

type Dict = Record<string, string>;

const en: Dict = {
  title: "Automations",
  just_now: "just now",
  never_ran: "Never ran",
  running: "Running",
  failed: "Failed · {when}",
  failed_now: "Failed",
  broken: "Needs a look",
  snoozed_today: "Snoozed until {time}",
  snoozed_tomorrow: "Snoozed until tomorrow {time}",
  snoozed_week: "Snoozed until {day} {time}",
  snoozed_date: "Snoozed until {date}",
  chip_off: "{n} off",
  chip_attention: "{n} need a look",
  chip_attention_one: "1 needs a look",
  other: "Other",
  empty: "No automations here yet.",
  empty_hint: "Pick some in the card editor, or give them the card's label.",
  empty_filter: "Nothing here right now.",
  more: "More actions for {name}",
  toggle: "{name}: on or off",

  // Menu
  menu_run: "Run now",
  menu_run_check: "Run if conditions pass",
  menu_stop: "Stop and turn off",
  menu_snooze: "Snooze",
  menu_resume: "Resume now",
  menu_edit: "Edit automation",
  menu_traces: "Traces",
  snooze_1h: "1 h",
  snooze_8h: "8 h",
  snooze_1d: "1 day",
  snooze_1w: "1 week",

  // Confirmations and toasts
  confirm_off: "Turn off {name}?",
  confirm_run: "Run {name}?",
  confirm_stop: "Stop {name} and turn it off?",
  confirm_snooze: "Snooze {name}?",
  started: "{name} started",
  snoozed_toast: "{name} snoozed",
  error: "Couldn't do that: {error}",

  // Editor
  ed_title: "Title",
  ed_label: "Show automations with these labels",
  ed_entities: "Show these automations first",
  ed_exclude: "Never show",
  ed_group_by: "Group by",
  ed_group_none: "Nothing",
  ed_group_label: "Label",
  ed_group_area: "Area",
  ed_group_category: "Category",
  ed_confirm: "Ask before turning off or running",
  ed_hint: "The automations you pick come first, then every automation with one of the labels. With neither, the card shows all your automations.",
  ed_section_more: "More",
};

const el: Dict = {
  title: "Αυτοματισμοί",
  just_now: "μόλις τώρα",
  never_ran: "Δεν έχει τρέξει",
  running: "Τρέχει",
  failed: "Απέτυχε · {when}",
  failed_now: "Απέτυχε",
  broken: "Θέλει έλεγχο",
  snoozed_today: "Σε αναβολή έως τις {time}",
  snoozed_tomorrow: "Σε αναβολή έως αύριο {time}",
  snoozed_week: "Σε αναβολή έως {day} {time}",
  snoozed_date: "Σε αναβολή έως {date}",
  chip_off: "{n} ανενεργοί",
  chip_attention: "{n} θέλουν έλεγχο",
  chip_attention_one: "1 θέλει έλεγχο",
  other: "Άλλοι",
  empty: "Δεν υπάρχουν ακόμη αυτοματισμοί εδώ.",
  empty_hint: "Διάλεξε κάποιους στον επεξεργαστή της κάρτας ή δώσ' τους την ετικέτα της κάρτας.",
  empty_filter: "Τίποτα εδώ αυτή τη στιγμή.",
  more: "Περισσότερες ενέργειες για {name}",
  toggle: "{name}: ενεργός ή ανενεργός",

  menu_run: "Εκτέλεση τώρα",
  menu_run_check: "Εκτέλεση αν ισχύουν οι συνθήκες",
  menu_stop: "Διακοπή και απενεργοποίηση",
  menu_snooze: "Αναβολή",
  menu_resume: "Συνέχιση τώρα",
  menu_edit: "Επεξεργασία αυτοματισμού",
  menu_traces: "Ίχνη εκτέλεσης",
  snooze_1h: "1 ώρα",
  snooze_8h: "8 ώρες",
  snooze_1d: "1 μέρα",
  snooze_1w: "1 εβδ.",

  confirm_off: "Απενεργοποίηση του «{name}»;",
  confirm_run: "Εκτέλεση του «{name}»;",
  confirm_stop: "Διακοπή και απενεργοποίηση του «{name}»;",
  confirm_snooze: "Αναβολή του «{name}»;",
  started: "Ξεκίνησε: {name}",
  snoozed_toast: "Σε αναβολή: {name}",
  error: "Δεν έγινε: {error}",

  ed_title: "Τίτλος",
  ed_label: "Δείξε αυτοματισμούς με αυτές τις ετικέτες",
  ed_entities: "Δείξε πρώτα αυτούς τους αυτοματισμούς",
  ed_exclude: "Να μην εμφανίζονται ποτέ",
  ed_group_by: "Ομαδοποίηση κατά",
  ed_group_none: "Καμία",
  ed_group_label: "Ετικέτα",
  ed_group_area: "Χώρο",
  ed_group_category: "Κατηγορία",
  ed_confirm: "Ερώτηση πριν την απενεργοποίηση ή την εκτέλεση",
  ed_hint: "Πρώτα εμφανίζονται οι αυτοματισμοί που διαλέγεις, μετά όσοι έχουν μία από τις ετικέτες. Χωρίς κανένα από τα δύο, η κάρτα δείχνει όλους τους αυτοματισμούς σου.",
  ed_section_more: "Περισσότερα",
};

const LANGS: Record<string, Dict> = { en, el };

export function language(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || "en").split("-")[0];
}

export function localize(hass: HomeAssistant | undefined, key: string, vars: Record<string, string | number> = {}): string {
  const lang = language(hass);
  const dict = LANGS[lang] ?? en;
  const k = vars.n === 1 && (dict[`${key}_one`] ?? en[`${key}_one`]) ? `${key}_one` : key;
  let s = dict[k] ?? en[k] ?? key;
  for (const [name, v] of Object.entries(vars)) s = s.replace(`{${name}}`, String(v));
  return s;
}

const locale = (hass?: HomeAssistant) => hass?.locale?.language || hass?.language || "en";
const hour12 = (hass?: HomeAssistant) =>
  hass?.locale?.time_format === "12" ? true : hass?.locale?.time_format === "24" ? false : undefined;

/** "3 minutes ago", "yesterday", localised by the browser. Same as the other Pulse cards. */
export function relativeTime(hass: HomeAssistant | undefined, iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const secs = Math.round((t - now) / 1000);
  if (Math.abs(secs) < 45) return localize(hass, "just_now");
  const fmt = new Intl.RelativeTimeFormat(locale(hass), { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 86400],
    ["month", 30 * 86400],
    ["week", 7 * 86400],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) if (Math.abs(secs) >= size) return fmt.format(Math.round(secs / size), unit);
  return fmt.format(Math.round(secs / 60), "minute");
}

/** "Snoozed until 18:30", "… until tomorrow 07:00", "… until Fri 09:00", "… until 24 Oct". */
export function snoozedLabel(hass: HomeAssistant | undefined, iso: string, now = new Date()): string {
  const until = new Date(iso);
  if (Number.isNaN(until.getTime())) return "";
  const loc = locale(hass);
  const time = until.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", hour12: hour12(hass) });
  const kind = untilKind(until, now);
  if (kind === "today") return localize(hass, "snoozed_today", { time });
  if (kind === "tomorrow") return localize(hass, "snoozed_tomorrow", { time });
  if (kind === "week") return localize(hass, "snoozed_week", { day: until.toLocaleDateString(loc, { weekday: "short" }), time });
  return localize(hass, "snoozed_date", { date: until.toLocaleDateString(loc, { day: "numeric", month: "short" }) });
}
