# Through the Breach — FoundryVTT System

> **Self-updating instructions:** This file MUST be updated automatically by Copilot agents whenever new conventions, critical bugs/fixes, architectural decisions, or gotchas are discovered. Do not wait for the user to ask — if something important is learned during a session, update this file as part of the work.

This repo is a **FoundryVTT Game System** (`system.json`) for the *Through the Breach* TTRPG by Wyrd Miniatures. The goal is to grow it into a full system capable of running a complete TTB adventure.

## Architecture

| Path | Purpose |
|------|---------|
| `system.json` | Foundry system manifest. `id` must stay `ttb-actors` (matches install folder). Current version: `0.1.26`. Verified on Foundry **v13**. |
| `template.json` | Declarative data model for all Actor/Item types. Edit this to add new fields — no JS needed for data shape. |
| `scripts/main.js` | ES module entry point. Registers actor class, sheets, and preloads templates via `Hooks.once("init")`. |
| `scripts/actors/` | `Actor` document subclasses. Derived stats computed in `prepareDerivedData()`. |
| `scripts/sheets/` | `ActorSheet` subclasses. `getData()` enriches context; `activateListeners()` wires UI events. |
| `templates/actors/` | Handlebars (`.hbs`) sheet templates. Tabs driven by Foundry's built-in tab system. |
| `styles/ttb.css` | All CSS. Dark Victorian/Steampunk aesthetic using CSS custom properties. Every class must be prefixed `.ttb-` to avoid collisions. |
| `lang/en.json` | English strings. All localization keys use `TTB.` namespace. Use `game.i18n.localize("TTB.Key")` in JS and `{{localize "TTB.Key"}}` in HBS. |
| `scripts/create-ttb-actor.js` | Legacy CJS helper used only by Node unit tests. Do not import this in Foundry code. |
| `scripts/compile-packs.mjs` | Converts source `.db` compendium exports into Foundry v12+/v13 LevelDB pack directories. Run with `npm run compile-packs`. |
| `packs/` | Compendium content. Keep the LevelDB pack directories referenced by `system.json`; `.db` source files remain in `packs/` for compilation, and older legacy copies are preserved under `packs/archive/`. |
| `test/` | Node.js unit tests (`node --test`). Run with `npm test`. Tests must not depend on Foundry globals. |
| `.github/workflows/release.yml` | Pushes a `v*` tag → builds `system.zip` → creates GitHub Release. Required for Foundry's manifest installer. |
| `rules/` | **Authoritative Markdown rules reference files** — see section below. Always consult these before implementing any game mechanic. |

## Rules Reference Files

All game rules are captured as structured Markdown in `rules/`. **Always read the relevant file before implementing any mechanic** — these are the authoritative source of truth for the TTB ruleset.

| File | Contents |
|------|----------|
| `rules/chapter-03-character-creation.md` | 14-step character creation, Station/Aspect tables, Cross Roads Tarot, Destiny Spread |
| `rules/chapter-04-pursuits.md` | All Pursuits (Arcanist, Bounty Hunter, Dabbler, Death Marshal, Doctor, Drifter, Enforcer, Explorer, Gambler, Gunfighter, Infiltrator, Malifaux Rat, Mercenary, Performer, Reporter, Scavenger, Seeker, Sorcerer, Tinkerer, Wastrel, etc.) and their Pursuit Talents |
| `rules/chapter-05-skills.md` | All 39 skills with full descriptions, governing Attribute, and all named Triggers (suit + effect) |
| `rules/chapter-06-general-talents.md` | All General Talents with requirements and descriptions |
| `rules/chapter-07-equipment.md` | Weapons (melee & ranged stat blocks), Armor, Gear, Upgrades, costs, damage tracks |
| `rules/chapter-08-magic.md` | Magia list, Immutos, spell construction rules, theoretical schools, casting mechanics |
| `rules/chapter-09-gameplay.md` | Flip/duel resolution, AP actions, movement, range, conditions (Burning/Slow/Fast/Stunned/etc.), combat rules, initiative (Rushing the Season), terrain |
| `rules/chapter-10-bestiary.md` | 200+ NPC stat blocks — Guild, Resurrectionists, Neverborn, Gremlins, Arcanists, Ten Thunders, Freikorps, Void, Summoned Constructs, Elementals; includes Minion/Enforcer/Master/Peon ranks, Actions, Abilities, Attack profiles |

