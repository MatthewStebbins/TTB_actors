const ATTRIBUTE_ORDER = [
  "might", "grace", "speed", "resilience",
  "charm", "cunning", "tenacity", "intellect",
];

const SUIT_SYMBOLS = { crow: "\u2660", mask: "\u2663", ram: "\u2665", tome: "\u2666", joker: "\u2605", "": "?" };

const ALLEGIANCE_OPTIONS = [
  "guild", "arcanists", "resurrectionists", "neverborn",
  "tenThunders", "outcasts", "unaffiliated",
];

const SUIT_OPTIONS = [
  { value: "",     label: "\u2014 suit \u2014" },
  { value: "crow", label: "\u2660 Crow" },
  { value: "mask", label: "\u2663 Mask" },
  { value: "ram",  label: "\u2665 Ram"  },
  { value: "tome", label: "\u2666 Tome" },
];

const SUIT_BUTTONS = [
  { value: "crow", symbol: "\u2660", label: "Crow" },
  { value: "mask", symbol: "\u2663", label: "Mask" },
  { value: "ram",  symbol: "\u2665", label: "Ram"  },
  { value: "tome", symbol: "\u2666", label: "Tome" },
];

function loc(key) {
  try { return game.i18n.localize(key) || key; } catch (_) { return key; }
}

/**
 * Build card display info from raw suit/value/name strings.
 * Works for both live Card documents and persisted snapshots.
 */
function cardDisplayInfoFromData(suit, value, name) {
  const suitLower    = (suit ?? "").toLowerCase();
  const isJoker      = suitLower === "joker";
  const nameLower    = (name ?? "").toLowerCase();
  const isRedJoker   = isJoker && nameLower.includes("red");
  const isBlackJoker = isJoker && !isRedJoker;
  const symbol       = SUIT_SYMBOLS[suitLower] || "?";
  const tnValue      = isRedJoker ? 14 : isBlackJoker ? 0 : (value ?? 0);
  return {
    suit:        suitLower,
    symbol,
    value:       value ?? 0,
    tnValue,
    label:       name ?? "",
    isJoker,
    isRedJoker,
    isBlackJoker,
  };
}

/** Build card display info from a Foundry Card document (includes id). */
function cardDisplayInfo(card) {
  return { ...cardDisplayInfoFromData(card.suit, card.value, card.name), id: card.id };
}

/**
 * Foundry form submission converts array paths like system.pursuits.0.name into
 * numeric-keyed plain objects { 0: {...} }. This function converts them back to arrays.
 */
function repairArrays(expanded) {
  const sys = expanded?.system;
  if (!sys) return expanded;
  for (const field of ["pursuits", "talents", "manifestedPowers", "otherAbilities", "grimoire"]) {
    if (sys[field] && !Array.isArray(sys[field])) {
      sys[field] = Object.values(sys[field]);
    }
  }
  if (sys.destiny) {
    for (const field of ["steps", "spread"]) {
      if (sys.destiny[field] && !Array.isArray(sys.destiny[field])) {
        sys.destiny[field] = Object.values(sys.destiny[field]);
      }
    }
  }
  return expanded;
}

/** Coerce a raw array field to a plain Array regardless of storage format. */
function toArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.values(raw);
}

/**
 * Build a sorted list of skill options for the duel skill dropdown.
 * Pre-computes the AV label so HBS doesn't need {{add}} or {{math}} helpers.
 */
