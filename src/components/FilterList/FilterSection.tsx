import memoizeOne from 'memoize-one';
import React, { createElement, useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';

import Filter, { FilterProps } from './Filter';

export interface FilterSectionProps {
  filterType: {
    id: string;
    name: string;
  };
  isError: boolean;
  error?: Error | unknown;
  data?: FilterProps[];
  offset: number;
  itemCount: number;
}

export interface VirtualizedProps {
  startIndex: number;
  stopIndex: number;
  index: number;
  focusOnIndex: number | null;
  onItemFocused: (index: number) => void;
}

const ItemHeight = 32;

/**
 * Clamp a value between a min and max
 */
function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num)); // this must be max first, then min :)
}

/**
 * Calculates the range of section items to render
 */
function getRangeToRender(offset: number, itemCount: number, startIndex: number, stopIndex: number): [number, number] {
  if (offset > stopIndex || offset + itemCount < startIndex) {
    return [0, 0];
  }

  const from = clamp(startIndex - offset - 1, 0, itemCount - 1); // -1 for header
  const to = clamp(stopIndex - offset - 1, 0, itemCount - 1); // -1 for header

  return [from, to];
}

function FilterSection({
  filterType,
  isError,
  data,
  error,
  offset,
  itemCount,
  startIndex,
  stopIndex,
  index,
  focusOnIndex,
  onItemFocused,
}: FilterSectionProps & VirtualizedProps) {
  // Cache to memoize item styles
  const getItemStyleCache = useRef(memoizeOne(() => ({} as Record<number, React.CSSProperties>))).current;

  // Calculate range of visible items
  const [from, to] = useMemo(
    () => getRangeToRender(offset, itemCount, startIndex, stopIndex),
    [offset, itemCount, startIndex, stopIndex]
  );

  /**
   * Calculate the style for each item
   */
  const getItemStyle = (itemIndex: number): React.CSSProperties => {
    const itemStyleCache = getItemStyleCache();
    if (!Object.prototype.hasOwnProperty.call(itemStyleCache, itemIndex)) {
      itemStyleCache[itemIndex] = {
        position: 'absolute',
        top: itemIndex * ItemHeight,
        height: ItemHeight,
      };
    }

    const cached = itemStyleCache[itemIndex];
    invariant(cached, 'Cached item style should exist');
    return cached;
  };

  // Create items to render
  const itemsToRender = [];
  if (itemCount > 0 && data && !isError) {
    for (let i = from; i < to; i += 1) {
      const item = data[i];
      if (item) {
        itemsToRender.push(
          createElement(Filter, {
            key: item.filter.id,
            style: getItemStyle(i),
            isFocused: focusOnIndex === i + offset - index,
            onFocus: () => onItemFocused(i + offset - index),
            ...item,
          })
        );
      }
    }
  }

  // TODO: Handle errors
  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <li className="absolute w-full" style={{ top: offset * ItemHeight }}>
      <h4 className="sticky top-0 z-10 bg-white font-semibold px-2 flex items-center" style={{ height: ItemHeight }}>
        {filterType.name}
      </h4>

      <ul className="relative will-change-transform" style={{ height: ItemHeight * (itemCount - 1) }}>
        {itemsToRender}
      </ul>
    </li>
  );
}

export default FilterSection;
