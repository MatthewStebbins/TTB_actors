export class TtbActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;

    const system = this.system;
    const a = system.attributes;

    // Sum defense bonus from all equipped armor items
    const armorBonus = this.items
      .filter((i) => i.type === "armor" && i.system.equipped)
      .reduce((sum, i) => sum + (i.system.defenseBonus ?? 0), 0);

    system.derived.defense   = a.grace.value + armorBonus;
    system.derived.willpower = a.tenacity.value;
    system.derived.walk      = a.speed.value;
    system.derived.charge    = a.speed.value + 2;
    system.derived.height    = 2;
    system.wounds.max        = a.resilience.value * 2;
  }

  getRollData() {
    const data = super.getRollData();
    data.attributes = this.system.attributes;
    data.skills     = this.system.skills;
    data.derived    = this.system.derived;
    return data;
  }
}
