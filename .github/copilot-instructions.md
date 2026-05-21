# Through the Breach — FoundryVTT System

> **Self-updating instructions:** This file MUST be updated automatically by Copilot agents whenever new conventions, critical bugs/fixes, architectural decisions, or gotchas are discovered. Do not wait for the user to ask — if something important is learned during a session, update this file as part of the work.

This repo is a **FoundryVTT Game System** (`system.json`) for the *Through the Breach* TTRPG by Wyrd Miniatures. The goal is to grow it into a full system capable of running a complete TTB adventure.

## Architecture

| Path | Purpose |
|------|---------|
| `system.json` | Foundry system manifest. `id` must stay `ttb-actors` (matches install folder). Current version: `0.1.2`. Verified on Foundry **v13**. |
| `template.json` | Declarative data model for all Actor/Item types. Edit this to add new fields — no JS needed for data shape. |
| `scripts/main.js` | ES module entry point. Registers actor class, sheets, and preloads templates via `Hooks.once("init")`. |
| `scripts/actors/` | `Actor` document subclasses. Derived stats computed in `prepareDerivedData()`. |
| `scripts/sheets/` | `ActorSheet` subclasses. `getData()` enriches context; `activateListeners()` wires UI events. |
| `templates/actors/` | Handlebars (`.hbs`) sheet templates. Tabs driven by Foundry's built-in tab system. |
| `styles/ttb.css` | All CSS. Dark Victorian/Steampunk aesthetic using CSS custom properties. Every class must be prefixed `.ttb-` to avoid collisions. |
| `lang/en.json` | English strings. All localization keys use `TTB.` namespace. Use `game.i18n.localize("TTB.Key")` in JS and `{{localize "TTB.Key"}}` in HBS. |
| `scripts/create-ttb-actor.js` | Legacy CJS helper used only by Node unit tests. Do not import this in Foundry code. |
| `test/` | Node.js unit tests (`node --test`). Run with `npm test`. Tests must not depend on Foundry globals. |
| `.github/workflows/release.yml` | Pushes a `v*` tag → builds `system.zip` → creates GitHub Release. Required for Foundry's manifest installer. |

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

### Fate Deck (v0.1.2+)
Each character gets **3 linked Foundry Card Stacks** auto-created on `_onCreate`:
- `[Name]'s Fate Deck` — type `"deck"`, populated with 54 TTB cards + shuffled
- `[Name]'s Hand` — type `"hand"`
- `[Name]'s Discard` — type `"pile"`

IDs stored on actor at `system.fateDeck.{ deckId, handId, discardId }`.

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

// Move from hand to discard (Cheat Fate / Play)
await hand.pass(discard, [cardId]);

// Reshuffle all discard back into deck
await discard.pass(deck, discard.cards.contents.map(c => c.id));
await deck.shuffle();
```

**Last flip storage** — store a data snapshot, NOT the card ID (IDs change on move):
```js
await actor.update({
  "system.fateDeck.lastFlip.suit":  card.suit,
  "system.fateDeck.lastFlip.value": card.value,
  "system.fateDeck.lastFlip.name":  card.name,
});
```
Read back via `cardDisplayInfoFromData(suit, value, name)` in `getData()`.

**`_createFateDeck()` is public** — called from the "Create Fate Deck" button if stacks go missing (e.g., accidentally deleted). Guard with `if (!game.cards) return;`.

### Items
- **Weapon**: attackSkill, damage, range, special, equipped.
- **Armor**: defenseBonus, special, equipped (adds to Defense when equipped).
- **Gear**: quantity, description.

### Fatemaster Characters (NPCs) — *planned*
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
git pull               # sync after remote pushes
git tag v0.x.x         # trigger release.yml → produces system.zip on GitHub
git push origin v0.x.x
```

**Note**: `pwsh.exe` (PowerShell 6+) is not available in the Copilot agent environment. Use `git` CLI and GitHub API tools for all file operations. Commits pushed via GitHub API require the user to run `git pull` locally before tagging.

## Release Process

Foundry installs via manifest URL:
```
https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
```
The `download` field in `system.json` points to the GitHub Release asset. Always bump `version` in `system.json` before tagging.

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
