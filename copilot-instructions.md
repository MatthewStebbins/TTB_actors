# Through the Breach FoundryVTT System — Copilot Instructions

**Last Updated:** v0.1.31 — NPC Bestiary with 82/88 NPCs complete

## Quick Summary

This is a FoundryVTT game system for *Through the Breach* TTRPG. Current focus: completing the 88-NPC bestiary compendium.

### Current Status
- ✅ **82 NPCs with complete skills**
- ⏳ **4 NPCs with skills added to source (.db)** — need LevelDB recompilation
- ❌ **2 NPCs missing entirely** — Catalan Rifleman (stat block "not yet provided"), Peacekeeper (not in markdown)

## Key Files & Conventions

| File | Purpose |
|------|---------|
| 	emplate.json | Data model for Fated (character) and Fatemaster (NPC) actors |
| scripts/main.js | Entry point; registers actor/sheet classes |
| scripts/actors/ttb-actor.js | Base actor class with prepareDerivedData() |
| scripts/actors/ttb-npc.js | NPC actor subclass |
| scripts/sheets/ | Sheet classes (character & NPC UI) |
| 	emplates/actors/ | Handlebars templates for sheets |
| styles/ttb.css | All CSS (prefix all classes with .ttb-) |
| lang/en.json | Localization strings (namespace: TTB.) |
| packs/ttb-bestiary.db | **Source file (NDJSON)** — edit this for NPC data |
| packs/ttb-bestiary/ | **Runtime LevelDB pack** — generated from .db via 
pm run compile-packs |
| ules/chapter-10-bestiary.md | Authoritative NPC stat blocks and rules |

## NPC Workflow

1. **Extract stat blocks** from ules/chapter-10-bestiary.md
2. **Add to packs/ttb-bestiary.db** (NDJSON format, one JSON doc per line)
3. **Run 
pm run compile-packs** to rebuild LevelDB packs
4. Test in Foundry VTT
5. Commit & version bump

## Known Issues

- ⚠️ **
pm run compile-packs fails in agent environment** due to classic-level Node binary compatibility. Run locally on your machine after updating .db files.
- ⏳ **6 NPCs have missing/incomplete data** (see status above)

## NPC Data Schema (Fatemaster)

`json
{
  "_id": "unique-id",
  "name": "NPC Name",
  "type": "fatemaster",
  "system": {
    "rank": { "title": "Minion|Peon|Enforcer|Master", "value": 4-7 },
    "attributes": {
      "might": { "value": 2 },
      "grace": { "value": 2 },
      ...
    },
    "skills": {
      "evade": { "value": 3 },
      "notice": { "value": 2 },
      ...
    },
    "abilities": [
      { "name": "Ability Name", "description": "..." }
    ],
    "actions": [
      { "name": "Action Name", "description": "..." }
    ]
  }
}
`

## Handlebars Constraints

- ⚠️ **No custom helpers** — Foundry only provides {{#if}}, {{#each}}, {{#unless}}, {{eq}}, {{localize}}
- **Pre-compute all math in getData()** and pass as properties
- **Nested scope**: use {{../parent}} to access parent scope inside {{#each}}

## Array Corruption Bug

Foundry's expandObject() corrupts form arrays (pursuits, talents, etc.) into objects. **Always override _updateObject() to call epairArrays() before saving.**

## Recent Changes

- v0.1.31: Added 88 NPCs to bestiary; extracted skills for 4 remaining NPCs from markdown
- v0.1.30: Fixed NPC sheet rendering bugs
- v0.1.29: Improved NPC sheet CSS
- v0.1.26: Created Fatemaster NPC actor type

## Next Steps

1. **Run locally:** 
pm run compile-packs to rebuild LevelDB with 4 updated NPCs
2. **Find stat blocks:** Catalan Rifleman & Peacekeeper (check official PDF or create placeholders)
3. **Add to .db:** Create JSON docs for missing NPCs
4. **Commit & bump version** when LevelDB is recompiled
