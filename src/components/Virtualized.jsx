import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

/**
 * Performs a binary search on the items to find the closest item to the target.
 *
 * @param {*} start The lower bound when searching the items array
 * @param {*} end The upper bound when searching the items array
 * @param {*} target The container's current scroll position
 * @param {*} itemPositions A collection of all previously computed positions
 * @param {*} items Array of item IDs
 */
function findNearestItem(start, end, target, itemPositions, items) {
  if (start === end) {
    return start;
  }

  let low = start;
  let high = end;
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const { top, height } = itemPositions[items[middle]];
    const bottom = top + height;

    if (top <= target && bottom >= target) {
      return middle;
    }

    if (top > target) {
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  if (low > start) {
    return low - 1;
  }

  return start;
}

/**
 * Computes positions for all items on screen (or above).
 *
 * @param {*} items Array of item IDs
 * @param {*} left The left offset to apply to item positions
 * @param {*} gutter The space between items
 * @param {*} height The container height
 * @param {*} scrollTop The container's current scroll position
 * @param {*} width The container's width
 * @param {*} saved A collection of all previously computed positions
 * @param {*} getItemDimensions Function that takes an item ID and returns dimensions for the item
 */
function computePositions(items, left, gutter, height, scrollTop, width, saved, getItemDimensions) {
  if (width !== saved.width || items.length <= saved.lastComputedIdx) {
    saved.lastComputedIdx = -1;
    saved.computedById = {};
    saved.width = width;
  }

  const bottom = scrollTop + height;
  let top = gutter;
  if (saved.lastComputedIdx >= 0) {
    const lastComputedItem = saved.computedById[items[saved.lastComputedIdx]];
    top += lastComputedItem.top + lastComputedItem.height;
  }

  for (let position = saved.lastComputedIdx + 1; position < items.length && top < bottom; position += 1) {
    const id = items[position];
    const dims = getItemDimensions(id);
    saved.computedById[id] = { ...dims, top, left: dims.left + left, id };
    top += dims.height + gutter;
    saved.lastComputedIdx = position;
  }
}

/**
 * Computes positions for all items up to the given position.
 *
 * @param {*} items Array of item IDs
 * @param {*} left The left offset to apply to item positions
 * @param {*} gutter The space between items
 * @param {*} saved A collection of all previously computed positions
 * @param {*} toPosition The upper bound on item positions to compute
 * @param {*} getItemDimensions Function that takes an item ID and returns dimensions for the item
 */
function computeUpToPosition(items, left, gutter, saved, toPosition, getItemDimensions) {
  let top = gutter;
  if (saved.lastComputedIdx >= 0) {
    const lastComputedItem = saved.computedById[items[saved.lastComputedIdx]];
    top += lastComputedItem.top + lastComputedItem.height;
  }

  for (let position = saved.lastComputedIdx + 1; position <= toPosition; position += 1) {
    const id = items[position];
    const dims = getItemDimensions(id);
    saved.computedById[id] = { ...dims, top, left: dims.left + left, id };
    top += dims.height + gutter;
    saved.lastComputedIdx = position;
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
  ChildComponent,
}) => {
  const saved = useRef({
    computedById: {
      /* width, height, top, left, id */
    },
    lastComputedIdx: -1,
    width,
  }).current;

  // Compute positions for items in or above the current window
  computePositions(items, left, gutter, height, scrollTop, width, saved, getAdjustedDimensionsForItem);

  // Calculate range of visible items
  const start = findNearestItem(0, saved.lastComputedIdx, scrollTop, saved.computedById, items);
  const end = findNearestItem(start, saved.lastComputedIdx, scrollTop + height, saved.computedById, items);

  // Check if we've been requested to render any additional items outside of the visible window
  if (forceRenderItems.some(([id]) => !(id in saved.computedById))) {
    const toPosition = Math.max(...forceRenderItems.map((id) => items.indexOf(id)));
    computeUpToPosition(items, left, gutter, saved, toPosition, getAdjustedDimensionsForItem);
  }

  return items
    .slice(start, end + 1) // take everything in the visible window
    .concat(forceRenderItems) // add in requested items
    .map((id) => saved.computedById[id]) // look up the dimensions, and render each item
    .map((item) => (
      <ChildComponent
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

Virtualized.defaultProps = {
  ChildComponent: Item,
};

Virtualized.propTypes = {
  ChildComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  left: PropTypes.number.isRequired,
  getAdjustedDimensionsForItem: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  scrollDirection: PropTypes.number.isRequired,
  forceRenderItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
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
