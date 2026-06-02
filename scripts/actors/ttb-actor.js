const TTB_SUITS = [
  { name: "Crow" },
  { name: "Mask" },
  { name: "Ram"  },
  { name: "Tome" },
];

const VALUE_NAMES = { 1: "Ace", 11: "Jack", 12: "Queen", 13: "King" };

function buildTtbCardData() {
  const cards = [];
  for (const suit of TTB_SUITS) {
    for (let v = 1; v <= 13; v++) {
      const vn = VALUE_NAMES[v] || String(v);
      cards.push({
        name:  `${vn} of ${suit.name}s`,
        type:  "base",
        suit:  suit.name,
        value: v,
        faces: [{ name: `${vn} of ${suit.name}s` }],
        face:  null,
      });
    }
  }
  cards.push({ name: "Red Joker",   type: "base", suit: "Joker", value: 14, faces: [{ name: "Red Joker"   }], face: null });
  cards.push({ name: "Black Joker", type: "base", suit: "Joker", value: 0,  faces: [{ name: "Black Joker" }], face: null });
  return cards;
}

export class TtbActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;

    try {
      const system = this.system;
      const a = system.attributes ?? {};
      const av = (name) => a[name]?.value ?? 2;

      const armorBonus = Array.from(this.items)
        .filter((i) => i.type === "armor" && i.system?.equipped)
        .reduce((sum, i) => sum + (Number(i.system?.defenseBonus) || 0), 0);

      const soakBonus = Array.from(this.items)
        .filter((i) => i.type === "armor" && i.system?.equipped)
        .reduce((sum, i) => sum + (Number(i.system?.soak) || 0), 0);

      if (system.derived) {
        system.derived.defense   = av("grace") + armorBonus;
        system.derived.willpower = av("tenacity");
        system.derived.walk      = av("speed");
        system.derived.charge    = av("speed") + 2;
        system.derived.height    = 2;
        system.derived.soak      = soakBonus;
      }

      if (system.wounds) {
        system.wounds.max = av("resilience") * 2;
      }
    } catch (err) {
      console.warn("TTB | prepareDerivedData failed:", err);
    }
  }

  getRollData() {
    const data = super.getRollData();
    data.attributes = this.system.attributes;
    data.skills     = this.system.skills;
    data.derived    = this.system.derived;
    return data;
  }

  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    if (game.user.id !== userId) return;
    if (this.type !== "character") return;
    await this._createControlHand();
  }

  async _createControlHand() {
    if (!game.cards) return;
    const actorName = this.name;
    try {
      const hand    = await Cards.create({ name: `${actorName}'s Control Hand`, type: "hand", folder: null });
      const discard = await Cards.create({ name: `${actorName}'s Discard`,      type: "pile", folder: null });
      await this.update({
        "system.fateDeck.handId":    hand.id,
        "system.fateDeck.discardId": discard.id,
      });
    } catch (err) {
      console.error("TTB | Failed to create Control Hand:", err);
      ui.notifications?.warn("TTB | Could not auto-create Control Hand. Use 'Create My Control Hand' on the character sheet.");
    }
  }

  static async createWorldFateDeck() {
    if (!game.cards) return;
    if (!game.user?.isGM) return;

    // Guard: check if a deck already exists in game.cards via the saved setting.
    // Allow recreation only if the setting points to a stack that no longer exists.
    const existingDeckId = game.settings.get("ttb-actors", "fateDeckId") ?? "";
    if (existingDeckId && game.cards.get(existingDeckId)) {
      ui.notifications?.warn("TTB | A World Fate Deck already exists. Use Reshuffle to reset it, or delete the existing deck first.");
      return;
    }

    try {
      const deck = await Cards.create({ name: "TTB Fate Deck",    type: "deck", folder: null });
      const pile = await Cards.create({ name: "TTB Fate Discard", type: "pile", folder: null });
      await deck.createEmbeddedDocuments("Card", buildTtbCardData());
      await deck.shuffle();
      await game.settings.set("ttb-actors", "fateDeckId", deck.id);
      await game.settings.set("ttb-actors", "fatePileId", pile.id);
      ui.notifications?.info("TTB | World Fate Deck created and shuffled!");
    } catch (err) {
      console.error("TTB | Failed to create World Fate Deck:", err);
      ui.notifications?.error("TTB | Could not create World Fate Deck.");
    }
  }
}
