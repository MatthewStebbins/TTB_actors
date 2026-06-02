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
// Foundry v13: controls is Record<string, SceneControl>, tools is Record<string, SceneControlTool>
// A single button:true tool fires onChange on click without becoming a persistent active mode.
// Clicking the wizard hat activates the group; the single tool fires immediately, opening a Dialog.
// The Dialog contains all Fate Deck actions including Create Deck.
// Groups with empty tools are silently deleted — tools must have at least one entry.
// onClick is deprecated in v13; use onChange(event, active).
Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user?.isGM) return;

  controls["ttb-gm-tools"] = {
    name:       "ttb-gm-tools",
    order:      99,
    title:      "TTB GM Tools",
    icon:       "fas fa-hat-wizard",
    layer:      "tokens",
    visible:    true,
    activeTool: "ttb-open-dialog",
    tools: {
      "ttb-open-dialog": {
        name:     "ttb-open-dialog",
        order:    1,
        title:    "TTB GM Tools",
        icon:     "fas fa-hat-wizard",
        button:   true,
        onChange: (_event, active) => {
          if (!active) return;
          openGmToolsDialog();
        },
      },
    },
  };
});

function openGmToolsDialog() {
  const deckId  = game.settings.get("ttb-actors", "fateDeckId") ?? "";
  const pileId  = game.settings.get("ttb-actors", "fatePileId") ?? "";
  const hasDeck = !!(deckId && game.cards?.get(deckId));

  new Dialog({
    title:   "TTB GM Tools — Fate Deck",
    content: `<p style="margin:0 0 8px; font-style:italic; font-size:0.9em;">
      ${hasDeck ? "World Fate Deck is ready." : "<b>No Fate Deck found.</b> Create one to get started."}
    </p>`,
    buttons: {
      createDeck: {
        icon:     "<i class='fas fa-layer-group'></i>",
        label:    "Create World Fate Deck",
        callback: async () => { await TtbActor.createWorldFateDeck(); },
      },
      openDeck: {
        icon:     "<i class='fas fa-eye'></i>",
        label:    "Open Fate Deck",
        callback: () => {
          const deck = deckId ? game.cards?.get(deckId) : null;
          if (deck) deck.sheet.render(true);
          else ui.notifications.warn("TTB | No World Fate Deck found. Create one first.");
        },
      },
      openDiscard: {
        icon:     "<i class='fas fa-box-archive'></i>",
        label:    "Open Discard Pile",
        callback: () => {
          const pile = pileId ? game.cards?.get(pileId) : null;
          if (pile) pile.sheet.render(true);
          else ui.notifications.warn("TTB | No Discard Pile found. Create the Fate Deck first.");
        },
      },
      reshuffle: {
        icon:     "<i class='fas fa-rotate'></i>",
        label:    "Reshuffle Discard into Deck",
        callback: async () => {
          const deck = deckId ? game.cards?.get(deckId) : null;
          const pile = pileId ? game.cards?.get(pileId) : null;
          if (!deck || !pile) return ui.notifications.warn("TTB | World Fate Deck not found.");
          if (pile.cards.size === 0) return ui.notifications.warn("TTB | Discard pile is empty.");
          const allIds = pile.cards.contents.map(c => c.id);
          await pile.pass(deck, allIds);
          await deck.shuffle();
          ui.notifications.info("TTB | Fate Deck reshuffled!");
        },
      },
    },
    default: hasDeck ? "openDeck" : "createDeck",
  }, { width: 340 }).render(true);
}

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