### How to use the rules files
- When implementing a mechanic (flip resolution, condition effect, NPC stat block layout), **read the relevant chapter first**.
- Stat block format for NPCs is defined in `rules/chapter-10-bestiary.md` — follow that schema exactly for the NPC actor type.
- Talent/Spell data for compendium packs comes from ch04–ch08.
- Condition automation rules (tick damage, AP penalties) are in `rules/chapter-09-gameplay.md`.

## Through the Breach Game Rules Context

### Core Mechanics
- **Flip-based resolution**: players flip cards from a personal **Fate Deck** (standard 52-card deck + Jokers) rather than rolling dice.
- **Target Number (TN)**: each action has a TN; flip a card and add the relevant **Attribute + Skill** value. Meet or beat TN to succeed.
- **Suits matter**: some abilities trigger on specific suits (Crow ♠, Mask ♣, Ram ♥, Tome ♦). Internally stored as strings: `"crow"`, `"mask"`, `"ram"`, `"tome"`.
- **Cheating Fate**: players may have a **Hand** of cards and can replace a flip with a card from their hand.

### Fated (Player Characters)
- 8 **Attributes**: Might, Grace, Speed, Resilience, Charm, Cunning, Tenacity, Intellect (values 1–5, default 2).
- 39 **Skills** grouped by attribute (see `template.json` for full list). Each skill has a rank 0–5.
- Each skill also has `triggers` (text, e.g. "♠ +2 damage"), `practiced` (boolean checkbox), and belongs to one attribute.
- **Derived stats** (auto-calculated, never stored):
  - Defense = Grace
  - Willpower = Tenacity
  - Walk = Speed
  - Charge = Speed + 2
  - Height = 2 (always)
  - Max Wounds = Resilience × 2
- **Flip total per skill** = attribute value + skill rank (shown as a badge on the Skills tab).
- **Aspects**: Crow, Mask, Ram, Tome — the character's magical/spiritual affinity.
- **Station**: narrative background (e.g. Outcast, Enforcer, Guild Member).
- **Conditions**: Burning (0–4), Focused (0–10), Slow, Fast, Stunned, Paralyzed, Distracted, Immobilized, Defensive.
- **Wounds**: current / max. Reaching max wounds = character is dying. Plus a "Serious Wound" text field.
- **Soulstones**: resource pool (value + max, displayed as clickable dots).
- **Destiny**: 5-card Fate Spread, 5 Destiny Steps (text + completed checkbox), current step number, Personal Agenda (text + completed checkbox).
- **Pursuits tab**: Pursuits (table with name/session), Talents, Other Abilities (2-column layout), Manifested Powers (full-width below).
- **Grimoire tab**: Spell entries with Theory, Name, Cost, Range, Duration, Description.
- **Allegiance**: Guild, Arcanists, Resurrectionists, Neverborn, Ten Thunders, Outcasts, Unaffiliated.

### Fate Deck / Control Hand (v0.1.17+)
The system now uses a **communal world Fate Deck** plus **per-character Control Hands**:
- World deck: `TTB Fate Deck` — type `"deck"`
- World discard: `TTB Fate Discard` — type `"pile"`
- Per character: `[Name]'s Control Hand` — type `"hand"`
- Per character: `[Name]'s Discard` — type `"pile"`

World stack IDs are stored in `game.settings`:
```js
game.settings.get("ttb-actors", "fateDeckId");
game.settings.get("ttb-actors", "fatePileId");
```

Per-character stack IDs are stored on actor at `system.fateDeck.{ handId, discardId }`.

**TTB Card Data (54 cards):**
- 4 suits × 13 values: Crow, Mask, Ram, Tome (capitalized in `card.suit`)
- Value names: 1=Ace, 11=Jack, 12=Queen, 13=King
- Red Joker: `{ suit: "Joker", value: 14 }` — critical success (TN +14, triggers on any suit)
- Black Joker: `{ suit: "Joker", value: 0 }` — critical failure (TN +0, Bad Luck Twist)

**Foundry Cards API patterns used:**
```js
// Get top card and move to discard (Flip)
const sorted = deck.cards.contents.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));
await deck.pass(discard, [sorted[0].id]);

// Move from Control Hand to discard (Cheat Fate / Play)
await hand.pass(discard, [cardId]);

// Reshuffle all discard back into deck
await discard.pass(deck, discard.cards.contents.map(c => c.id));
await deck.shuffle();
```

**Foundry v13 card visibility gotcha** — after `pass()`, explicitly reveal moved cards with `face: 0` or they stay face-down in the destination stack:
```js
await stack.updateEmbeddedDocuments("Card", [{ _id: cardId, face: 0 }]);
```

