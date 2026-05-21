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

      if (system.derived) {
        system.derived.defense   = av("grace") + armorBonus;
        system.derived.willpower = av("tenacity");
        system.derived.walk      = av("speed");
        system.derived.charge    = av("speed") + 2;
        system.derived.height    = 2;
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
    await this._createFateDeck();
  }

  async _createFateDeck() {
    if (!game.cards) return;
    const actorName = this.name;
    try {
      const deck    = await Cards.create({ name: `${actorName}'s Fate Deck`, type: "deck", folder: null });
      const hand    = await Cards.create({ name: `${actorName}'s Hand`,      type: "hand", folder: null });
      const discard = await Cards.create({ name: `${actorName}'s Discard`,   type: "pile", folder: null });

      await deck.createEmbeddedDocuments("Card", buildTtbCardData());
      await deck.shuffle();

      await this.update({
        "system.fateDeck.deckId":    deck.id,
        "system.fateDeck.handId":    hand.id,
        "system.fateDeck.discardId": discard.id,
      });
    } catch (err) {
      console.error("TTB | Failed to create Fate Deck card stacks:", err);
      ui.notifications?.warn("TTB | Could not auto-create Fate Deck. Use 'Create Fate Deck' on the character sheet.");
    }
  }
}
