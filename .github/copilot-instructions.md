# Through the Breach — FoundryVTT System

This repo is a **FoundryVTT Game System** (`system.json`) for the *Through the Breach* TTRPG by Wyrd Miniatures. The goal is to grow it into a full system capable of running a complete TTB adventure.

## Architecture

| Path | Purpose |
|------|---------|
| `system.json` | Foundry system manifest. `id` must stay `ttb-actors` (matches install folder). |
| `template.json` | Declarative data model for all Actor/Item types. Edit this to add new fields — no JS needed for data shape. |
| `scripts/main.js` | ES module entry point. Registers actor class, sheets, and preloads templates via `Hooks.once("init")`. |
| `scripts/actors/` | `Actor` document subclasses. Derived stats computed in `prepareDerivedData()`. |
| `scripts/sheets/` | `ActorSheet` subclasses. `getData()` enriches context; `activateListeners()` wires UI events. |
| `templates/actors/` | Handlebars (`.hbs`) sheet templates. Tabs driven by Foundry's built-in tab system. |
| `styles/ttb.css` | All CSS. Every class must be prefixed `.ttb-actors-` to avoid collisions with other systems/modules. |
| `lang/en.json` | English strings. All localization keys use `TTB.` namespace. Use `game.i18n.localize("TTB.Key")` in JS and `{{localize "TTB.Key"}}` in HBS. |
| `scripts/create-ttb-actor.js` | Legacy CJS helper used only by Node unit tests. Do not import this in Foundry code. |
| `test/` | Node.js unit tests (`node --test`). Run with `npm test`. Tests must not depend on Foundry globals. |
| `.github/workflows/release.yml` | Pushes a `v*` tag → builds `system.zip` → creates GitHub Release. Required for Foundry's manifest installer. |

## Through the Breach Game Rules Context

### Core Mechanics
- **Flip-based resolution**: players flip cards from a personal **Fate Deck** (standard 52-card deck + Jokers) rather than rolling dice.
- **Target Number (TN)**: each action has a TN; flip a card and add the relevant **Attribute + Skill** value. Meet or beat TN to succeed.
- **Suits matter**: some abilities trigger on specific suits (Crow, Mask, Ram, Tome — mapped from ♠ ♣ ♥ ♦).
- **Cheating Fate**: players may have a **Hand** of cards and can replace a flip with a card from their hand.

### Fated (Player Characters)
- 8 **Attributes**: Might, Grace, Speed, Resilience, Charm, Cunning, Tenacity, Intellect (values 1–5).
- 37 **Skills** grouped by attribute (see `template.json` for full list). Each skill has a rank 0–5.
- **Derived stats** (auto-calculated from attributes):
  - Defense = Grace
  - Willpower = Tenacity
  - Walk = Speed
  - Charge = Speed + 2
  - Height = 2 (always)
  - Max Wounds = Resilience × 2
- **Aspects**: Crow, Mask, Ram, Tome — the character's magical/spiritual affinity.
- **Station**: narrative background (e.g. Outcast, Enforcer, Guild Member).
- **Wounds**: current / max. Reaching max wounds = character is dying.

### Fatemaster Characters (NPCs) — *planned*
- Simpler stat block: Df (Defense), Wp (Willpower), Wounds, relevant skills only.
- Minions share a single wound pool; Peons are defeated on any damage.

### Key Future Systems to Build
| Feature | Notes |
|---------|-------|
| Fate Deck | Virtual card deck per player; flip action; hand management |
| Twists | Special effects triggered by Jokers or suit matches |
| Pursuits | Character advancement/class system (equivalent to leveling) |
| Talents & Manifested Powers | Purchased with Scrip during Pursuits |
| Grimoires & Spellcasting | Tenacity-based magic; spell items |
| Equipment & Weapons | Items with damage type, range, and triggers |
| Initiative (Rushing the Season) | Card-based initiative; suits determine order |
| Fatemaster tools | Encounter builder, NPC quick-creator |

## Development Conventions

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
- Target: Foundry **v10** minimum, verified on **v12**.
- Use `foundry.utils.mergeObject` / `foundry.utils.deepClone` (not deprecated `mergeObject`).
- Avoid `game.data` — use `game.actors`, `game.items`, etc.
- Prefer `this.actor.update({...})` over `this.actor.data.update()`.

## Build & Test

```bash
npm test          # run Node.js unit tests (no Foundry required)
git tag v1.x.x    # trigger release.yml → produces system.zip on GitHub
git push origin v1.x.x
```

## Release Process

Foundry installs via manifest URL:
```
https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
```
The `download` field in `system.json` points to the GitHub Release asset. Always bump `version` in `system.json` before tagging.
