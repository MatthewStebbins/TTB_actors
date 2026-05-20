const ATTRIBUTE_ORDER = [
  "might", "grace", "speed", "resilience",
  "charm", "cunning", "tenacity", "intellect",
];

const SUIT_SYMBOLS = { crow: "\u2660", mask: "\u2663", ram: "\u2665", tome: "\u2666", "": "?" };

/** Localize a key; fall back to the last segment title-cased if not found. */
function loc(key) {
  const result = game.i18n.localize(key);
  if (result !== key) return result;
  const segment = key.split(".").pop();
  return segment.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

/**
 * Foundry's expandObject() converts array-backed form fields
 * (e.g. name="arr.0.x") into plain objects ({"0": {x:...}}).
 * This helper safely returns a proper Array from either form.
 */
function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.keys(val)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => val[k]);
}

export class TtbCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ttb-actors", "sheet", "actor"],
      template: "systems/ttb-actors/templates/actors/character-sheet.hbs",
      width: 740,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
    });
  }

  getData() {
    const context = super.getData();
    const system  = this.actor.system;
    context.system = system;

    // Derived stats — computed fresh each render
    const a = system.attributes;
    const armorBonus = this.actor.items
      .filter((i) => i.type === "armor" && i.system.equipped)
      .reduce((sum, i) => sum + (i.system.defenseBonus ?? 0), 0);

    context.derived = {
      defense:   a.grace.value + armorBonus,
      willpower: a.tenacity.value,
      walk:      a.speed.value,
      charge:    a.speed.value + 2,
      height:    2,
      woundsMax: a.resilience.value * 2,
    };

    // Attributes
    context.attributes = ATTRIBUTE_ORDER.map((key) => ({
      key,
      label: loc(`TTB.Attribute.${key}`),
      value: a[key].value,
    }));

    // Skills grouped by attribute
    context.skillsByAttribute = ATTRIBUTE_ORDER.map((attrKey) => ({
      attrKey,
      label: loc(`TTB.Attribute.${attrKey}`),
      skills: Object.entries(system.skills)
        .filter(([, skill]) => skill.attribute === attrKey)
        .map(([key, skill]) => ({
          key,
          label: loc(`TTB.Skill.${key}`),
          value: skill.value,
        })),
    }));

    // Aspect options
    context.aspectOptions = [
      { value: "crow", label: loc("TTB.Aspect.crow") },
      { value: "mask", label: loc("TTB.Aspect.mask") },
      { value: "ram",  label: loc("TTB.Aspect.ram")  },
      { value: "tome", label: loc("TTB.Aspect.tome") },
    ];

    // Wound boxes
    const maxWounds = context.derived.woundsMax;
    context.woundBoxes = Array.from({ length: 10 }, (_, i) => ({
      index: i,
      filled: i < system.wounds.value,
      active: i < maxWounds,
    }));

    // Destiny spread — toArray() guards against Foundry turning arrays into objects
    const spread = toArray(system.destiny?.spread);
    context.destinySpread = spread.map((card, i) => ({
      index: i,
      suit:   card.suit ?? "",
      value:  card.value ?? "",
      symbol: SUIT_SYMBOLS[card.suit ?? ""] ?? "?",
    }));

    // Destiny steps
    const steps = toArray(system.destiny?.steps);
    context.destinySteps = steps.map((step, i) => ({
      index: i,
      number: i + 1,
      text:      step.text ?? "",
      completed: step.completed ?? false,
      isCurrent: (system.destiny?.currentStep ?? 1) === i + 1,
    }));

    // Pursuits & Talents
    context.pursuits = toArray(system.pursuits);
    context.talents  = toArray(system.talents);

    // Items by type
    context.weapons   = this.actor.items.filter((i) => i.type === "weapon");
    context.armors    = this.actor.items.filter((i) => i.type === "armor");
    context.inventory = this.actor.items.filter((i) => i.type === "gear");

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Attribute changes
    html.find(".ttb-actors-attr-value").change((ev) => {
      const attr = ev.currentTarget.dataset.attr;
      this.actor.update({ [`system.attributes.${attr}.value`]: Number(ev.currentTarget.value) });
    });

    // Skill changes
    html.find(".ttb-actors-skill-value").change((ev) => {
      const skill = ev.currentTarget.dataset.skill;
      this.actor.update({ [`system.skills.${skill}.value`]: Number(ev.currentTarget.value) });
    });

    // Wound boxes — click toggles wound value
    html.find(".ttb-wound-box").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const current = this.actor.system.wounds.value;
      const newVal = current === idx + 1 ? idx : idx + 1;
      this.actor.update({ "system.wounds.value": newVal });
    });

    // Destiny spread value
    html.find(".ttb-spread-value").change((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const spread = toArray(foundry.utils.deepClone(this.actor.system.destiny?.spread));
      spread[idx] = { ...spread[idx], value: ev.currentTarget.value };
      this.actor.update({ "system.destiny.spread": spread });
    });

    // Destiny spread suit
    html.find(".ttb-spread-suit").change((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const spread = toArray(foundry.utils.deepClone(this.actor.system.destiny?.spread));
      spread[idx] = { ...spread[idx], suit: ev.currentTarget.value };
      this.actor.update({ "system.destiny.spread": spread });
    });

    // Destiny step text
    html.find(".ttb-step-text").change((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const steps = toArray(foundry.utils.deepClone(this.actor.system.destiny?.steps));
      steps[idx] = { ...steps[idx], text: ev.currentTarget.value };
      this.actor.update({ "system.destiny.steps": steps });
    });

    // Destiny step toggle completed
    html.find(".ttb-destiny-step-check").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const steps = toArray(foundry.utils.deepClone(this.actor.system.destiny?.steps));
      steps[idx] = { ...steps[idx], completed: !steps[idx].completed };
      this.actor.update({ "system.destiny.steps": steps });
    });

    // Pursuit field change
    html.find(".ttb-pursuit-name, .ttb-pursuit-session").change((ev) => {
      const idx   = Number(ev.currentTarget.dataset.index);
      const field = ev.currentTarget.dataset.field;
      const pursuits = toArray(foundry.utils.deepClone(this.actor.system.pursuits));
      pursuits[idx] = { ...pursuits[idx], [field]: ev.currentTarget.value };
      this.actor.update({ "system.pursuits": pursuits });
    });

    // Pursuit add
    html.find(".ttb-pursuit-add").click(() => {
      const pursuits = toArray(foundry.utils.deepClone(this.actor.system.pursuits));
      pursuits.push({ name: "", session: "" });
      this.actor.update({ "system.pursuits": pursuits });
    });

    // Pursuit delete
    html.find(".ttb-pursuit-delete").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const pursuits = toArray(foundry.utils.deepClone(this.actor.system.pursuits));
      pursuits.splice(idx, 1);
      this.actor.update({ "system.pursuits": pursuits });
    });

    // Talent field change
    html.find(".ttb-talent-name, .ttb-talent-desc").change((ev) => {
      const idx   = Number(ev.currentTarget.dataset.index);
      const field = ev.currentTarget.dataset.field;
      const talents = toArray(foundry.utils.deepClone(this.actor.system.talents));
      talents[idx] = { ...talents[idx], [field]: ev.currentTarget.value };
      this.actor.update({ "system.talents": talents });
    });

    // Talent add
    html.find(".ttb-talent-add").click(() => {
      const talents = toArray(foundry.utils.deepClone(this.actor.system.talents));
      talents.push({ name: "", description: "" });
      this.actor.update({ "system.talents": talents });
    });

    // Talent delete
    html.find(".ttb-talent-delete").click((ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      const talents = toArray(foundry.utils.deepClone(this.actor.system.talents));
      talents.splice(idx, 1);
      this.actor.update({ "system.talents": talents });
    });

    // Item create
    html.find(".ttb-item-create").click((ev) => {
      const type = ev.currentTarget.dataset.type;
      Item.create({ name: `New ${type}`, type }, { parent: this.actor });
    });

    // Item edit
    html.find(".ttb-item-edit").click((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.sheet.render(true);
    });

    // Item delete
    html.find(".ttb-item-delete").click((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.delete();
    });

    // Item equipped toggle
    html.find(".ttb-item-equipped").change((ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.update({ "system.equipped": ev.currentTarget.checked });
    });
  }
}
