import { test } from "node:test";
import assert from "node:assert/strict";

import { localize, relativeTime } from "../src/localize.ts";

const hass = (language) => ({ language, locale: { language } });

test("plural _one keys and fallbacks", () => {
  assert.equal(localize(hass("en"), "chip_attention", { n: 1 }), "1 needs a look");
  assert.equal(localize(hass("en"), "chip_attention", { n: 3 }), "3 need a look");
  assert.equal(localize(hass("el"), "chip_attention", { n: 1 }), "1 θέλει έλεγχο");
  assert.equal(localize(hass("fr"), "title"), "Automations");
});

test("every key exists in English and Greek with the same placeholders", async () => {
  const src = await import("node:fs").then((fs) => fs.readFileSync(new URL("../src/localize.ts", import.meta.url), "utf8"));
  const block = (name) => src.split(`const ${name}: Dict = {`)[1].split("\n};")[0];
  const keys = (b) => Object.fromEntries([...b.matchAll(/^\s+(\w+): "(.*)",$/gm)].map((m) => [m[1], [...m[2].matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join()]));
  const en = keys(block("en"));
  const el = keys(block("el"));
  assert.deepEqual(Object.keys(el).sort(), Object.keys(en).sort());
  for (const k of Object.keys(en)) assert.equal(el[k], en[k], `placeholders of ${k}`);
});

test("relative time", () => {
  const now = Date.parse("2026-10-10T12:00:00Z");
  assert.equal(relativeTime(hass("en"), "2026-10-10T11:59:50Z", now), "just now");
  assert.equal(relativeTime(hass("en"), "2026-10-10T09:00:00Z", now), "3 hours ago");
  assert.equal(relativeTime(hass("en"), "2026-03-10T12:00:00Z", now), "7 months ago");
});
