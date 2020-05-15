export default class Positioner {
  positions = [];

  totalHeight = 0;

  updatePositions = (items, offset) => {
    if (offset !== undefined) {
      this.totalHeight = offset;
    }

    for (const { id, height = 0 } of items) {
      this.positions[id] = this.totalHeight;
      this.totalHeight += height;
    }
  };

  getPositionForItem = (i) => this.positions[i];

  getTotalHeight = () => this.totalHeight;
}
