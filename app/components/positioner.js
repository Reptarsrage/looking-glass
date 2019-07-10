export default class Positioner {
  positions = [];
  totalHeight = 0;

  updatePositions = (items, offset = 0) => {
    this.totalHeight = offset;
    for (const { id, height = 0 } of items) {
      this.positions[id] = this.totalHeight;
      this.totalHeight += height;
    }
  };

  getHeightForItem = i => this.positions[i];

  getTotalHeight = () => this.totalHeight;
}
