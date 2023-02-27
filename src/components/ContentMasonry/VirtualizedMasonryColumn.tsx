import memoizeOne from 'memoize-one';
import React, { createElement, memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIntersectionObserverRef } from 'rooks';
import invariant from 'tiny-invariant';

import {
  getEstimatedTotalSize,
  getItemOffset,
  getItemSize,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  MasonryInstanceProps,
  MasonryItemSizeFunc,
} from './masonryUtils';

export interface RequiredItemData {
  id: string;
  height: number;
  width: number;
}

export interface MasonryItemProps<TItemData extends RequiredItemData> {
  style: React.CSSProperties;
  isScrolling: boolean;
  item: TItemData;
}

export interface MasonryOnItemsRenderedParams {
  column: number;
  overscanStartIndex: number;
  overscanStopIndex: number;
  visibleStartIndex: number;
  visibleStopIndex: number;
}

export type ScrollDirection = 'forward' | 'backward';
export interface MasonryOnScrollParams {
  scrollDirection: ScrollDirection;
  scrollOffset: number;
}

export interface VirtualizedMasonryColumnProps<TItemData extends RequiredItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  id: number;
  items: TItemData[];
  width: number;
  scrollOffset: number;
  scrollDirection: ScrollDirection;
  isScrolling: boolean;
  overscanCount: number;
  estimatedItemSize: number;
  gutter: number;
  loadMore?: () => void;
  scrollTo: (y: number) => void;
  scrollToItem: string | null;
}

function clampImageDimensions(width: number, height: number, maxWidth: number) {
  const clampWidth = maxWidth;
  const clampHeight = (height / width) * clampWidth;
  return { width: clampWidth, height: clampHeight };
}

function VirtualizedMasonryColumn<TItemData extends RequiredItemData>({
  children,
  id,
  items,
  width,
  scrollOffset,
  scrollDirection,
  isScrolling,
  overscanCount,
  estimatedItemSize,
  gutter,
  loadMore,
  scrollTo,
  scrollToItem,
}: VirtualizedMasonryColumnProps<TItemData>) {
  const columnIndex = id;
  const height = window.innerHeight;
  const itemCount = items.length;
  function itemSize(idx: number) {
    const item = items[idx];
    invariant(item, 'Item not found in items array');

    const dims = clampImageDimensions(item.width, item.height, width);
    return dims.height;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceProps = useRef<MasonryInstanceProps>({
    itemMetadataMap: {},
    estimatedItemSize: estimatedItemSize ?? 50,
    width,
    lastMeasuredIndex: -1,
    column: columnIndex,
    gutter,
  }).current;

  const [, rerender] = useState(0);
  const getItemStyleCache = useRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    memoizeOne((_: number | MasonryItemSizeFunc) => ({} as Record<number, React.CSSProperties>))
  ).current;

  const getRangeToRender = (): [number, number, number, number] => {
    if (itemCount === 0) {
      return [0, 0, 0, 0];
    }

    const startIndex = getStartIndexForOffset(itemSize, itemCount, scrollOffset, instanceProps);
    const stopIndex = getStopIndexForStartIndex(itemSize, height, itemCount, startIndex, scrollOffset, instanceProps);
    const overscanBackward = !isScrolling && scrollDirection === 'backward' ? Math.max(1, overscanCount) : 0;
    const overscanForward = !isScrolling && scrollDirection === 'forward' ? Math.max(1, overscanCount) : 0;
    return [
      Math.max(0, startIndex - overscanBackward),
      Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
      startIndex,
      stopIndex,
    ];
  };

  const getItemStyle = (index: number): React.CSSProperties => {
    const itemStyleCache = getItemStyleCache(itemSize);
    if (!Object.prototype.hasOwnProperty.call(itemStyleCache, index)) {
      const offset = getItemOffset(itemSize, index, instanceProps);
      const size = getItemSize(index, instanceProps);
      itemStyleCache[index] = {
        position: 'absolute',
        left: gutter / 2,
        right: gutter / 2,
        top: offset,
        height: size,
        width: width - gutter,
      };
    }

    return itemStyleCache[index] ?? {};
  };

  // effect to clear cache
  useEffect(() => {
    instanceProps.gutter = gutter;
    instanceProps.column = columnIndex;
    instanceProps.width = width;
    instanceProps.lastMeasuredIndex = -1;
    getItemStyleCache(-1);
    rerender((i) => i + 1);
  }, [width, gutter, columnIndex, items]);

  // effect to scroll to item
  useEffect(() => {
    if (scrollToItem === null) {
      return;
    }

    const idx = items.findIndex((item) => item.id === scrollToItem);
    if (idx < 0) {
      return;
    }

    const itemStyle = getItemStyle(idx);
    const itemHeight = itemStyle.height ?? 0;
    const itemTop = itemStyle.top ?? 0;

    invariant(typeof itemTop === 'number', 'itemTop must be a number');
    invariant(typeof itemHeight === 'number', 'itemTop must be a number');

    const itemBottom = itemTop + itemHeight;
    const screenTop = scrollOffset;
    const screenBottom = screenTop + window.innerHeight - 110; // masonry is about 110px from top of screen
    const destination = Math.max(0, itemTop - (window.innerHeight - itemHeight) / 2);
    if (!(itemBottom < screenBottom && itemBottom > screenTop) && !(itemTop < screenBottom && itemTop > screenTop)) {
      scrollTo(destination);
    }
  }, [scrollToItem]);

  const previouslyIntersectingRef = useRef(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loadMoreRef] = useIntersectionObserverRef((entries) => {
    const entry = entries[0];
    if (entry && entry.isIntersecting !== isIntersecting) {
      setIsIntersecting(entry.isIntersecting);
    }
  });

  useEffect(() => {
    if (isIntersecting && !previouslyIntersectingRef.current && loadMore) {
      loadMore();
    }

    previouslyIntersectingRef.current = isIntersecting;
  }, [isIntersecting, loadMore]);

  const estimatedTotalSize = getEstimatedTotalSize(itemCount, instanceProps);
  const [startIndex, stopIndex] = getRangeToRender();

  const itemsToRender = [];
  if (itemCount > 0) {
    for (let index = startIndex; index <= stopIndex; index += 1) {
      const item = items[index];
      invariant(item, 'Item not found in items array');
      itemsToRender.push(
        createElement(children, {
          key: item.id,
          style: getItemStyle(index),
          isScrolling,
          item,
        })
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col relative will-change-transform"
      style={{
        width,
        height: estimatedTotalSize,
      }}
    >
      {itemsToRender}
      <div
        ref={loadMoreRef}
        className="absolute"
        style={{
          top: Math.max(0, estimatedTotalSize - 5),
          width: '100%',
          height: 5,
        }}
      />
    </div>
  );
}

export default memo(
  VirtualizedMasonryColumn,
  (prev, next) =>
    prev.id === next.id &&
    prev.items === next.items &&
    prev.width === next.width &&
    prev.scrollOffset === next.scrollOffset &&
    prev.scrollDirection === next.scrollDirection &&
    prev.isScrolling === next.isScrolling &&
    prev.overscanCount === next.overscanCount &&
    prev.estimatedItemSize === next.estimatedItemSize &&
    prev.gutter === next.gutter &&
    prev.scrollToItem === next.scrollToItem
);
