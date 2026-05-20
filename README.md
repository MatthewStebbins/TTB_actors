# Through the Breach — FoundryVTT System

A [FoundryVTT](https://foundryvtt.com) game system for the
[Through the Breach](https://www.wyrd-games.net/through-the-breach) tabletop RPG
by Wyrd Miniatures.

## Features (v1)

- **Fated character sheets** with all 8 core attributes and 37 skills
- Automatic derived stat calculation (Defense, Willpower, Walk, Charge, Max Wounds)
- Station, Aspect, and biography fields
- English localisation

## Installation

1. In the FoundryVTT Setup screen, go to **Game Systems → Install System**.
2. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/MatthewStebbins/TTB_actors/main/system.json
   ```
3. Click **Install**.

## Development

```bash
npm test   # runs the Node.js unit tests
```

## Roadmap

- Fatemaster (GM) character type
- Fate deck / Twist card integration
- Combat mechanics
- Pursuits & advancement