**Reshuffle gotcha** — after moving discard back into deck, reset both `drawn: false` and `face: null` on all deck cards or Foundry may refuse to pass them again:
```js
const updates = deck.cards.contents.map(c => ({ _id: c.id, drawn: false, face: null }));
await deck.updateEmbeddedDocuments("Card", updates);
```

**Last flip storage** — store a data snapshot, NOT the card ID:
```js
await actor.update({
  "system.fateDeck.lastFlip.suit":  card.suit,
  "system.fateDeck.lastFlip.value": card.value,
  "system.fateDeck.lastFlip.name":  card.name,
});
```
Read back via `cardDisplayInfoFromData(suit, value, name)` in `getData()`.

**`TtbActor.createWorldFateDeck()` is public** — wired from GM Tools. It must guard against duplicate deck creation by checking the saved world deck setting and only recreate when the referenced stack no longer exists.

**`_createControlHand()` auto-runs on character create** — if it fails or the stacks are deleted, the sheet offers a manual recreate flow.

### Items (v0.1.7+)
- **Weapon**: `apCost`, `rangeType`, `damageWeak/damageMod/damageSevere`, `range`, `capacity`, `reload`, `triggers`, `special`, `description`, `equipped`.
- **Armor**: `defenseBonus`, `soak` (flat damage reduction, summed as `system.derived.soak`), `special`, `description`, `cost`, `equipped`.
- **Gear**: `quantity`, `description`, `cost`.
- **Talent**: `pursuit`, `requirements`, `description`. Shown in Talents table on Equipment tab.
- **Spell**: `theory`, `tn`, `range`, `duration`, `immutos`, `description`. Shown in Spells table on Equipment tab.
- Item names are clickable links (`.ttb-item-name-link`) to open item sheet.
- `_onDropItem()` on character sheet allows drag-and-drop from sidebar/compendium (allowed types: weapon, armor, gear, talent, spell).

### Fatemaster Characters (NPCs) — *in progress (feature/npc-actor)*
- Simpler stat block: Df (Defense), Wp (Willpower), Wounds, relevant skills only.
- Minions share a single wound pool; Peons are defeated on any damage.

### Key Future Systems to Build
| Feature | Notes |
|---------|-------|
| Twists | Special effects triggered by Jokers or suit matches |
| Pursuits advancement | XP/scrip spending to gain talents |
| Fatemaster tools | Encounter builder, NPC quick-creator |
| Initiative | Card-based (Rushing the Season); suits determine order |

## Development Conventions

### Handlebars Templates — Critical Constraints
- **No custom helpers available.** Foundry ships only `{{#if}}`, `{{#each}}`, `{{#unless}}`, `{{eq}}`, `{{localize}}`. There is **no** `{{add}}`, `{{math}}`, `{{multiply}}`, etc.
- **All computed values must be pre-computed in `getData()`** and passed as context properties.
- Example: flip totals (`attrVal + skill.value`) are computed in `getData()` → passed as `total` on each skill object → rendered as `{{total}}`.
- Inside nested `{{#each}}`, use `{{../parentProp}}` to access the parent scope. E.g., inside `{{#each suitButtons}}` nested in `{{#each attributes}}`, use `{{../key}}` for the attribute key.

### Array Corruption Bug — MUST READ
Foundry's `expandObject()` converts array paths like `system.pursuits.0.name` into plain objects `{ "0": {...} }` rather than real arrays. This corrupts `pursuits`, `talents`, `manifestedPowers`, `otherAbilities`, `grimoire`, `destiny.steps`, `destiny.spread`.

**Fix**: override `_updateObject()` in the sheet class and call `repairArrays()` before saving:
```js
async _updateObject(event, formData) {
  const expanded = repairArrays(foundry.utils.expandObject(formData));
  return this.actor.update(expanded);
}

function repairArrays(expanded) {
  const sys = expanded?.system;
  if (!sys) return expanded;
  for (const field of ["pursuits", "talents", "manifestedPowers", "otherAbilities", "grimoire"]) {
    if (sys[field] && !Array.isArray(sys[field])) sys[field] = Object.values(sys[field]);
  }
  if (sys.destiny) {
    for (const field of ["steps", "spread"]) {
      if (sys.destiny[field] && !Array.isArray(sys.destiny[field]))
        sys.destiny[field] = Object.values(sys.destiny[field]);
    }
  }
  return expanded;
}
```

**Also**: always read array fields via a `toArray()` helper:
```js
function toArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.values(raw);
}
```

**Fate Deck arrays do NOT use form `name=` binding** — they are managed entirely via explicit JS listeners using `this.actor.update()` with dot-path keys. No array corruption risk there.

