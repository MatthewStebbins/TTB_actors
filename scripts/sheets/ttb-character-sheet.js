const ATTRIBUTE_ORDER = [
  "might", "grace", "speed", "resilience",
  "charm", "cunning", "tenacity", "intellect",
];

/** Localize a key; fall back to the last segment, title-cased, if the key isn't found. */
function loc(key) {
  const result = game.i18n.localize(key);
  if (result !== key) return result;
  // Fallback: extract last segment and insert spaces before capitals
  const segment = key.split(".").pop();
  return segment.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export class TtbCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ttb-actors", "sheet", "actor"],
      template: "systems/ttb-actors/templates/actors/character-sheet.hbs",
      width: 700,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
    });
  }

  getData() {
    const context = super.getData();
    const system = this.actor.system;
    context.system = system;

    // Compute derived stats fresh from current attribute values every render
    const a = system.attributes;
    context.derived = {
      defense:   a.grace.value,
      willpower: a.tenacity.value,
      walk:      a.speed.value,
      charge:    a.speed.value + 2,
      height:    2,
      woundsMax: a.resilience.value * 2,
    };

    context.attributes = ATTRIBUTE_ORDER.map((key) => ({
      key,
      label: loc(`TTB.Attribute.${key}`),
      value: a[key].value,
    }));

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

    context.aspectOptions = [
      { value: "crow", label: loc("TTB.Aspect.crow") },
      { value: "mask", label: loc("TTB.Aspect.mask") },
      { value: "ram",  label: loc("TTB.Aspect.ram")  },
      { value: "tome", label: loc("TTB.Aspect.tome") },
    ];

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".ttb-actors-attr-value").change((ev) => {
      const attr = ev.currentTarget.dataset.attr;
      this.actor.update({ [`system.attributes.${attr}.value`]: Number(ev.currentTarget.value) });
    });

    html.find(".ttb-actors-skill-value").change((ev) => {
      const skill = ev.currentTarget.dataset.skill;
      this.actor.update({ [`system.skills.${skill}.value`]: Number(ev.currentTarget.value) });
    });

    html.find(".ttb-actors-wounds-value").change((ev) => {
      this.actor.update({ "system.wounds.value": Number(ev.currentTarget.value) });
    });
  }
}
