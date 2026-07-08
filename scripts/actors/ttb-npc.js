export class TtbNpc extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "fatemaster") return;

    try {
      const system = this.system;
      const rank = system.rank?.value ?? 0;
      const a = system.attributes ?? {};
      const av = (name) => a[name]?.value ?? 0;

      if (system.derived) {
        system.derived.defense   = system.derived.defense || 4;
        system.derived.willpower = system.derived.willpower || 2;
        system.derived.walk      = system.derived.walk || 4;
        system.derived.charge    = system.derived.charge || 6;
        system.derived.height    = system.derived.height || 2;
        system.derived.initiative = av("speed") + rank;
      }
    } catch (err) {
      console.warn("TTB | NPC prepareDerivedData failed:", err);
    }
  }

  getRollData() {
    const data = super.getRollData();
    data.attributes = this.system.attributes;
    data.skills     = this.system.skills;
    data.derived    = this.system.derived;
    data.rank       = this.system.rank;
    return data;
  }
}
