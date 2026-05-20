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

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    return context;
  }
}
