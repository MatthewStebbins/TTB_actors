# Through the Breach — FoundryVTT System

A [FoundryVTT](https://foundryvtt.com) game system for the
[Through the Breach](https://www.wyrd-games.net/through-the-breach) tabletop RPG
by Wyrd Miniatures.

> **Current version: 0.1.1** — Requires Foundry VTT v10+, verified on v13.

## Features

### Character Sheet (Fated)
- **8 Attributes** — Might, Grace, Speed, Resilience, Charm, Cunning, Tenacity, Intellect
- **39 Skills** grouped by attribute, each with rank, practiced checkbox, and suit triggers
- **Characteristic suit per attribute** — click a suit symbol (♠ ♣ ♥ ♦) on each attribute card
- **Flip total badges** — displays Attribute + Skill total per skill row at a glance
- **Automatic derived stats** — Defense, Willpower, Walk, Charge, Height, Max Wounds
- **Wounds tracking** — current/max wounds with a Serious Wound field
- **Soulstone pool** — clickable dot tracker (value/max)
- **Conditions** — Burning, Focused, Slow, Fast, Stunned, Paralyzed, Distracted, Immobilized, Defensive

### Tabs
| Tab | Contents |
|-----|----------|
| **Attributes** | 8 attribute cards with suit selectors and derived stats |
| **Skills** | All 39 skills with flip totals, ranks, practiced checkboxes, and trigger fields |
| **Destiny** | 5-card Fate Spread, 5 Destiny Steps, current step tracker, Personal Agenda |
| **Grimoire** | Spell entries (Theory, Name, Cost, Range, Duration, Description) |
| **Pursuits** | Pursuits table, Talents, Other Abilities (2-column), Manifested Powers |
| **Equipment** | Weapons, Armor, Inventory items, Scrip amount |
| **Biography** | Allegiance, Age, Gender, Appearance, Background, free-text Notes |

### Items
- **Weapons** — attack skill, damage, range, special traits, equipped toggle
- **Armor** — defense bonus, special traits, equipped toggle
- **Gear** — quantity and description

## Installation

1. In the FoundryVTT Setup screen, go to **Game Systems → Install System**.
2. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
   ```
3. Click **Install**.

## Development

```bash
npm test   # runs the Node.js unit tests (no Foundry install required)
```

To release a new version:
```bash
git pull
# bump version in system.json, then:
git tag v0.x.x
git push origin v0.x.x
# GitHub Actions builds system.zip and creates a GitHub Release automatically
```

## Roadmap

- [ ] Fatemaster (GM/NPC) character type
- [ ] Virtual Fate Deck — flip actions and hand management
- [ ] Twist card integration
- [ ] Card-based Initiative (Rushing the Season)
- [ ] Pursuits advancement — spend Scrip to gain Talents/Powers
- [ ] Combat & encounter tools

## About Through the Breach

*Through the Breach* is a card-based tabletop RPG set in the **Malifaux** universe by Wyrd Miniatures. Players take on the roles of Fated characters — people whose destiny is written in the cards — and must work together (or against each other) to survive in a world of dark magic, political intrigue, and eldritch horror.

Resolution uses a personal **Fate Deck** of standard playing cards. Suits (Crow ♠, Mask ♣, Ram ♥, Tome ♦) trigger special abilities, and players can **Cheat Fate** by playing cards from their hand to change outcomes.
