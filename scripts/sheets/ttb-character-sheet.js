const ATTRIBUTE_ORDER = [
  "might", "grace", "speed", "resilience",
  "charm", "cunning", "tenacity", "intellect",
];

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
    context.system = this.actor.system;
    context.attributes = ATTRIBUTE_ORDER.map((key) => ({
      key,
      label: `TTB.Attribute.${key}`,
      value: this.actor.system.attributes[key].value,
    }));
    context.skillsByAttribute = ATTRIBUTE_ORDER.map((attrKey) => ({
      attribute: attrKey,
      label: `TTB.Attribute.${attrKey}`,
      skills: Object.entries(this.actor.system.skills)
        .filter(([, skill]) => skill.attribute === attrKey)
        .map(([key, skill]) => ({ key, label: `TTB.Skill.${key}`, value: skill.value })),
    }));
    context.aspectOptions = [
      { value: "crow", label: "TTB.Aspect.crow" },
      { value: "mask", label: "TTB.Aspect.mask" },
      { value: "ram",  label: "TTB.Aspect.ram"  },
      { value: "tome", label: "TTB.Aspect.tome" },
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
