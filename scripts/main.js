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

// ── GM Tools Scene Control Button ────────────────────────────────────────────
// Single button — clicking the wizard hat opens a Dialog with all Fate Deck options.
// Foundry v12: controls is Array<SceneControl>
// Foundry v13: controls is Record<string, SceneControl>
Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user?.isGM) return;

  const group = {
    name:    "ttb-gm-tools",
    title:   "TTB GM Tools",
    icon:    "fas fa-hat-wizard",
    layer:   "tokens",
    visible: true,
    button:  true,
    onClick: () => openGmToolsDialog(),
    // v13 requires a tools entry even for button groups; provide an empty record/array
    tools:   Array.isArray(controls) ? [] : {},
  };

  if (Array.isArray(controls)) {
    controls.push(group);
  } else {
    controls["ttb-gm-tools"] = group;
  }
});

function openGmToolsDialog() {
  const deckId = game.settings.get("ttb-actors", "fateDeckId") ?? "";
  const pileId = game.settings.get("ttb-actors", "fatePileId") ?? "";
  const hasDeck = !!(deckId && game.cards?.get(deckId));

  new Dialog({
    title: "TTB GM Tools — Fate Deck",
    content: `
      <div style="display:flex; flex-direction:column; gap:6px; padding:4px 0;">
        <p style="margin:0 0 6px; font-style:italic; font-size:0.9em;">
          ${hasDeck ? "World Fate Deck is ready." : "<b>No Fate Deck found.</b> Create one to get started."}
        </p>
      </div>`,
    buttons: {
      createDeck: {
        icon:  "<i class='fas fa-layer-group'></i>",
        label: "Create World Fate Deck",
        callback: async () => { await TtbActor.createWorldFateDeck(); },
      },
      openDeck: {
        icon:  "<i class='fas fa-eye'></i>",
        label: "Open Fate Deck",
        callback: () => {
          const deck = deckId ? game.cards?.get(deckId) : null;
          if (deck) deck.sheet.render(true);
          else ui.notifications.warn("TTB | No World Fate Deck found. Create one first.");
        },
      },
      openDiscard: {
        icon:  "<i class='fas fa-box-archive'></i>",
        label: "Open Discard Pile",
        callback: () => {
          const pile = pileId ? game.cards?.get(pileId) : null;
          if (pile) pile.sheet.render(true);
          else ui.notifications.warn("TTB | No Discard Pile found. Create the Fate Deck first.");
        },
      },
      reshuffle: {
        icon:  "<i class='fas fa-rotate'></i>",
        label: "Reshuffle Discard into Deck",
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
    default: "createDeck",
  }, { width: 320 }).render(true);
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