### Grimoire and Trigger Fields — Save Pattern
Grimoire fields and skill trigger inputs save via explicit `.change()` listeners using `data-*` attributes, NOT via `name=` form binding. This avoids the array corruption issue. Do not add `name` attributes to these inputs.

### Suit Selector Pattern (Attribute Cards)
Each attribute card shows 4 clickable suit buttons (not a `<select>`). The JS listener:
```js
html.find(".ttb-attr-suit-btn").click((ev) => {
  const attr = ev.currentTarget.dataset.attr;
  const suit = ev.currentTarget.dataset.suit;
  const current = this.actor.system.attributes?.[attr]?.suit ?? "";
  this.actor.update({ [`system.attributes.${attr}.suit`]: current === suit ? "" : suit });
});
```
Clicking the already-active suit deselects it (sets to `""`). Active colors per suit: Crow = blue-purple, Mask = green, Ram = burgundy, Tome = gold.

### CSS — Foundry Override Gotchas
- **Foundry sets `button { width: 100%; }` globally.** Any custom button that should NOT be full-width must explicitly set `width: auto; flex-shrink: 0;` or a fixed pixel width. This includes all Fate Deck buttons (`.ttb-deck-flip`, `.ttb-hand-play`, etc.).
- CSS variables are defined in `:root` — see `styles/ttb.css` for the full palette (`--ttb-parchment`, `--ttb-burgundy`, `--ttb-gold`, etc.).

### Foundry v13 Scene Controls — GM Tools Gotchas
- `getSceneControlButtons` in v13 uses `Record<string, SceneControl>` and `tools` is also a record, not the older array format.
- Do **not** set `layer: "tokens"` on the custom GM Tools group. Doing so can reactivate the built-in token controls and prevent the sub-panel from staying open.
- Use a non-button placeholder as `activeTool` so clicking the wizard hat opens the GM Tools sub-panel without firing an action.
- The actual actions (`Create World Fate Deck`, `Open Fate Deck`, `Open Discard Pile`, `Reshuffle`) should be `button: true` tools that run from `onChange`.

### Compendium Pack Format (v0.1.20+)
- Foundry v12+ / v13 requires **LevelDB compendium directories**, not legacy NeDB `.db` packs, for runtime use.
- Source content is still maintained in `.db` files and compiled into `packs/<name>/` via `npm run compile-packs`.
- `system.json` must point pack `path` entries at the **directory** (for example `packs/ttb-weapons`), not the legacy `.db` file.
- Legacy `.db` pack sources are kept under `packs/archive/` once compiled/migrated; do not delete them unless the source-of-truth workflow changes.
- `scripts/compile-packs.mjs` uses `classic-level`; keep that dependency in `package.json`.

### Adding a New Actor Type
1. Add the type string to `template.json` → `Actor.types`.
2. Define its data template under `Actor.templates` or inline under `Actor.<type>`.
3. Create `scripts/actors/<type>-actor.js` extending `TtbActor` (or `Actor` directly).
4. Create `scripts/sheets/<type>-sheet.js` extending `ActorSheet`.
5. Create `templates/actors/<type>-sheet.hbs`.
6. Register the sheet in `scripts/main.js` via `Actors.registerSheet()`.
7. Add all labels to `lang/en.json`.

### Adding a New Item Type
Same pattern as actors but under `Item.types` in `template.json`, `scripts/items/`, `scripts/sheets/`, `templates/items/`.

### Computed / Derived Data
Never store derived values as raw editable fields if they can be computed. Override `prepareDerivedData()` in the Actor subclass.

### Foundry Version Compatibility
- Target: Foundry **v10** minimum, verified on **v13**.
- Use `foundry.utils.mergeObject` / `foundry.utils.deepClone` (not deprecated `mergeObject`).
- Avoid `game.data` — use `game.actors`, `game.items`, etc.
- Prefer `this.actor.update({...})` over `this.actor.data.update()`.

## Build & Test

```bash
npm test               # run Node.js unit tests (no Foundry required)
npm run compile-packs  # rebuild LevelDB compendium packs from .db sources
git pull               # sync after remote pushes
```

Releases are **automatic**: pushing to `main` with a changed `system.json` version triggers `release.yml`, which builds `system.zip` and creates a GitHub Release tagged `v{version}`.

**Note**: `pwsh.exe` (PowerShell 6+) is not available in the Copilot agent environment. Use `git` CLI and GitHub API tools for all file operations. The user must run `git pull` locally after agent pushes.

## Release Process

Foundry installs via manifest URL:
```
https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
```
The `download` field in `system.json` points to the GitHub Release asset. The release is created automatically when `system.json` version changes on main.

