export class TtbNpcSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ttb", "sheet", "npc"],
      template: "systems/ttb-actors/templates/actors/npc-sheet.hbs",
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stat-block" }],
    });
  }

  getData() {
    const context = super.getData();
    const system = this.actor.system;

    context.system = system;
    context.derived = system.derived || {};
    context.rank = system.rank || { title: "Minion", value: 0 };
    context.wounds = system.wounds || { value: 0, max: 4 };
    context.skills = system.skills || {};
    context.abilities = Array.isArray(system.abilities) ? system.abilities : Object.values(system.abilities || {});
    context.actions = Array.isArray(system.actions) ? system.actions : Object.values(system.actions || {});

    // Build wound boxes for display
    const woundArray = [];
    for (let i = 0; i < context.wounds.max; i++) {
      woundArray.push(i < context.wounds.value);
    }
    context.woundBoxes = woundArray;

    // Attribute labels (pre-computed to avoid template helpers)
    const attrLabels = {
      might: "Might", grace: "Grace", speed: "Speed", resilience: "Resilience",
      charm: "Charm", cunning: "Cunning", tenacity: "Tenacity", intellect: "Intellect",
    };

    // Build attributes list with pre-computed labels
    context.attributes = [];
    for (const [key, attr] of Object.entries(system.attributes || {})) {
      context.attributes.push({
        key,
        label: attrLabels[key] || key,
        value: attr.value,
      });
    }

    // Build skills list with organization
    context.skillsByAttribute = {
      might: { label: "Might", skills: [] },
      grace: { label: "Grace", skills: [] },
      speed: { label: "Speed", skills: [] },
      resilience: { label: "Resilience", skills: [] },
      charm: { label: "Charm", skills: [] },
      cunning: { label: "Cunning", skills: [] },
      tenacity: { label: "Tenacity", skills: [] },
      intellect: { label: "Intellect", skills: [] },
    };

    const skillOrder = ["athletics", "intimidation", "labor", "pugilism", "toughness", 
                        "acrobatics", "disguise", "evade", "prestidigitation", "ride",
                        "escapology", "pistol", "rifle", "thrownWeapons",
                        "carouse", "endurance", "mettle", "wilderness",
                        "convince", "leadership", "performance", "seduction",
                        "cheatFate", "deceive", "gambling", "lockpicking", "pickpocket", "scrutiny", "stealth",
                        "centering", "enchanting", "necromancy",
                        "notice", "occultism", "track", "arcanology"];

    // Map skills to attributes for grouping
    const skillAttrMap = {
      athletics: "might", intimidation: "might", labor: "might", pugilism: "might", toughness: "might",
      acrobatics: "grace", disguise: "grace", evade: "grace", prestidigitation: "grace", ride: "grace",
      escapology: "speed", pistol: "speed", rifle: "speed", thrownWeapons: "speed",
      carouse: "resilience", endurance: "resilience", mettle: "resilience", wilderness: "resilience",
      convince: "charm", leadership: "charm", performance: "charm", seduction: "charm",
      cheatFate: "cunning", deceive: "cunning", gambling: "cunning", lockpicking: "cunning", pickpocket: "cunning", scrutiny: "cunning", stealth: "cunning",
      centering: "tenacity", enchanting: "tenacity", necromancy: "tenacity",
      notice: "intellect", occultism: "intellect", track: "intellect", arcanology: "intellect",
    };

    for (const skillKey of skillOrder) {
      const skill = context.skills[skillKey];
      if (skill) {
        const attr = skillAttrMap[skillKey] || "intellect";
        const skillLabel = game.i18n.localize(`TTB.Skill.${skillKey}`);
        context.skillsByAttribute[attr].skills.push({ 
          key: skillKey, 
          label: skillLabel,
          value: skill.value 
        });
      }
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".ttb-wound-box").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      const current = this.actor.system.wounds.value;
      const newValue = index === current - 1 ? current - 1 : index + 1;
      this.actor.update({ "system.wounds.value": Math.min(newValue, this.actor.system.wounds.max) });
    });

    html.find(".ttb-ability-add").click(() => {
      const abilities = Array.isArray(this.actor.system.abilities) ? this.actor.system.abilities : Object.values(this.actor.system.abilities || {});
      abilities.push({ name: "", description: "" });
      this.actor.update({ "system.abilities": abilities });
    });

    html.find(".ttb-ability-delete").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      const abilities = Array.isArray(this.actor.system.abilities) ? this.actor.system.abilities : Object.values(this.actor.system.abilities || {});
      abilities.splice(index, 1);
      this.actor.update({ "system.abilities": abilities });
    });

    html.find(".ttb-ability-name").change((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      const abilities = Array.isArray(this.actor.system.abilities) ? this.actor.system.abilities : Object.values(this.actor.system.abilities || {});
      abilities[index].name = ev.currentTarget.value;
      this.actor.update({ "system.abilities": abilities });
    });

    html.find(".ttb-ability-description").change((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      const abilities = Array.isArray(this.actor.system.abilities) ? this.actor.system.abilities : Object.values(this.actor.system.abilities || {});
      abilities[index].description = ev.currentTarget.value;
      this.actor.update({ "system.abilities": abilities });
    });
  }
}
