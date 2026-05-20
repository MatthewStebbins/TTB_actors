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
}
