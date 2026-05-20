export class TtbActor extends Actor {
  /** Compute derived stats after base data is prepared. */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;

    const attrs = this.system.attributes;
    if (!attrs) return;

    this.system.derived ??= {};
    this.system.derived.defense   = attrs.grace.value;
    this.system.derived.willpower = attrs.tenacity.value;
    this.system.derived.walk      = attrs.speed.value;
    this.system.derived.charge    = attrs.speed.value + 2;
    this.system.derived.height    = 2;

    this.system.wounds ??= { value: 0, max: 0 };
    this.system.wounds.max = attrs.resilience.value * 2;
  }
}
