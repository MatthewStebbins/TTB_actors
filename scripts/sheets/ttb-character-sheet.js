const ATTRIBUTE_ORDER = [
  "might", "grace", "speed", "resilience",
  "charm", "cunning", "tenacity", "intellect",
];

const SUIT_SYMBOLS = { crow: "\u2660", mask: "\u2663", ram: "\u2665", tome: "\u2666", "": "?" };

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

/** Localize a key; fall back to the last segment title-cased if not found. */
function loc(key) {
  const result = game.i18n.localize(key);
  if (result !== key) return result;
  const segment = key.split(".").pop();
  return segment.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
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

    context.destinyAgenda         = destiny.agenda         ?? "";
    context.destinyAgendaComplete = !!destiny.agendaComplete;

    // Pursuits / Talents / Manifested Powers / Other Abilities
    context.pursuits         = toArray(system.pursuits);
    context.talents          = toArray(system.talents);
    context.manifestedPowers = toArray(system.manifestedPowers);
    context.otherAbilities   = toArray(system.otherAbilities);
    context.pursuitsEmpty         = context.pursuits.length         === 0;
    context.talentsEmpty          = context.talents.length          === 0;
    context.manifestedPowersEmpty = context.manifestedPowers.length === 0;
    context.otherAbilitiesEmpty   = context.otherAbilities.length   === 0;

    // Grimoire
    context.grimoire      = toArray(system.grimoire);
    context.grimoireEmpty = context.grimoire.length === 0;

    // Items by type
    context.weapons   = allItems.filter((i) => i.type === "weapon");
    context.armors    = allItems.filter((i) => i.type === "armor");
    context.inventory = allItems.filter((i) => i.type === "gear");

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

    html.find(".ttb-actors-attr-value").change((ev) => {
      const attr = ev.currentTarget.dataset.attr;
      this.actor.update({ [`system.attributes.${attr}.value`]: Number(ev.currentTarget.value) });
    });

    html.find(".ttb-attr-suit-btn").click((ev) => {
      const attr    = ev.currentTarget.dataset.attr;
      const suit    = ev.currentTarget.dataset.suit;
      const current = this.actor.system.attributes?.[attr]?.suit ?? "";
      // clicking the active suit deselects it
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

    // Soulstone dot click — toggle fill up to that dot
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

    // Manifested Powers
    html.find(".ttb-power-add").click(() => {
      const powers = toArray(foundry.utils.deepClone(this.actor.system.manifestedPowers));
      powers.push({ name: "", description: "" });
      this.actor.update({ "system.manifestedPowers": powers });
    });
    html.find(".ttb-power-delete").click((ev) => {
      const idx    = Number(ev.currentTarget.dataset.index);
      const powers = toArray(foundry.utils.deepClone(this.actor.system.manifestedPowers));
      powers.splice(idx, 1);
      this.actor.update({ "system.manifestedPowers": powers });
    });

    // Other Abilities
    html.find(".ttb-ability-add").click(() => {
      const abilities = toArray(foundry.utils.deepClone(this.actor.system.otherAbilities));
      abilities.push({ name: "", description: "" });
      this.actor.update({ "system.otherAbilities": abilities });
    });
    html.find(".ttb-ability-delete").click((ev) => {
      const idx       = Number(ev.currentTarget.dataset.index);
      const abilities = toArray(foundry.utils.deepClone(this.actor.system.otherAbilities));
      abilities.splice(idx, 1);
      this.actor.update({ "system.otherAbilities": abilities });
    });

    // Grimoire
    html.find(".ttb-grimoire-add").click(() => {
      const grimoire = toArray(foundry.utils.deepClone(this.actor.system.grimoire));
      grimoire.push({ theory: "", name: "", cost: "", range: "", duration: "", description: "" });
      this.actor.update({ "system.grimoire": grimoire });
    });
    html.find(".ttb-grimoire-delete").click((ev) => {
      const idx      = Number(ev.currentTarget.dataset.index);
      const grimoire = toArray(foundry.utils.deepClone(this.actor.system.grimoire));
      grimoire.splice(idx, 1);
      this.actor.update({ "system.grimoire": grimoire });
    });

    // Items
    html.find(".ttb-item-create").click((ev) => {
      const type = ev.currentTarget.dataset.type;
      Item.create({ name: `New ${type}`, type }, { parent: this.actor });
    });
    html.find(".ttb-item-edit").click((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.sheet.render(true);
    });
    html.find(".ttb-item-delete").click((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.delete();
    });
    html.find(".ttb-item-equipped").change((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.update({ "system.equipped": ev.currentTarget.checked });
    });
  }
}
