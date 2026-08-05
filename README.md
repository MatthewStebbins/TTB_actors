# Through the Breach — FoundryVTT System

A [FoundryVTT](https://foundryvtt.com) game system for the
[Through the Breach](https://www.wyrd-games.net/through-the-breach) tabletop RPG
by Wyrd Miniatures.

> **Current version: 0.1.52** — Requires Foundry VTT v10+, verified on v13.

## Features

### Character Sheet (Fated)
- **8 Attributes** — Might, Grace, Speed, Resilience, Charm, Cunning, Tenacity, Intellect
- **39 Skills** grouped by attribute, each with rank, practiced checkbox, and suit triggers
- **Characteristic suit per attribute** — click a suit symbol (? ? ? ?) on each attribute card
- **Flip total badges** — displays Attribute + Skill total per skill row at a glance
- **Automatic derived stats** — Defense, Willpower, Walk, Charge, Height, Max Wounds, Soak
- **Wounds tracking** — current/max wounds with a Serious Wound field
- **Soulstone pool** — clickable dot tracker (value/max)
- **Conditions** — Burning, Focused, Slow, Fast, Stunned, Paralyzed, Distracted, Immobilized, Defensive
- **Fate Deck integration** — Flip cards, draw to hand, Cheat Fate, reshuffle (v0.1.2+)

### Character Tabs
| Tab | Contents |
|-----|----------|
| **Attributes** | 8 attribute cards with suit selectors and derived stats |
| **Skills** | All 39 skills with flip totals, ranks, practiced checkboxes, and trigger fields |
| **Destiny** | 5-card Fate Spread, 5 Destiny Steps, current step tracker, Personal Agenda |
| **Grimoire** | Spell entries (Theory, Name, Cost, Range, Duration, Description) |
| **Pursuits** | Pursuits table, Talents, Other Abilities (2-column), Manifested Powers |
| **Equipment** | Weapons, Armor, Inventory items, Scrip amount |
| **Fate Deck** | Control Hand, Flip/Draw actions, Last flip tracking, Reshuffle (v0.1.17+) |
| **Biography** | Allegiance, Age, Gender, Appearance, Background, free-text Notes |

### Fatemaster NPC Sheet (v0.1.26+)
- **Simplified stat block** — Defense, Willpower, Wounds, Rank (Minion/Peon/Enforcer/Master)
- **Relevant skills only** — filtered from the full skill list
- **Abilities tab** — named abilities with descriptions from bestiary
- **Combat tab** — NPC actions with AP costs and effects (v0.1.45+)
- **Skills tab** — skills table for quick reference
- **88 NPCs in Bestiary Compendium** — all factions, complete with stats, skills, abilities, and actions

### Items
- **Weapons** — attack skill, AP cost, damage (weak/moderate/severe), range, special traits, equipped toggle
- **Armor** — defense bonus, soak (damage reduction), special traits, equipped toggle
- **Gear** — quantity and description
- **Talents** — pursuit affiliation, requirements, description
- **Spells** — theory, TN, range, duration, immutos, description

### Compendium Packs (v0.1.20+)
- **TTB Weapons** — 66+ melee and ranged weapons
- **TTB Armor & Shields** — 21+ armor types
- **TTB Gear & Sundries** — 52+ equipment items
- **TTB General Talents** — 49+ general abilities
- **TTB Pursuit Talents** — 211+ pursuit-specific abilities
- **TTB Spells & Magia** — 32+ spells and immutos
- **TTB Bestiary** — 88 NPC stat blocks (all factions)

## Installation

1. In the FoundryVTT Setup screen, go to **Game Systems ? Install System**.
2. Paste the manifest URL:
   \\\
   https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
   \\\
3. Click **Install**.

## Development

\\\ash
npm test               # runs the Node.js unit tests (no Foundry install required)
npm run compile-packs  # recompile LevelDB compendium packs from .db source files
\\\

To release a new version:
1. Update version in \system.json\
2. Commit with message: \ersion: Bump to v0.x.x\
3. Push to main branch
4. GitHub Actions automatically builds \system.zip\ and creates a GitHub Release

**Note:** After updating any \.db\ compendium source files, run \
pm run compile-packs\ locally on Windows/macOS to rebuild the LevelDB directories before committing.

## Roadmap

- [x] Fatemaster (GM/NPC) character type (v0.1.26+)
- [x] Virtual Fate Deck — flip actions and hand management (v0.1.2+)
- [x] 88 NPC Bestiary with skills, abilities, and actions (v0.1.31+)
- [ ] Twist card integration
- [ ] Card-based Initiative (Rushing the Season)
- [ ] Pursuits advancement — spend Scrip to gain Talents/Powers
- [ ] Fatemaster encounter builder & tools

## About Through the Breach

*Through the Breach* is a card-based tabletop RPG set in the **Malifaux** universe by Wyrd Miniatures. Players take on the roles of Fated characters — people whose destiny is written in the cards — and must work together (or against each other) to survive in a world of dark magic, political intrigue, and eldritch horror.

Resolution uses a personal **Fate Deck** of standard playing cards. Suits (Crow ?, Mask ?, Ram ?, Tome ?) trigger special abilities, and players can **Cheat Fate** by playing cards from their hand to change outcomes.