function buildSkillOptions(system, locFn, selectedKey) {
  const skills = system.skills ?? {};
  const attrs  = system.attributes ?? {};
  return Object.entries(skills)
    .map(([key, s]) => {
      const attrVal  = attrs[s?.attribute]?.value ?? 2;
      const av       = attrVal + (s?.value ?? 0);
      return {
        key,
        label:    `${locFn(`TTB.Skill.${key}`)} (AV ${av})`,
        selected: key === selectedKey,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Reveal a card (face: 0) in whatever stack currently holds it.
 * Call after passing a card to hand or discard so it shows face-up.
 * Cards.pass() preserves card IDs, so the same ID works in the destination.
 */
async function revealCard(stack, cardId) {
  const card = stack.cards.get(cardId);
  if (card && card.face === null) {
    await stack.updateEmbeddedDocuments("Card", [{ _id: cardId, face: 0 }]);
  }
}

/**
 * Reset drawn and face flags on all cards in a deck.
 * Called after reshuffle: cards return to deck face-down (face: null) and
 * with drawn: false so Foundry allows them to be passed again.
 */
async function resetDrawnFlags(deck) {
  const updates = deck.cards.contents.map(c => ({ _id: c.id, drawn: false, face: null }));
  if (updates.length > 0) await deck.updateEmbeddedDocuments("Card", updates);
}

export class TtbCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ttb-actors", "sheet", "actor"],
      template: "systems/ttb-actors/templates/actors/character-sheet.hbs",
      width: 820,
      height: 740,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
    });
  }

  constructor(...args) {
    super(...args);
    /** Prevents concurrent fate deck operations from double-firing (e.g. rapid clicks). */
    this._fateInProgress = false;
    /** Foundry hook registration IDs — cleaned up on sheet close. */
    this._fateHookIds = [];
  }

  /**
   * Wrap a fate deck async operation with a lock so rapid clicks don't cause
   * duplicate card moves (which throw "already exists in collection").
   */
  async _fateOp(fn) {
    if (this._fateInProgress) return;
    this._fateInProgress = true;
    try {
      await fn();
    } finally {
      this._fateInProgress = false;
    }
  }

  /**
   * Register createCard / deleteCard / updateCard hooks so deck/hand/discard counts
   * and card faces update reactively whenever a card moves or is revealed.
   *
   * These hooks fire AFTER Foundry updates the local in-memory collection,
   * which is the reliable signal to re-render the sheet.
   */
  _registerFateHooks() {
    this._unregisterFateHooks();
    const sys        = this.actor.system.fateDeck ?? {};
    const trackedIds = new Set([sys.handId, sys.discardId].filter(Boolean));
    // Also track communal world deck/pile IDs
    try {
      const worldDeckId = game.settings.get("ttb-actors", "fateDeckId");
      const worldPileId = game.settings.get("ttb-actors", "fatePileId");
      if (worldDeckId) trackedIds.add(worldDeckId);
      if (worldPileId) trackedIds.add(worldPileId);
    } catch (_) {}
    if (trackedIds.size === 0) return;

    const onCardChange = (card) => {
      if (trackedIds.has(card.parent?.id)) this.render(false);
    };

    this._fateHookIds = [
      { name: "createCard", id: Hooks.on("createCard", onCardChange) },
      { name: "deleteCard", id: Hooks.on("deleteCard", onCardChange) },
      { name: "updateCard", id: Hooks.on("updateCard", onCardChange) },
    ];
  }

  /** Remove registered fate hooks — called on each re-register and on sheet close. */
  _unregisterFateHooks() {
    for (const { name, id } of this._fateHookIds) Hooks.off(name, id);
    this._fateHookIds = [];
  }

  /** Override close to clean up card hooks so they don't leak after sheet is closed. */
  async close(options = {}) {
    this._unregisterFateHooks();
    return super.close(options);
  }

  getData() {
    const context = super.getData();
    const system  = this.actor.system;
    context.system = system;

    const a  = system.attributes ?? {};
    const av = (name) => a[name]?.value ?? 2;

    const allItems = Array.from(this.actor.items);
    const armorBonus = allItems
      .filter((i) => i.type === "armor" && i.system?.equipped)
      .reduce((sum, i) => sum + (Number(i.system?.defenseBonus) || 0), 0);

    context.derived = {
      defense:   av("grace") + armorBonus,
      willpower: av("tenacity"),
      walk:      av("speed"),
      charge:    av("speed") + 2,
      height:    2,
      woundsMax: av("resilience") * 2,
      soak:      allItems
        .filter((i) => i.type === "armor" && i.system?.equipped)
        .reduce((sum, i) => sum + (Number(i.system?.soak) || 0), 0),
    };

    context.suitOptions = SUIT_OPTIONS;

    context.attributes = ATTRIBUTE_ORDER.map((key) => ({
      key,
      label: loc(`TTB.Attribute.${key}`),
      value: av(key),
      suit:  a[key]?.suit ?? "",
      suitButtons: SUIT_BUTTONS.map((b) => ({
        value:  b.value,
        symbol: b.symbol,
        label:  b.label,
        active: (a[key]?.suit ?? "") === b.value,
      })),
    }));

    const skills = system.skills ?? {};
    context.skillsByAttribute = ATTRIBUTE_ORDER.map((attrKey) => {
      const attrVal = av(attrKey);
      return {
        attrKey,
        label: loc(`TTB.Attribute.${attrKey}`),
        skills: Object.entries(skills)
          .filter(([, s]) => s?.attribute === attrKey)
          .map(([key, s]) => ({
            key,
            label:    loc(`TTB.Skill.${key}`),
            value:    s?.value    ?? 0,
            total:    attrVal + (s?.value ?? 0),
            attrVal,
            triggers: s?.triggers ?? "",
            practiced: !!s?.practiced,
          })),
      };
    });

    context.aspectOptions = [
      { value: "crow", label: loc("TTB.Aspect.crow") },
      { value: "mask", label: loc("TTB.Aspect.mask") },
      { value: "ram",  label: loc("TTB.Aspect.ram")  },
      { value: "tome", label: loc("TTB.Aspect.tome") },
    ];

    context.allegianceOptions = ALLEGIANCE_OPTIONS.map((v) => ({
      value: v,
      label: loc(`TTB.Allegiance.${v}`),
    }));

    // Soulstones
    const ss = system.soulstones ?? { value: 0, max: 3 };
    context.soulstoneMax   = ss.max ?? 3;
    context.soulstoneValue = ss.value ?? 0;
    context.soulstoneDots  = Array.from({ length: ss.max ?? 3 }, (_, i) => ({
      index:  i,
      filled: i < (ss.value ?? 0),
    }));

    // Wound boxes
    const woundsValue = system.wounds?.value ?? 0;
    const maxWounds   = context.derived.woundsMax;
    context.woundBoxes = Array.from({ length: 10 }, (_, i) => ({
      index:  i,
      filled: i < woundsValue,
      active: i < maxWounds,
    }));

    // Conditions
    const cond = system.conditions ?? {};
    context.conditions = {
      burning:     Number(cond.burning)    || 0,
      slow:        !!cond.slow,
      fast:        !!cond.fast,
      stunned:     !!cond.stunned,
      paralyzed:   !!cond.paralyzed,
      focused:     Number(cond.focused)    || 0,
      defensive:   !!cond.defensive,
      distracted:  !!cond.distracted,
      immobilized: !!cond.immobilized,
    };

    // Destiny — always pad to 5 entries
    const destiny    = system.destiny ?? {};
    const rawSpread  = toArray(destiny.spread);
    const rawSteps   = toArray(destiny.steps);
    const currentStep = destiny.currentStep ?? 1;

    context.destinySpread = Array.from({ length: 5 }, (_, i) => {
      const card = rawSpread[i] ?? {};
      return { index: i, suit: card.suit ?? "", value: card.value ?? "", symbol: SUIT_SYMBOLS[card.suit ?? ""] ?? "?" };
    });

    context.destinySteps = Array.from({ length: 5 }, (_, i) => {
      const step = rawSteps[i] ?? {};
      return { index: i, number: i + 1, text: step.text ?? "", completed: !!step.completed, isCurrent: currentStep === i + 1 };
    });

    context.destinyAgenda = {
      text:     destiny.agenda         ?? "",
      complete: !!destiny.agendaComplete,
    };
    context.destinyCurrentStep = currentStep;

    // Pursuits
    const rawPursuits = toArray(system.pursuits);
    context.pursuits  = rawPursuits.map((p, i) => ({ index: i, name: p.name ?? "", session: p.session ?? "" }));

    // Talents
    const rawTalents = toArray(system.talents);
    context.talents  = rawTalents.map((t, i) => ({ index: i, name: t.name ?? "", description: t.description ?? "" }));

    // Manifested Powers
    const rawMp  = toArray(system.manifestedPowers);
    context.manifestedPowers = rawMp.map((p, i) => ({ index: i, name: p.name ?? "", description: p.description ?? "" }));

    // Other Abilities
    const rawOa = toArray(system.otherAbilities);
    context.otherAbilities = rawOa.map((o, i) => ({ index: i, name: o.name ?? "", description: o.description ?? "" }));

    // Grimoire
    const rawGrimoire = toArray(system.grimoire);
    context.grimoire  = rawGrimoire.map((s, i) => ({
      index:       i,
      theory:      s.theory      ?? "",
      name:        s.name        ?? "",
      tn:          s.tn          ?? 0,
      range:       s.range       ?? "",
      duration:    s.duration    ?? "",
      description: s.description ?? "",
      immutos:     s.immutos     ?? "",
    }));

    // Items
    const allItemsArr = Array.from(this.actor.items);
    context.weapons = allItemsArr.filter(i => i.type === "weapon").map(i => ({ id: i.id, name: i.name, system: i.system }));
    context.armors  = allItemsArr.filter(i => i.type === "armor" ).map(i => ({ id: i.id, name: i.name, system: i.system }));
    context.gears   = allItemsArr.filter(i => i.type === "gear"  ).map(i => ({ id: i.id, name: i.name, system: i.system }));

    // Fate Deck — communal world deck + per-character hand
    const fd = system.fateDeck ?? {};
    let worldDeckId = "", worldPileId = "";
    try {
      worldDeckId = game.settings.get("ttb-actors", "fateDeckId") ?? "";
      worldPileId = game.settings.get("ttb-actors", "fatePileId") ?? "";
    } catch (_) {}

    const worldDeck  = worldDeckId ? game.cards?.get(worldDeckId) : null;
    const worldPile  = worldPileId ? game.cards?.get(worldPileId) : null;
    const handDoc    = fd.handId    ? game.cards?.get(fd.handId)    : null;
    const discardDoc = fd.discardId ? game.cards?.get(fd.discardId) : null;

    context.worldDeckMissing = !worldDeck;
    context.handMissing      = !handDoc;
    context.isGM             = game.user?.isGM ?? false;
    context.deckSize         = worldDeck  ? worldDeck.cards.size  : 0;
    context.pileSize         = worldPile  ? worldPile.cards.size  : 0;
    context.handSize         = handDoc    ? handDoc.cards.size    : 0;
    context.discardSize      = discardDoc ? discardDoc.cards.size : 0;

    const duel = fd.duel ?? {};
    context.duelSkillKey = duel.skillKey ?? "";
    context.duelTN       = duel.tn       ?? 10;
    context.duelModifier = duel.modifier ?? 0;
    const mod = duel.modifier ?? 0;
    context.duelModifierDisplay  = mod > 0 ? `+${mod}` : mod < 0 ? `\u2212${Math.abs(mod)}` : "0";
    context.duelModifierPositive = mod > 0;
    context.duelModifierNegative = mod < 0;
    context.skillOptions = buildSkillOptions(system, (k) => loc(k), duel.skillKey ?? "");

    const lf = fd.lastFlip ?? {};
    if (lf.name) {
      const cardInfo = cardDisplayInfoFromData(lf.suit, lf.value, lf.name);
      const mos = lf.mos ?? 0;
      context.lastFlip = {
        ...cardInfo,
        tn:         lf.tn       ?? 10,
        av:         lf.av       ?? 0,
        total:      lf.total    ?? 0,
        skillKey:   lf.skillKey ?? "",
        skillLabel: lf.skillKey ? loc(`TTB.Skill.${lf.skillKey}`) : "",
        success:    !!lf.success,
        mos,
        mosAbs:     Math.abs(mos),
        hasMos:     mos > 0,
        hasMof:     mos < 0,
        canCheat:   lf.canCheat !== false,
      };
    } else {
      context.lastFlip = null;
    }

    context.canCheat  = lf.name ? (lf.canCheat !== false) : false;
    context.hand      = handDoc ? handDoc.cards.contents.map(c => cardDisplayInfo(c)) : [];
    context.handEmpty = context.hand.length === 0;

    return context;
  }

  /** Repair array fields before saving to prevent Foundry's expandObject corruption. */
  async _updateObject(event, formData) {
    const expanded = repairArrays(foundry.utils.expandObject(formData));
    return this.actor.update(expanded);
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Re-register card hooks every render so tracked IDs stay current.
    this._registerFateHooks();

    html.find(".ttb-actors-attr-value").change((ev) => {
      const attr = ev.currentTarget.dataset.attr;
      this.actor.update({ [`system.attributes.${attr}.value`]: Number(ev.currentTarget.value) });
    });

    html.find(".ttb-attr-suit-btn").click((ev) => {
      const attr    = ev.currentTarget.dataset.attr;
      const suit    = ev.currentTarget.dataset.suit;
      const current = this.actor.system.attributes?.[attr]?.suit ?? "";
      this.actor.update({ [`system.attributes.${attr}.suit`]: current === suit ? "" : suit });
    });

    html.find(".ttb-actors-skill-value").change((ev) => {
      const skill = ev.currentTarget.dataset.skill;
      this.actor.update({ [`system.skills.${skill}.value`]: Number(ev.currentTarget.value) });
    });

    html.find(".ttb-skill-practiced").change((ev) => {
      const skill = ev.currentTarget.dataset.skill;
      this.actor.update({ [`system.skills.${skill}.practiced`]: ev.currentTarget.checked });
    });

    html.find(".ttb-skill-triggers").change((ev) => {
      const skill = ev.currentTarget.dataset.skill;
      this.actor.update({ [`system.skills.${skill}.triggers`]: ev.currentTarget.value });
    });

    html.find(".ttb-wound-box").click((ev) => {
      const idx     = Number(ev.currentTarget.dataset.index);
      const current = this.actor.system.wounds?.value ?? 0;
      const newVal  = current === idx + 1 ? idx : idx + 1;
      this.actor.update({ "system.wounds.value": newVal });
    });

    html.find(".ttb-soulstone-dot").click((ev) => {
      const idx     = Number(ev.currentTarget.dataset.index);
      const current = this.actor.system.soulstones?.value ?? 0;
      const newVal  = current === idx + 1 ? idx : idx + 1;
      this.actor.update({ "system.soulstones.value": newVal });
    });

    html.find(".ttb-destiny-step-check").click((ev) => {
      const idx   = Number(ev.currentTarget.dataset.index);
      const steps = foundry.utils.deepClone(toArray(this.actor.system.destiny?.steps));
      if (!steps[idx]) steps[idx] = { text: "", completed: false };
      steps[idx].completed = !steps[idx].completed;
      this.actor.update({ "system.destiny.steps": steps });
    });

    // Pursuits
    html.find(".ttb-pursuit-add").click(() => {
      const pursuits = toArray(foundry.utils.deepClone(this.actor.system.pursuits));
      pursuits.push({ name: "", session: "" });
      this.actor.update({ "system.pursuits": pursuits });
    });
    html.find(".ttb-pursuit-delete").click((ev) => {
      const idx      = Number(ev.currentTarget.dataset.index);
      const pursuits = toArray(foundry.utils.deepClone(this.actor.system.pursuits));
      pursuits.splice(idx, 1);
      this.actor.update({ "system.pursuits": pursuits });
    });

    // Talents
    html.find(".ttb-talent-add").click(() => {
      const talents = toArray(foundry.utils.deepClone(this.actor.system.talents));
      talents.push({ name: "", description: "" });
      this.actor.update({ "system.talents": talents });
    });
    html.find(".ttb-talent-delete").click((ev) => {
      const idx     = Number(ev.currentTarget.dataset.index);
      const talents = toArray(foundry.utils.deepClone(this.actor.system.talents));
      talents.splice(idx, 1);
      this.actor.update({ "system.talents": talents });
    });

    // Other Abilities
    html.find(".ttb-other-ability-add").click(() => {
      const oa = toArray(foundry.utils.deepClone(this.actor.system.otherAbilities));
      oa.push({ name: "", description: "" });
      this.actor.update({ "system.otherAbilities": oa });
    });
    html.find(".ttb-other-ability-delete").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const oa  = toArray(foundry.utils.deepClone(this.actor.system.otherAbilities));
      oa.splice(idx, 1);
      this.actor.update({ "system.otherAbilities": oa });
    });

    // Manifested Powers
    html.find(".ttb-mp-add").click(() => {
      const mp = toArray(foundry.utils.deepClone(this.actor.system.manifestedPowers));
      mp.push({ name: "", description: "" });
      this.actor.update({ "system.manifestedPowers": mp });
    });
    html.find(".ttb-mp-delete").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const mp  = toArray(foundry.utils.deepClone(this.actor.system.manifestedPowers));
      mp.splice(idx, 1);
      this.actor.update({ "system.manifestedPowers": mp });
    });

    // Grimoire
    html.find(".ttb-grimoire-add").click(() => {
      const grimoire = toArray(foundry.utils.deepClone(this.actor.system.grimoire));
      grimoire.push({ theory: "", name: "", tn: 0, range: "", duration: "", description: "", immutos: "" });
      this.actor.update({ "system.grimoire": grimoire });
    });
    html.find(".ttb-grimoire-delete").click((ev) => {
      const idx      = Number(ev.currentTarget.dataset.index);
      const grimoire = toArray(foundry.utils.deepClone(this.actor.system.grimoire));
      grimoire.splice(idx, 1);
      this.actor.update({ "system.grimoire": grimoire });
    });
    html.find(".ttb-grimoire-field").change((ev) => {
      const el    = ev.currentTarget;
      const idx   = Number(el.dataset.index);
      const field = el.dataset.field;
      const val   = el.type === "number" ? Number(el.value) : el.value;
      const grimoire = toArray(foundry.utils.deepClone(this.actor.system.grimoire));
      if (grimoire[idx]) grimoire[idx][field] = val;
      this.actor.update({ "system.grimoire": grimoire });
    });

    // Items (weapons, armor, gear, talents, spells) — equipment tab
    html.find(".ttb-item-edit").click((ev) => {
      const itemId = ev.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      this.actor.items.get(itemId)?.sheet.render(true);
    });
    html.find(".ttb-item-delete").click((ev) => {
      const itemId = ev.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      if (itemId) this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });
    html.find(".ttb-item-equipped").change((ev) => {
      const itemId = ev.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      if (itemId) this.actor.items.get(itemId)?.update({ "system.equipped": ev.currentTarget.checked });
    });

    // ── Fate Deck listeners ──────────────────────────────────────────────────

    // Save duel setup fields to actor on change
    html.find(".ttb-duel-skill").change((ev) => {
      this.actor.update({ "system.fateDeck.duel.skillKey": ev.currentTarget.value });
    });
    html.find(".ttb-duel-tn").change((ev) => {
      this.actor.update({ "system.fateDeck.duel.tn": Number(ev.currentTarget.value) });
    });

    // Fate Modifier controls
    html.find(".ttb-modifier-plus").click(() => {
      const cur = this.actor.system.fateDeck?.duel?.modifier ?? 0;
      this.actor.update({ "system.fateDeck.duel.modifier": cur + 1 });
    });
    html.find(".ttb-modifier-minus").click(() => {
      const cur = this.actor.system.fateDeck?.duel?.modifier ?? 0;
      this.actor.update({ "system.fateDeck.duel.modifier": cur - 1 });
    });
    html.find(".ttb-modifier-reset").click(() => {
      this.actor.update({ "system.fateDeck.duel.modifier": 0 });
    });

    // Flip — draw card(s) from world Fate Deck and compute duel result
    html.find(".ttb-deck-flip").click(() => this._fateOp(async () => {
      const duel = this.actor.system.fateDeck?.duel ?? {};
      await this._fateFlip(duel.skillKey ?? "", duel.tn ?? 10, duel.modifier ?? 0);
    }));

    // Cheat Fate — play card from Control Hand
    html.find(".ttb-hand-play").click((ev) => this._fateOp(async () => {
      const cardId = ev.currentTarget.dataset.cardId;
      if (!cardId) return;
      const lf = this.actor.system.fateDeck?.lastFlip ?? {};
      if (lf.canCheat === false) return ui.notifications.warn("TTB | Cannot Cheat Fate on this flip.");
      await this._cheatFate(cardId);
    }));

    // Draw a card from the world Fate Deck to Control Hand
    html.find(".ttb-draw-to-hand").click(() => this._fateOp(async () => {
      await this._drawToHand();
    }));

    // Open Control Hand (per-character)
    html.find(".ttb-hand-open").click(() => {
      game.cards?.get(this.actor.system.fateDeck?.handId ?? "")?.sheet.render(true);
    });

    // Recreate Control Hand if missing
    html.find(".ttb-control-hand-create").click(() => this._fateOp(async () => {
      await this.actor._createControlHand();
      this.render(false);
    }));
  }

  /** Allow dragging Item documents from the sidebar/compendium onto this sheet. */
  async _onDropItem(event, data) {
    if (!this.actor.isOwner) return false;
    const item = await Item.fromDropData(data);
    if (!item) return false;
    const allowed = ["weapon", "armor", "gear", "talent", "spell"];
    if (!allowed.includes(item.type)) {
      ui.notifications.warn(`TTB | Cannot add item type "${item.type}" to a character.`);
      return false;
    }
    // If already owned by this actor, default Foundry sorts/moves handle it.
    return super._onDropItem(event, data);
  }

  /**
   * Flip cards from the communal world Fate Deck.
   * Applies Fate Modifier rules, Joker priority, and computes duel result.
   */
  async _fateFlip(skillKey, tn, modifier) {
    let worldDeckId = "", worldPileId = "";
    try {
      worldDeckId = game.settings.get("ttb-actors", "fateDeckId") ?? "";
      worldPileId = game.settings.get("ttb-actors", "fatePileId") ?? "";
    } catch (_) {}

    const deck = worldDeckId ? game.cards?.get(worldDeckId) : null;
    const pile = worldPileId ? game.cards?.get(worldPileId) : null;
    if (!deck || !pile) return ui.notifications.warn("TTB | Communal Fate Deck not found. Ask the GM to create it.");
    if (deck.cards.size === 0) return ui.notifications.warn("TTB | Fate Deck is empty. Ask the GM to reshuffle.");

    // modifier=0 → 1 card; modifier=±N → N+1 cards (use best/worst)
    const flipCount = Math.abs(modifier) + 1;
    const sorted    = deck.cards.contents.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));
    const toFlip    = sorted.slice(0, Math.min(flipCount, sorted.length));
    if (toFlip.length === 0) return;

    for (const c of toFlip) {
      if (c.drawn) await deck.updateEmbeddedDocuments("Card", [{ _id: c.id, drawn: false }]);
    }
    await deck.pass(pile, toFlip.map(c => c.id));
    for (const c of toFlip) await revealCard(pile, c.id);

    // Select card per Joker priority + modifier rules
    const blackJoker = toFlip.find(c => c.suit === "Joker" && c.value === 0);
    const redJoker   = toFlip.find(c => c.suit === "Joker" && c.value === 14);
    let selected;
    if      (blackJoker)   selected = blackJoker;
    else if (redJoker)     selected = redJoker;
    else if (modifier > 0) selected = toFlip.reduce((b, c) => c.value > b.value ? c : b);
    else if (modifier < 0) selected = toFlip.reduce((b, c) => c.value < b.value ? c : b);
    else                   selected = toFlip[0];

    const system   = this.actor.system;
    const skill    = skillKey ? (system.skills?.[skillKey] ?? null) : null;
    const attrVal  = skill ? (system.attributes?.[skill.attribute]?.value ?? 2) : 0;
    const av       = attrVal + (skill?.value ?? 0);
    const cardVal  = selected.value ?? 0;
    const total    = cardVal + av;
    const success  = total >= tn;
    const mos      = Math.floor((total - tn) / 5);
    const canCheat = selected.suit !== "Joker";

    await this.actor.update({
      "system.fateDeck.lastFlip.suit":     selected.suit  ?? "",
      "system.fateDeck.lastFlip.value":    selected.value ?? 0,
      "system.fateDeck.lastFlip.name":     selected.name  ?? "",
      "system.fateDeck.lastFlip.tn":       tn,
      "system.fateDeck.lastFlip.av":       av,
      "system.fateDeck.lastFlip.total":    total,
      "system.fateDeck.lastFlip.skillKey": skillKey,
      "system.fateDeck.lastFlip.success":  success,
      "system.fateDeck.lastFlip.mos":      mos,
      "system.fateDeck.lastFlip.canCheat": canCheat,
    });

    await this._postFlipToChat({
      actorName:    this.actor.name,
      skillLabel:   skillKey ? loc(`TTB.Skill.${skillKey}`) : "",
      cardName:     selected.name  ?? "",
      cardSuit:     selected.suit  ?? "",
      cardVal,
      tn, av, total, success, mos,
      isRedJoker:   selected.suit === "Joker" && selected.value === 14,
      isBlackJoker: selected.suit === "Joker" && selected.value === 0,
      flipCount,
      modifier,
    });
  }

  /**
   * Cheat Fate — replace the last flip result with a card from the Control
   * Hand. Recomputes result using stored AV so only the card value changes.
   */
  async _cheatFate(cardId) {
    const sys     = this.actor.system.fateDeck ?? {};
    const hand    = sys.handId    ? game.cards?.get(sys.handId)    : null;
    const discard = sys.discardId ? game.cards?.get(sys.discardId) : null;
    if (!hand || !discard || !cardId) return;

    const card = hand.cards.get(cardId);
    if (!card) return;

    const lf      = sys.lastFlip ?? {};
    const tn      = lf.tn ?? 10;
    const av      = lf.av ?? 0;
    const cardVal = card.value ?? 0;
    const total   = cardVal + av;
    const success = total >= tn;
    const mos     = Math.floor((total - tn) / 5);

    await hand.pass(discard, [cardId]);
    await revealCard(discard, cardId);

    await this.actor.update({
      "system.fateDeck.lastFlip.suit":     card.suit  ?? "",
      "system.fateDeck.lastFlip.value":    card.value ?? 0,
      "system.fateDeck.lastFlip.name":     card.name  ?? "",
      "system.fateDeck.lastFlip.total":    total,
      "system.fateDeck.lastFlip.success":  success,
      "system.fateDeck.lastFlip.mos":      mos,
      "system.fateDeck.lastFlip.canCheat": false,
    });

    await this._postFlipToChat({
      actorName:    this.actor.name,
      skillLabel:   lf.skillKey ? loc(`TTB.Skill.${lf.skillKey}`) : "",
      cardName:     card.name  ?? "",
      cardSuit:     card.suit  ?? "",
      cardVal,
      tn, av, total, success, mos,
      isRedJoker:   card.suit === "Joker" && card.value === 14,
      isBlackJoker: card.suit === "Joker" && card.value === 0,
      cheated: true,
    });
  }

  /** Draw the top card from the world Fate Deck into this character's Control Hand and reveal it. */
  async _drawToHand() {
    let worldDeckId = "";
    try { worldDeckId = game.settings.get("ttb-actors", "fateDeckId") ?? ""; } catch (_) {}
    const deck   = worldDeckId ? game.cards?.get(worldDeckId) : null;
    const handId = this.actor.system.fateDeck?.handId ?? "";
    const hand   = handId ? game.cards?.get(handId) : null;
    if (!deck)  return ui.notifications.warn("TTB | Communal Fate Deck not found. Ask the GM to create one.");
    if (!hand)  return ui.notifications.warn("TTB | Control Hand not found. Recreate it on the Fate Deck tab.");
    if (deck.cards.size === 0) return ui.notifications.warn("TTB | Fate Deck is empty. Ask the GM to reshuffle.");
    const sorted  = deck.cards.contents.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));
    const topCard = sorted[0];
    await deck.pass(hand, [topCard.id]);
    await revealCard(hand, topCard.id);
  }

  /** Post a flip result or Cheat Fate result to the chat log as inline HTML. */
  async _postFlipToChat(data) {
    const suitLower    = (data.cardSuit ?? "").toLowerCase();
    const symbol       = SUIT_SYMBOLS[suitLower] || "?";
    const mos          = data.mos ?? 0;
    const mosAbs       = Math.abs(mos);
    const outcomeClass = data.success ? "ttb-chat-success" : "ttb-chat-failure";
    const outcomeText  = data.success
      ? (mos > 0 ? `\u2713 Success (MoS ${mos})` : "\u2713 Success")
      : (mos < 0 ? `\u2717 Failure (MoF ${mosAbs})` : "\u2717 Failure");

    const headerDetail = data.cheated
      ? ` &mdash; Cheat Fate${data.skillLabel ? ` (${data.skillLabel})` : ""}`
      : (data.skillLabel ? ` &mdash; ${data.skillLabel}` : "");

    let jokerNote = "";
    if (data.isRedJoker)   jokerNote = `<div class="ttb-chat-joker-note">\u2605 Critical Success &mdash; triggers on any suit</div>`;
    if (data.isBlackJoker) jokerNote = `<div class="ttb-chat-joker-note">\u26a0 Critical Failure &mdash; Bad Luck Twist</div>`;

    const content = `<div class="ttb-chat-flip">
  <div class="ttb-chat-header"><strong>${data.actorName}</strong> flips${headerDetail}</div>
  <div class="ttb-chat-card ttb-suit-${suitLower}${data.isRedJoker ? " ttb-joker-red" : ""}${data.isBlackJoker ? " ttb-joker-black" : ""}">
    <span class="ttb-chat-card-symbol">${symbol}</span>
    <span class="ttb-chat-card-name">${data.cardName}</span>
    <span class="ttb-chat-card-value">${data.cardVal}</span>
  </div>
  <div class="ttb-chat-math">${data.cardVal} + AV ${data.av} = <strong>${data.total}</strong> vs TN ${data.tn}</div>
  <div class="ttb-chat-result ${outcomeClass}">${outcomeText}</div>
  ${jokerNote}
</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content,
      type: CONST.CHAT_MESSAGE_TYPES?.OOC ?? 0,
    });
  }
}
