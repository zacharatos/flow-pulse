import { test } from "node:test";
import assert from "node:assert/strict";

import {
  applyFilter,
  buildRows,
  groupRows,
  latestTraces,
  menuFor,
  selectAutomations,
  statusOf,
  stubEntities,
  summary,
  traceKey,
  untilKind,
} from "../src/flows.ts";

// An invented home. Never put real entity ids or names here.
const NOW = Date.parse("2026-10-10T12:00:00Z");
const ago = (m) => new Date(NOW - m * 60000).toISOString();
function home() {
  const states = {};
  const entities = {};
  const add = (id, state, attrs = {}, reg = {}) => {
    states[id] = { entity_id: id, state, attributes: { friendly_name: id.split(".")[1].replace(/_/g, " "), ...attrs }, last_changed: ago(1), last_updated: ago(1) };
    entities[id] = { entity_id: id, ...reg };
  };
  add("automation.hall_night_light", "on", { id: "hall", last_triggered: ago(60) }, { labels: ["dashboard", "lights"], area_id: "hall" });
  add("automation.warm_up_bathroom", "off", { id: "bath", last_triggered: ago(60 * 24 * 200) }, { labels: ["dashboard", "climate"] });
  add("automation.desk_lamp", "on", { id: "desk", last_triggered: ago(5), current: 1 }, { labels: ["dashboard", "lights"], area_id: "office" });
  add("automation.alarm_morning", "on", { id: "alarm", last_triggered: ago(600) }, { labels: ["security"] });
  add("automation.broken_one", "unavailable", {}, { labels: ["dashboard"] });
  add("automation.hidden_helper", "on", {}, { hidden: true });
  add("light.kitchen", "on");
  return {
    states,
    entities,
    areas: { hall: { area_id: "hall", name: "Hall" }, office: { area_id: "office", name: "Office" } },
    language: "en",
  };
}

test("zero config shows every visible automation by name", () => {
  const hass = home();
  assert.deepEqual(selectAutomations(hass, {}), [
    "automation.alarm_morning",
    "automation.broken_one",
    "automation.desk_lamp",
    "automation.hall_night_light",
    "automation.warm_up_bathroom",
  ]);
});

test("explicit entities first in their order, then label matches by name, minus exclude", () => {
  const hass = home();
  const ids = selectAutomations(hass, {
    entities: ["automation.warm_up_bathroom", "automation.alarm_morning", "light.kitchen"],
    label: "dashboard",
    exclude: ["automation.broken_one"],
  });
  assert.deepEqual(ids, ["automation.warm_up_bathroom", "automation.alarm_morning", "automation.desk_lamp", "automation.hall_night_light"]);
  // Only explicit entities: nothing else sneaks in.
  assert.deepEqual(selectAutomations(hass, { entities: ["automation.desk_lamp"] }), ["automation.desk_lamp"]);
  // Several labels.
  assert.equal(selectAutomations(hass, { label: ["security", "climate"] }).length, 2);
});

test("status priority", () => {
  const on = { entity_id: "automation.x", state: "on", attributes: { last_triggered: ago(10) } };
  const fail = { item_id: "x", timestamp: { start: ago(10) }, script_execution: "error" };
  assert.equal(statusOf(undefined, undefined, undefined), "broken");
  assert.equal(statusOf({ ...on, state: "unavailable" }, fail, undefined), "broken");
  assert.equal(statusOf({ ...on, attributes: { current: 2 } }, fail, undefined), "running");
  assert.equal(statusOf(on, fail, undefined), "failed");
  assert.equal(statusOf(on, { ...fail, script_execution: "finished", error: "boom" }, undefined), "failed");
  assert.equal(statusOf(on, { ...fail, script_execution: "failed_conditions" }, undefined), "on");
  // A newer run than the failed trace: not failed any more.
  assert.equal(statusOf({ ...on, attributes: { last_triggered: ago(1) } }, fail, undefined), "on");
  assert.equal(statusOf({ ...on, state: "off" }, fail, ago(-60)), "snoozed");
  assert.equal(statusOf({ ...on, state: "off" }, undefined, undefined), "off");
});

test("latest trace per automation", () => {
  const map = latestTraces([
    { item_id: "a", timestamp: { start: ago(10) }, script_execution: "error" },
    { item_id: "a", timestamp: { start: ago(2) }, script_execution: "finished" },
    { item_id: "b", timestamp: { start: ago(5) }, script_execution: "error" },
  ]);
  assert.equal(map.get("a").script_execution, "finished");
  assert.equal(map.get("b").script_execution, "error");
});

