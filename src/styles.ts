import { css } from "lit";

// Design: a calm list. One row per automation (icon disc, name, one quiet line, a switch, a menu).
// Surfaces stay neutral; colour appears only where it means something: the accent on an automation that
// is on, red for a failed last run, orange for one that needs a look. An automation that is off is
// muted as a whole, so the list reads at a glance. Shapes, chips and motion match the other Pulse cards.
export const cardStyles = css`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --fpc-accent: var(--pulse-accent, var(--primary-color));
    --fpc-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --fpc-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --fpc-bad: var(--pulse-bad, var(--red-color, #f44336));
    --fpc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --fpc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --fpc-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --fpc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --fpc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --fpc-chip-height: var(--pulse-chip-height, 30px);
    --fpc-row-height: var(--pulse-row-height, 56px);
    --fpc-gap: var(--pulse-gap, 12px);
    --fpc-pad: var(--pulse-pad, 12px);
    --fpc-motion-fast: var(--pulse-motion-fast, 120ms);
    --fpc-motion-normal: var(--pulse-motion-normal, 200ms);
    --fpc-motion-slow: var(--pulse-motion-slow, 250ms);
    --fpc-ease: var(--pulse-ease, ease);
    /* Switches read Home Assistant's own switch variables (set by the Pulse theme), so ours and the native
       ha-switch are one family: on in the accent; off a thumb on a faint track (HA draws the track at 38%). */
    --fpc-switch-on: var(--switch-checked-color, var(--fpc-accent));
    --fpc-switch-off-thumb: var(--switch-unchecked-button-color, var(--secondary-text-color));
    --fpc-switch-off-track: color-mix(in srgb, var(--switch-unchecked-track-color, var(--secondary-text-color)) 38%, transparent);
    /* Fills inside the menu: a share of the text colour, because the menu sits on HA's dialog surface,
       where a frosted-white fill (Pulse Glass light) would vanish. */
    --fpc-menu-fill: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    --fpc-menu-fill-hover: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--fpc-gap) - 4px);
    padding: var(--fpc-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--fpc-accent);
    outline-offset: 2px;
  }

  /* ---- Header: title and the quiet counts ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--fpc-chip-height);
    padding: 0 2px;
  }
  .title {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chips {
    display: flex;
    gap: 6px;
    flex: none;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--fpc-chip-height);
    padding: 0 12px 0 10px;
    border-radius: calc(var(--fpc-chip-height) / 2);
    background: var(--fpc-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease), color var(--fpc-motion-normal) var(--fpc-ease),
      transform var(--fpc-motion-fast) var(--fpc-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover {
    background: var(--fpc-neutral-bg-hover);
  }
  .chip:active {
    transform: scale(0.96);
  }
  .chip.selected,
  .chip.selected:hover {
    background: var(--fpc-neutral-strong);
    color: var(--primary-text-color);
  }
  .chip.attention ha-icon {
    color: var(--fpc-bad);
  }

  /* ---- Sections ---- */
  .section-title {
    margin: 6px 4px 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: var(--secondary-text-color);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ---- Rows ---- */
  .row {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--fpc-row-height);
    border-radius: var(--fpc-control-radius);
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .row:hover {
    background: var(--fpc-neutral-bg);
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 0 4px 0 8px;
    border-radius: var(--fpc-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
  }
  .main:focus-visible {
    box-shadow: inset 0 0 0 2px var(--fpc-accent);
  }
  .disc {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--fpc-neutral-bg);
    color: var(--c);
    transition: color var(--fpc-motion-slow) var(--fpc-ease), opacity var(--fpc-motion-slow) var(--fpc-ease);
    --mdc-icon-size: 20px;
  }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity var(--fpc-motion-slow) var(--fpc-ease);
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Colour by status: only the icon, and the words when something is wrong. */
  .row.on,
  .row.running {
    --c: var(--fpc-accent);
  }
  .row.failed {
    --c: var(--fpc-bad);
  }
  .row.failed .secondary {
    color: var(--fpc-bad);
  }
  .row.broken {
    --c: var(--fpc-warn);
  }
  .row.broken .secondary {
    color: var(--fpc-warn);
  }
  /* Off (and snoozed): the whole row steps back. */
  .row.off .disc,
  .row.snoozed .disc,
  .row.off .name,
  .row.snoozed .name {
    opacity: 0.55;
  }
  /* Running: the icon breathes while the run lasts (meaningful motion only). */
  .row.running .disc ha-icon {
    animation: fpc-breathe 1100ms var(--fpc-ease) infinite alternate;
  }
  @keyframes fpc-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  /* ---- Switch ---- */
  .switch {
    flex: none;
    width: 52px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
  }
  .switch[disabled] {
    cursor: default;
    opacity: 0.4;
  }
  .track {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: 12px;
    background: var(--fpc-switch-off-track);
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--fpc-switch-off-thumb);
    transition: transform var(--fpc-motion-normal) var(--fpc-ease), background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .switch.on .track {
    background: var(--fpc-switch-on);
  }
  .switch.on .thumb {
    transform: translateX(16px);
    background: var(--fpc-on-accent);
  }
  .switch.pending .thumb {
    animation: fpc-breathe 700ms var(--fpc-ease) infinite alternate;
  }

  /* ---- The ⋯ button ---- */
  .more {
    flex: none;
    width: 40px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--fpc-control-radius);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .more:hover,
  .more[aria-expanded="true"] {
    background: var(--fpc-neutral-bg-hover);
    color: var(--primary-text-color);
  }

  /* ---- Menu (a popover in the top layer, so no card can clip it) ---- */
  .menu {
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    min-width: 220px;
    max-width: min(300px, calc(100vw - 16px));
    padding: 6px;
    border: 1px solid var(--divider-color);
    border-radius: var(--fpc-control-radius);
    /* HA's own surface for things that float (dialogs): frosted in Pulse Glass, solid elsewhere. */
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
  }
  .menu:not(:popover-open):not(.open) {
    display: none;
  }
  .menu-head {
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: calc(var(--fpc-control-radius) - 4px);
    font-size: 14px;
    text-align: start;
    --mdc-icon-size: 20px;
  }
  .item ha-icon {
    color: var(--secondary-text-color);
  }
  .item:hover,
  .item:focus-visible {
    outline: none;
    background: var(--fpc-menu-fill);
  }
  .sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--divider-color);
  }
  .snooze {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px 10px 8px;
  }
  .snooze-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    --mdc-icon-size: 20px;
  }
  .snooze-label ha-icon {
    color: var(--secondary-text-color);
  }
  .presets {
    display: flex;
    gap: 6px;
    padding-inline-start: 32px;
    flex-wrap: wrap;
  }
  .presets .chip {
    padding: 0 12px;
    background: var(--fpc-menu-fill);
  }
  .presets .chip:hover {
    background: var(--fpc-menu-fill-hover);
  }

  /* ---- Empty and warnings ---- */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 28px;
  }
  .empty ha-icon {
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .empty .hint {
    font-size: 12px;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    .row,
    .disc,
    .name,
    .chip,
    .track,
    .thumb {
      transition: none;
    }
    .row.running .disc ha-icon,
    .switch.pending .thumb {
      animation: none;
      opacity: 0.6;
    }
  }
`;
