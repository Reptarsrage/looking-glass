import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

function findNearestItem(end, start, scrollTop, itemPositions, items) {
  let low = start;
  let high = end;

  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const itemTop = itemPositions[items[middle]].top;

    if (itemTop === scrollTop) {
      return middle;
    }

    if (itemTop < scrollTop) {
      low = middle + 1;
    } else if (itemTop > scrollTop) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  }
  return 0;
}

function computePositions(items, left, gutter, height, scrollTop, width, saved, getAdjustedDimensionsForItem) {
  if (width !== saved.width || items.length < saved.lastComputed) {
    saved.lastComputed = 0;
    saved.computedById = {};
    saved.width = width;
  }

  const bottom = scrollTop + height;
  let top = gutter;
  if (saved.lastComputed !== 0) {
    const lastComputedItem = saved.computedById[items[saved.lastComputed - 1]];
    top += lastComputedItem.top + lastComputedItem.height;
  }

  for (; saved.lastComputed < items.length && top <= bottom; saved.lastComputed += 1) {
    const id = items[saved.lastComputed];
    const dims = getAdjustedDimensionsForItem(id);
    saved.computedById[id] = { ...dims, top, left: dims.left + left, id };
    top += dims.height + gutter;
  }
}

function computeUpToPosition(items, left, gutter, saved, toPosition, getAdjustedDimensionsForItem) {
  let top = gutter;
  if (saved.lastComputed !== 0) {
    const lastComputedItem = saved.computedById[items[saved.lastComputed - 1]];
    top += lastComputedItem.top + lastComputedItem.height;
  }

  for (; saved.lastComputed <= toPosition; saved.lastComputed += 1) {
    const id = items[saved.lastComputed];
    const dims = getAdjustedDimensionsForItem(id);
    saved.computedById[id] = { ...dims, top, left: dims.left + left, id };
    top += dims.height + gutter;
  }
}

const Virtualized = ({
  width,
  height,
  left,
  getAdjustedDimensionsForItem,
  items,
  scrollTop,
  gutter,
  scrollDirection,
  forceRenderItems,
}) => {
  const saved = useRef({ computedById: {}, lastComputed: 0, width }).current;
  computePositions(items, left, gutter, height, scrollTop, width, saved, getAdjustedDimensionsForItem);

  const start = findNearestItem(saved.lastComputed - 1, 0, scrollTop, saved.computedById, items);
  const end = findNearestItem(saved.lastComputed - 1, start, scrollTop + height, saved.computedById, items);
  const more = forceRenderItems.filter(([, idx]) => idx < start || idx > end);

  if (more.some(([id]) => !(id in saved.computedById))) {
    const toPosition = Math.max(...more.map(([, idx]) => idx));
    computeUpToPosition(items, left, gutter, saved, toPosition, getAdjustedDimensionsForItem);
  }

  return items
    .slice(start, end + 1)
    .concat(more.map(([id]) => id))
    .map((id) => saved.computedById[id])
    .map((item) => (
      <Item
        key={item.id}
        itemId={item.id}
        scrollDirection={scrollDirection}
        style={{
          position: 'absolute',
          width: `${item.width}px`,
          top: `${item.top}px`,
          height: `${item.height}px`,
          left: `${item.left}px`,
        }}
      />
    ));
};

Virtualized.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  left: PropTypes.number.isRequired,
  getAdjustedDimensionsForItem: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  scrollDirection: PropTypes.number.isRequired,
  forceRenderItems: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])))
    .isRequired,
};

function itemsEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function forceRenderItemsEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i][1] !== b[i][1]) {
      return false;
    }
  }

  return true;
}

function areEqual(nextProps, prevProps) {
  return (
    nextProps.scrollTop === prevProps.scrollTop &&
    nextProps.width === prevProps.width &&
    nextProps.gutter === prevProps.gutter &&
    nextProps.columnNumber === prevProps.columnNumber &&
    nextProps.left === prevProps.left &&
    nextProps.height === prevProps.height &&
    forceRenderItemsEqual(nextProps.forceRenderItems, prevProps.forceRenderItems) &&
    itemsEqual(nextProps.items, prevProps.items)
  );
}

export default memo(Virtualized, areEqual);
