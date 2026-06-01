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
