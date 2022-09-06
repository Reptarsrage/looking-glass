import { createElement, useEffect, useRef } from "react";
import memoizeOne from "memoize-one";

import {
  getEstimatedTotalSize,
  getItemOffset,
  getItemSize,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  MasonryInstanceProps,
  MasonryItemSizeFunc,
} from "./masonryUtils";
import type { Post } from "../../store/gallery";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

export interface MasonryItemProps<TItemData> {
  style: Record<string, any>;
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

export type ScrollDirection = "forward" | "backward";
export interface MasonryOnScrollParams {
  scrollDirection: ScrollDirection;
  scrollOffset: number;
}

export interface VirtualizedMasonryColumnProps<TItemData> {
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
  let clampWidth = maxWidth;
  let clampHeight = (height / width) * clampWidth;
  return { width: clampWidth, height: clampHeight };
}

function VirtualizedMasonryColumn({
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
}: VirtualizedMasonryColumnProps<Post>) {
  const columnIndex = id;
  const height = window.innerHeight;
  const itemCount = items.length;
  function itemSize(colIdx: number, idx: number) {
    const { height } = clampImageDimensions(items[idx].width, items[idx].height, width);

    return height;
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

  const getItemStyleCache = useRef(
    memoizeOne((itemSize: number | MasonryItemSizeFunc) => ({} as Record<number, React.CSSProperties>))
  ).current;

  const getRangeToRender = (): [number, number, number, number] => {
    if (itemCount === 0) {
      return [0, 0, 0, 0];
    }

    const startIndex = getStartIndexForOffset(itemSize, itemCount, scrollOffset, instanceProps);
    const stopIndex = getStopIndexForStartIndex(itemSize, height, itemCount, startIndex, scrollOffset, instanceProps);
    const overscanBackward = !isScrolling && scrollDirection === "backward" ? Math.max(1, overscanCount) : 0;
    const overscanForward = !isScrolling && scrollDirection === "forward" ? Math.max(1, overscanCount) : 0;
    return [
      Math.max(0, startIndex - overscanBackward),
      Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
      startIndex,
      stopIndex,
    ];
  };

  const getItemStyle = (index: number): Object => {
    const itemStyleCache = getItemStyleCache(itemSize);
    if (!itemStyleCache.hasOwnProperty(index)) {
      const offset = getItemOffset(itemSize, index, instanceProps);
      const size = getItemSize(index, instanceProps);
      itemStyleCache[index] = {
        position: "absolute",
        left: gutter / 2,
        right: gutter / 2,
        top: offset,
        height: size,
      };
    }

    return itemStyleCache[index];
  };

  // effect to clear cache
  useEffect(() => {
    // TODO: can i only run this when items is replaced (not added to?)
    instanceProps.gutter = gutter;
    instanceProps.column = columnIndex;
    instanceProps.width = width;
    instanceProps.lastMeasuredIndex = -1;
    getItemStyleCache(-1);
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
    const itemHeight = (itemStyle as any)?.height ?? 0;
    const itemTop = (itemStyle as any)?.top ?? 0;
    const itemBottom = itemTop + itemHeight;
    const screenTop = scrollOffset;
    const screenBottom = screenTop + window.innerHeight;
    const destination = Math.max(0, screenTop + (window.innerHeight - itemHeight) / 2);
    if (!(itemBottom < screenBottom && itemBottom > screenTop) && !(itemTop < screenBottom && itemTop > screenTop)) {
      scrollTo(destination);
    }
  }, [scrollToItem]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: loadMore,
  });

  const estimatedTotalSize = getEstimatedTotalSize(itemCount, instanceProps);
  const [startIndex, stopIndex] = getRangeToRender();

  const itemsToRender = [];
  if (itemCount > 0) {
    for (let index = startIndex; index <= stopIndex; index++) {
      itemsToRender.push(
        createElement(children, {
          key: items[index].id,
          style: getItemStyle(index),
          isScrolling,
          item: items[index],
        })
      );
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width,
        height: estimatedTotalSize,
      }}
    >
      {itemsToRender}
      <div
        ref={loadMoreRef}
        style={{
          position: "absolute",
          top: Math.max(0, estimatedTotalSize - 5),
          width: "100%",
          height: 5,
        }}
      ></div>
    </div>
  );
}

export default VirtualizedMasonryColumn;
