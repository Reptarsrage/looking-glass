import React, { useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import Virtualized from './Virtualized';
import withScroll from '../hocs/WithScroll';
import withResize from '../hocs/WithResize';

// memo?
const calculateColumnWidth = memoizeOne((columnCount, width, gutter) => {
  const sbSize = 10; // hard-coded in css
  return (width - sbSize - (columnCount + 1) * gutter) / columnCount;
});

const getAdjustedItemDimensionsEqual = (next, prev) => {
  const [id, columnCount, width, gutter] = next;
  const [pid, pColumnCount, pWidth, pGutter] = prev;

  return id === pid && columnCount === pColumnCount && width === pWidth && gutter === pGutter;
};

const getAdjustedItemDimensions = (id, columnCount, width, gutter, getItemDimensions) => {
  const columnWidth = calculateColumnWidth(columnCount, width, gutter);
  const { width: itemWidth, height: itemHeight } = getItemDimensions(id);
  const calculatedWidth = Math.min(itemWidth, columnWidth);
  const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth;
  const calculatedLeft = (columnWidth - calculatedWidth) / 2.0;
  return { height: calculatedHeight, width: calculatedWidth, left: calculatedLeft, id };
};

const Masonry = ({
  items,
  columnCount,
  getItemDimensions,
  width,
  height,
  scrollTop,
  gutter,
  scrollDirection,
  forceRenderItems,
}) => {
  const savedColumnItems = useRef([]).current;
  const { current: getAdjustedItemDimensionsMemo } = useRef(
    memoizeOne(getAdjustedItemDimensions, getAdjustedItemDimensionsEqual)
  );
  const [columnItems, totalHeight] = useMemo(() => {
    // If column count changed, reset everything
    if (savedColumnItems.length > columnCount) {
      while (savedColumnItems.length > 0) {
        savedColumnItems.pop();
      }
    }

    // Ensure each column has an entry
    while (savedColumnItems.length < columnCount) {
      savedColumnItems.push({ height: 0, id: savedColumnItems.length, items: [] });
    }

    // Ensure columns are filled with items
    let totalLength = savedColumnItems.reduce((acc, cur) => acc + cur.items.length, 0);
    if (totalLength !== items.length) {
      // Reset if items has completely changed
      if (items.length < totalLength) {
        totalLength = 0;
        savedColumnItems.forEach((savedColumnItem) => {
          savedColumnItem.height = 0;
          savedColumnItem.items = [];
        });
      }

      // Fill in column items
      // Make sure to try and balance column heights in a deterministic way
      for (let i = totalLength; i < items.length; i += 1) {
        const itemId = items[i];
        const dims = getAdjustedItemDimensionsMemo(itemId, columnCount, width, gutter, getItemDimensions); // prefer accuracy over cost
        const minHeightColumn = savedColumnItems.reduce((prev, curr) => (prev.height <= curr.height ? prev : curr));
        minHeightColumn.items.push(itemId);
        minHeightColumn.height += dims.height;
      }
    }

    // Calculate actual height for max column
    const maxHeightColumn = savedColumnItems.reduce((a, b) => (a.height > b.height ? a : b));
    const calculatedTotalHeight = maxHeightColumn.items.reduce((acc, cur) => {
      const { height: adjHeight } = getAdjustedItemDimensionsMemo(cur, columnCount, width, gutter, getItemDimensions);
      return acc + adjHeight;
    }, 0);
    return [savedColumnItems, calculatedTotalHeight];
  }, [columnCount, items, width, gutter]);

  return (
    <div style={{ width: '100%', height: `${totalHeight}px` }}>
      {columnItems.map((col, index) => {
        const columnWidth = calculateColumnWidth(columnCount, width, gutter);
        const forceRenderColumnItems = forceRenderItems
          .map((id) => [id, col.items.indexOf(id)])
          .filter((a) => a[1] >= 0);

        return (
          <Virtualized
            key={col.id}
            width={columnWidth}
            height={height}
            left={columnWidth * index + gutter * (index + 1)}
            getAdjustedDimensionsForItem={(id) =>
              getAdjustedItemDimensionsMemo(id, columnCount, width, gutter, getItemDimensions)
            }
            items={[...col.items]}
            scrollTop={scrollTop}
            scrollDirection={scrollDirection}
            gutter={gutter}
            columnNumber={index}
            forceRenderItems={forceRenderColumnItems}
          />
        );
      })}
    </div>
  );
};

Masonry.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnCount: PropTypes.number.isRequired,
  getItemDimensions: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  scrollDirection: PropTypes.number.isRequired,
  forceRenderItems: PropTypes.arrayOf(PropTypes.string).isRequired,
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

function areEqual(nextProps, prevProps) {
  return (
    nextProps.scrollTop === prevProps.scrollTop &&
    nextProps.width === prevProps.width &&
    nextProps.height === prevProps.height &&
    nextProps.columnCount === prevProps.columnCount &&
    nextProps.gutter === prevProps.gutter &&
    itemsEqual(nextProps.items, prevProps.items) &&
    itemsEqual(nextProps.forceRenderItems, prevProps.forceRenderItems)
  );
}

export default withResize(withScroll(memo(Masonry, areEqual)));
