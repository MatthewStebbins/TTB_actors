import { TtbActor }         from "./actors/ttb-actor.js";
import { TtbCharacterSheet } from "./sheets/ttb-character-sheet.js";
import { TtbItemSheet }      from "./sheets/ttb-item-sheet.js";

Hooks.once("init", () => {
  console.log("TTB | Initialising Through the Breach system");

  // World-level Fate Deck settings (communal deck shared by all players)
  game.settings.register("ttb-actors", "fateDeckId", {
    name:    "TTB Fate Deck ID",
    hint:    "The ID of the communal Fate Deck card stack used by all players.",
    scope:   "world",
    config:  false,
    type:    String,
    default: "",
  });
  game.settings.register("ttb-actors", "fatePileId", {
    name:    "TTB Fate Discard ID",
    hint:    "The ID of the communal Fate Deck discard pile.",
    scope:   "world",
    config:  false,
    type:    String,
    default: "",
  });

  CONFIG.Actor.documentClass = TtbActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ttb-actors", TtbCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TTB.Sheet.character",
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ttb-actors", TtbItemSheet, {
    types: ["weapon", "armor", "gear", "talent", "spell"],
    makeDefault: true,
    label: "TTB.Sheet.item",
  });

  return preloadTemplates();
});

Hooks.once("i18nInit", () => {
  console.log("TTB | i18n ready");
});

// ── GM Tools Scene Control Panel ─────────────────────────────────────────────
// Foundry v12: controls is Array<SceneControl>, tools is Array<SceneControlTool>
// Foundry v13: controls is Record<string, SceneControl>, tools is Record<string, SceneControlTool>
Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user?.isGM) return;

  const toolList = [
    {
      name:    "ttb-create-fate-deck",
      title:   "Create World Fate Deck",
      icon:    "fas fa-layer-group",
      button:  true,
      onClick: async () => {
        await TtbActor.createWorldFateDeck();
      },
    },
    {
      name:    "ttb-open-fate-deck",
      title:   "Open World Fate Deck",
      icon:    "fas fa-eye",
      button:  true,
      onClick: () => {
        try {
          const id = game.settings.get("ttb-actors", "fateDeckId");
          const deck = id ? game.cards?.get(id) : null;
          if (deck) deck.sheet.render(true);
          else ui.notifications.warn("TTB | No World Fate Deck found. Create one first.");
        } catch (_) {}
      },
    },
    {
      name:    "ttb-open-fate-discard",
      title:   "Open World Discard Pile",
      icon:    "fas fa-box-archive",
      button:  true,
      onClick: () => {
        try {
          const id = game.settings.get("ttb-actors", "fatePileId");
          const pile = id ? game.cards?.get(id) : null;
          if (pile) pile.sheet.render(true);
          else ui.notifications.warn("TTB | No World Discard Pile found. Create the Fate Deck first.");
        } catch (_) {}
      },
    },
    {
      name:    "ttb-reshuffle-fate-deck",
      title:   "Reshuffle Discard into Fate Deck",
      icon:    "fas fa-rotate",
      button:  true,
      onClick: async () => {
        try {
          const deckId = game.settings.get("ttb-actors", "fateDeckId") ?? "";
          const pileId = game.settings.get("ttb-actors", "fatePileId") ?? "";
          const deck = deckId ? game.cards?.get(deckId) : null;
          const pile = pileId ? game.cards?.get(pileId) : null;
          if (!deck || !pile) return ui.notifications.warn("TTB | World Fate Deck not found.");
          if (pile.cards.size === 0) return ui.notifications.warn("TTB | Discard pile is empty.");
          const allIds = pile.cards.contents.map(c => c.id);
          await pile.pass(deck, allIds);
          await deck.shuffle();
          ui.notifications.info("TTB | Fate Deck reshuffled!");
        } catch (err) {
          console.error("TTB | Reshuffle failed:", err);
        }
      },
    },
  ];

  const group = {
    name:        "ttb-gm-tools",
    title:       "TTB GM Tools",
    icon:        "fas fa-hat-wizard",
    layer:       "tokens",
    visible:     true,
    activeTool:  "ttb-create-fate-deck",
    tools:       Array.isArray(controls)
      ? toolList
      : Object.fromEntries(toolList.map(t => [t.name, t])),
  };

  if (Array.isArray(controls)) {
    controls.push(group);
  } else {
    controls["ttb-gm-tools"] = group;
  }
});

async function preloadTemplates() {
  const templatePaths = [
    "systems/ttb-actors/templates/actors/character-sheet.hbs",
    "systems/ttb-actors/templates/items/weapon-sheet.hbs",
    "systems/ttb-actors/templates/items/armor-sheet.hbs",
    "systems/ttb-actors/templates/items/gear-sheet.hbs",
    "systems/ttb-actors/templates/items/talent-sheet.hbs",
    "systems/ttb-actors/templates/items/spell-sheet.hbs",
  ];
  return loadTemplates(templatePaths);
}
