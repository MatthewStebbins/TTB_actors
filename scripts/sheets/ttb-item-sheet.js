const ITEM_HEIGHTS = { weapon: 500, armor: 380, gear: 280, talent: 300, spell: 420 };

export class TtbItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ttb-actors", "sheet", "item"],
      width: 520,
      height: 340,
      tabs: [],
    });
  }

  get template() {
    return `systems/ttb-actors/templates/items/${this.item.type}-sheet.hbs`;
  }

  _getHeaderButtons() {
    return super._getHeaderButtons();
  }

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    if (this.item.type === "weapon") {
      const w = this.item.system;
      context.displayDamage = `${w.damageWeak ?? 0}/${w.damageMod ?? 0}/${w.damageSevere ?? 0}`;
    }
    return context;
  }

  setPosition(options = {}) {
    if (!options.height) options.height = ITEM_HEIGHTS[this.item.type] ?? 340;
    return super.setPosition(options);
  }
}