### Versioning Rules — Semantic Versioning 2.0.0

This project follows **[Semantic Versioning 2.0.0](https://semver.org/)**: `MAJOR.MINOR.PATCH`

| Segment | When to bump | Who decides |
|---------|-------------|-------------|
| **MAJOR** (`1.x.x`) | Breaking changes to the data model that require migration | User + agent |
| **MINOR** (`x.1.x`) | New feature complete AND user has tested it in Foundry VTT | **User only** — agent must NOT bump minor without explicit user approval after in-VTT testing |
| **PATCH** (`x.x.1`) | Bug fixes, CSS tweaks, text corrections, refactors with no new features | Agent can bump as part of PR |

**Critical rule**: The **minor version must only be incremented after the user has tested the feature in Foundry VTT and confirmed it works**. Agents bump the patch version for fixes; agents propose a minor bump but wait for user sign-off before applying it.

Current version: `0.1.26`

### Current Version History
| Version | Key Changes |
|---------|-------------|
| 0.0.1–0.0.4 | Initial system setup, attributes, skills, derived stats |
| 0.0.5–0.0.6 | Soulstones, conditions, manifested powers, biography tab |
| 0.0.7 | Fixed `Missing helper: "add"` error |
| 0.0.8 | Distracted/Immobilized, skill practice checkboxes, trigger fields, Personal Agenda, Grimoire tab |
| 0.0.9 | Characteristic suit per attribute, Other Abilities section |
| 0.1.0 | Flip totals badge, suit symbol buttons, wider trigger fields, 2-column Pursuits tab |
| 0.1.1 | Fixed delete button full-width override (Foundry global CSS) |
| 0.1.2 | Fate Deck tab — auto-creates 3 Foundry Card Stacks per character; flip, draw-to-hand, Cheat Fate, reshuffle |
| 0.1.3–0.1.6 | Incremental improvements to Fate Deck, sheet UX, conditions |
| 0.1.7 | Item types overhaul: Weapon redesign (damage track), Armor soak derived stat, Talent + Spell item types, drag-drop items, name-click to open sheet |
| 0.1.8 | Communal Fate Deck, full duel resolution (TN/AV/MoS/MoF), Cheat Fate rework, chat output |
| 0.1.9 | Workflow test / auto-release CI |
| 0.1.10 | TTB GM Tools panel in Scene Controls; Fate Deck setup/reshuffle moved out of character sheet |
| 0.1.11 | Fixed GM Tools scene controls for Foundry v13 (`Record` format + Font Awesome Free icons) |
| 0.1.12 | GM Tools switched from toolbar sub-icons to a popup dialog |
| 0.1.13 | Restored GM Tools wizard hat visibility in v13 by removing group-level `button: true` |
| 0.1.14 | Corrected GM Tools for the Foundry v13 scene controls `onChange` API |
| 0.1.15 | GM Tools wizard hat opened a popup dialog with Fate Deck actions |
| 0.1.16 | Wizard hat/sub-panel behavior changed so actions require explicit clicks |
| 0.1.17 | Reworked Fate Deck flow around per-character Control Hands; added duplicate world deck creation guard; draw-to-hand reveals cards face-up |
| 0.1.18 | Removed `layer: "tokens"` from GM Tools to stop Foundry from stealing focus back to the token controls |
| 0.1.19 | Fixed Foundry v13 card visibility so flipped and drawn cards reveal face-up |
| 0.1.20 | Added six item compendiums (weapons, armor, gear, general talents, pursuit talents, spells) with 431 entries total |
| 0.1.21 | Converted runtime compendium packs to LevelDB format for Foundry v12+/v13 and added `compile-packs` support |
| 0.1.22 | Refreshed `copilot-instructions.md` so the documented architecture, Fate Deck flow, GM Tools behavior, and compendium workflow match the current repo state |
| 0.1.23 | Compiled 441 items (66 weapons, 21 armor, 52 gear, 49 general talents, 211 pursuit talents, 32 spells) into LevelDB pack format; resolved Windows npm build issue with `--ignore-scripts` |
| 0.1.24 | Updated instructions through v0.1.21 state with versioning rules and pack compilation workflow documentation |
| 0.1.25 | **CRITICAL FIX**: Added `packs/` directory to `.github/workflows/release.yml` zip command so compiled compendium packs are included in system releases (was causing missing items in Foundry) |
| 0.1.26 | **NEW**: Fatemaster NPC actor type with basic stat block sheet (Df, Wp, wounds, skills, abilities). Supports Minion/Enforcer/Master rank tracking. Ready for bestiary pack population. |

