export class TtbActor extends Actor {
  /** Compute derived stats after base data is prepared. */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;

    const attrs = this.system.attributes;
    const derived = this.system.derived;

    derived.defense   = attrs.grace.value;
    derived.willpower = attrs.tenacity.value;
    derived.walk      = attrs.speed.value;
    derived.charge    = attrs.speed.value + 2;
    derived.height    = 2;

    this.system.wounds.max = attrs.resilience.value * 2;
  }
}