test("rows, summary and filters", () => {
  const hass = home();
  const ids = selectAutomations(hass, {});
  const traces = latestTraces([{ item_id: "alarm", timestamp: { start: ago(600) }, script_execution: "error" }]);
  const rows = buildRows(hass, { confirm: ["automation.alarm_morning"] }, ids, traces, { "automation.warm_up_bathroom": ago(-120) });
  const by = Object.fromEntries(rows.map((r) => [r.entity_id, r]));
  assert.equal(by["automation.alarm_morning"].status, "failed");
  assert.equal(by["automation.alarm_morning"].confirm, true);
  assert.equal(by["automation.warm_up_bathroom"].status, "snoozed");
  assert.equal(by["automation.desk_lamp"].status, "running");
  assert.equal(by["automation.broken_one"].status, "broken");
  assert.deepEqual(summary(rows), { off: 1, attention: 2 });
  assert.deepEqual(applyFilter(rows, "attention").map((r) => r.id ?? r.entity_id), ["alarm", "automation.broken_one"]);
  assert.equal(applyFilter(rows, "off").length, 1);
  assert.equal(applyFilter(rows, "all").length, 5);
});

test("grouping by label skips the selecting label; by area; one group means no titles", () => {
  const hass = home();
  const config = { label: "dashboard" };
  const rows = buildRows(hass, config, selectAutomations(hass, config), new Map(), {});
  const labels = groupRows(hass, config, rows, "label", { labelNames: { lights: "Lights", climate: "Climate" }, other: "Other" });
  assert.deepEqual(labels.map((g) => [g.title, g.rows.length]), [["Climate", 1], ["Lights", 2], ["Other", 1]]);
  const areas = groupRows(hass, config, rows, "area", { other: "Other" });
  assert.deepEqual(areas.map((g) => g.title), ["Hall", "Office", "Other"]);
  const cats = groupRows(hass, config, rows, "category", { categoryOf: {}, other: "Other" });
  assert.deepEqual(cats.map((g) => g.title), [""]);
  assert.equal(groupRows(hass, config, rows, "none", { other: "Other" })[0].rows.length, 4);
});

test("menu entries", () => {
  const row = (status, extra = {}) => ({ entity_id: "automation.x", name: "x", status, on: status !== "off" && status !== "snoozed", id: "x", confirm: false, ...extra });
  assert.deepEqual(menuFor(row("on"), { admin: true, snooze: true }), ["run", "run_check", "snooze", "edit", "traces"]);
  assert.deepEqual(menuFor(row("running"), { admin: false, snooze: true }), ["run", "run_check", "stop", "snooze"]);
  assert.deepEqual(menuFor(row("snoozed"), { admin: false, snooze: true }), ["run", "run_check", "resume"]);
  assert.deepEqual(menuFor(row("off"), { admin: true, snooze: true }), ["run", "run_check", "edit", "traces"]);
  assert.deepEqual(menuFor(row("broken", { id: undefined }), { admin: true, snooze: true }), []);
  assert.deepEqual(menuFor(row("on"), { admin: false, snooze: false }), ["run", "run_check"]);
});

test("trace key changes when an automation runs or finishes", () => {
  const hass = home();
  const ids = ["automation.desk_lamp"];
  const before = traceKey(hass, ids);
  hass.states["automation.desk_lamp"] = { ...hass.states["automation.desk_lamp"], attributes: { current: 0, last_triggered: ago(5) } };
  assert.notEqual(traceKey(hass, ids), before);
});

test("stub picks the most recently triggered, never hidden ones", () => {
  assert.deepEqual(stubEntities(home(), 2), ["automation.desk_lamp", "automation.hall_night_light"]);
  assert.deepEqual(stubEntities(undefined), []);
});

test("until kinds", () => {
  const now = new Date(2026, 9, 10, 12, 0);
  assert.equal(untilKind(new Date(2026, 9, 10, 18, 30), now), "today");
  assert.equal(untilKind(new Date(2026, 9, 11, 7, 0), now), "tomorrow");
  assert.equal(untilKind(new Date(2026, 9, 14, 9, 0), now), "week");
  assert.equal(untilKind(new Date(2026, 9, 24, 9, 0), now), "date");
});
