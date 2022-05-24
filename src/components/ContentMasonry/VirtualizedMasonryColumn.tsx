import { createElement, useContext, useEffect, useRef } from "react";
import memoizeOne from "memoize-one";

import {
  getEstimatedTotalSize,
  getItemOffset,
  getItemSize,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  MasonryInstanceProps,
  MasonryItemSizeFunc,
  getOffsetForIndexAndAlignment,
} from "./masonryUtils";
import { useMasonryStore } from "../../store/masonry";
import { MasonryContext } from "./context";

export interface MasonryItemProps<TItemData> {
  columnIndex: number;
  index: number;
  style: Record<string, any>;
  isScrolling?: boolean;
  data?: TItemData;
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
  itemSize: MasonryItemSizeFunc;
  itemData?: TItemData;
  width: number;
  height: number;
  overscanCount: number;
  estimatedItemSize?: number;
  initialScrollOffset?: number;
  onItemsRendered?: (params: MasonryOnItemsRenderedParams) => void;
  onScroll?: (params: MasonryOnScrollParams) => void;
  scrollOffset: number;
  isScrolling: boolean;
  scrollDirection: ScrollDirection;
  columnIndex: number;
  gutter: number;
}

function VirtualizedMasonryColumn<TItemData>({
  children,
  itemSize,
  width,
  height,
  overscanCount,
  estimatedItemSize,
  onItemsRendered,
  isScrolling,
  scrollDirection,
  scrollOffset,
  columnIndex,
  itemData,
  gutter,
}: VirtualizedMasonryColumnProps<TItemData>) {
  const columns = useContext(MasonryContext);
  const column = columns[columnIndex];
  const itemCount = column.items.length;
  const setMasonryScrollOffset = useMasonryStore((state) => state.setMasonryScrollOffset);
  const masonryScrollToItemId = useMasonryStore((state) => state.masonryScrollToItemId);
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
    const overscanBackward = !isScrolling || scrollDirection === "backward" ? Math.max(1, overscanCount) : 1;
    const overscanForward = !isScrolling || scrollDirection === "forward" ? Math.max(1, overscanCount) : 1;
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
        left: 0,
        right: undefined,
        top: offset,
        height: size,
        width: "100%",
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2,
      };
    }

    return itemStyleCache[index];
  };

  useEffect(() => {
    if (width !== instanceProps.width || columnIndex !== instanceProps.column || gutter !== instanceProps.gutter) {
      // reset all cached sizes
      instanceProps.gutter = gutter;
      instanceProps.column = columnIndex;
      instanceProps.width = width;
      instanceProps.lastMeasuredIndex = -1;
      getItemStyleCache(-1);
    }
  }, [width, gutter, columnIndex]);

  const estimatedTotalSize = getEstimatedTotalSize(itemCount, instanceProps);
  const [startIndex, stopIndex] = getRangeToRender();

  useEffect(() => {
    if (typeof onItemsRendered === "function") {
      if (itemCount > 0) {
        const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex] = getRangeToRender();
        onItemsRendered({
          column: columnIndex,
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex,
        });
      }
    }
  }, [onItemsRendered, startIndex, stopIndex]);

  function scrollToItem(index: number) {
    index = Math.max(0, Math.min(index, itemCount - 1));
    setMasonryScrollOffset(
      getOffsetForIndexAndAlignment(itemSize, itemCount, index, scrollOffset, height, instanceProps)
    );
  }

  useEffect(() => {
    if (masonryScrollToItemId) {
      const idx = column.items.findIndex((i) => i.id === masonryScrollToItemId);
      if (idx >= 0) {
        scrollToItem(idx);
      }
    }
  }, [masonryScrollToItemId]);

  const items = [];
  if (itemCount > 0) {
    for (let index = startIndex; index <= stopIndex; index++) {
      items.push(
        createElement<MasonryItemProps<TItemData>>(children, {
          key: index,
          columnIndex,
          index,
          isScrolling,
          style: getItemStyle(index),
          data: itemData,
        })
      );
    }
  }

  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        height: estimatedTotalSize,
        pointerEvents: isScrolling ? "none" : undefined,
        width: width,
        position: "relative",
      }}
    >
      {items}
    </ul>
  );
}

VirtualizedMasonryColumn.defaultProps = {
  gutter: 8,
};

export default VirtualizedMasonryColumn;
