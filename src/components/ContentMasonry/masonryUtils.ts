export type MasonryItemSizeFunc = (columnIndex: number, rowIndex: number) => number;

export interface MasonryInstanceProps {
  itemMetadataMap: Record<number, MasonryItemMetadata>;
  estimatedItemSize: number;
  lastMeasuredIndex: number;
  width: number;
  column: number;
  gutter: number;
}

export type MasonryItemMetadata = {
  offset: number;
  size: number;
};

export function getOffsetForIndexAndAlignment(
  itemSize: MasonryItemSizeFunc,
  itemCount: number,
  index: number,
  scrollOffset: number,
  height: number,
  instanceProps: MasonryInstanceProps
): number {
  const itemMetadata = getItemMetadata(itemSize, index, instanceProps);
  const estimatedTotalSize = getEstimatedTotalSize(itemCount, instanceProps);
  const maxOffset = Math.max(0, Math.min(estimatedTotalSize - height, itemMetadata.offset));
  const minOffset = Math.max(0, itemMetadata.offset - height + itemMetadata.size);

  if (scrollOffset >= minOffset - height && scrollOffset <= maxOffset + height) {
    if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
      return scrollOffset;
    } else if (scrollOffset < minOffset) {
      return minOffset;
    } else {
      return maxOffset;
    }
  }

  return Math.round(minOffset + (maxOffset - minOffset) / 2);
}

export const getEstimatedTotalSize = (itemCount: number, instanceProps: MasonryInstanceProps) => {
  let { itemMetadataMap, estimatedItemSize, lastMeasuredIndex } = instanceProps;
  let totalSizeOfMeasuredItems = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredIndex >= itemCount) {
    lastMeasuredIndex = itemCount - 1;
  }

  if (lastMeasuredIndex >= 0) {
    const itemMetadata = itemMetadataMap[lastMeasuredIndex];
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = itemCount - lastMeasuredIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize;

  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};

export const getItemOffset = (itemSize: MasonryItemSizeFunc, index: number, instanceProps: MasonryInstanceProps) =>
  getItemMetadata(itemSize, index, instanceProps).offset;

export const getItemSize = (index: number, instanceProps: MasonryInstanceProps) =>
  instanceProps.itemMetadataMap[index].size;

export const getStartIndexForOffset = (
  itemSize: MasonryItemSizeFunc,
  itemCount: number,
  offset: number,
  instanceProps: MasonryInstanceProps
) => findNearestItem(itemSize, itemCount, offset, instanceProps);

export const getStopIndexForStartIndex = (
  itemSize: MasonryItemSizeFunc,
  height: number,
  itemCount: number,
  startIndex: number,
  scrollOffset: number,
  instanceProps: MasonryInstanceProps
) => {
  const itemMetadata = getItemMetadata(itemSize, startIndex, instanceProps);
  const maxOffset = scrollOffset + height;

  let offset = itemMetadata.offset + itemMetadata.size;
  let stopIndex = startIndex;

  while (stopIndex < itemCount - 1 && offset < maxOffset) {
    stopIndex++;
    offset += getItemMetadata(itemSize, stopIndex, instanceProps).size;
  }

  return stopIndex;
};

const getItemMetadata = (
  itemSize: MasonryItemSizeFunc,
  index: number,
  instanceProps: MasonryInstanceProps
): MasonryItemMetadata => {
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;

  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = itemSize(instanceProps.column, i);
      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    instanceProps.lastMeasuredIndex = index;
  }

  return itemMetadataMap[index];
};

const findNearestItem = (
  itemSize: MasonryItemSizeFunc,
  itemCount: number,
  offset: number,
  instanceProps: MasonryInstanceProps
) => {
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  const lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredItemOffset >= offset) {
    // If we've already measured items within this range just use a binary search as it's faster.
    return findNearestItemBinarySearch(itemSize, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestItemExponentialSearch(itemSize, itemCount, instanceProps, Math.max(0, lastMeasuredIndex), offset);
  }
};

const findNearestItemBinarySearch = (
  itemSize: MasonryItemSizeFunc,
  instanceProps: MasonryInstanceProps,
  high: number,
  low: number,
  offset: number
): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata(itemSize, middle, instanceProps).offset;

    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

const findNearestItemExponentialSearch = (
  itemSize: MasonryItemSizeFunc,
  itemCount: number,
  instanceProps: MasonryInstanceProps,
  index: number,
  offset: number
): number => {
  let interval = 1;
  while (index < itemCount && getItemMetadata(itemSize, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }

  return findNearestItemBinarySearch(
    itemSize,
    instanceProps,
    Math.min(index, itemCount - 1),
    Math.floor(index / 2),
    offset
  );
};
