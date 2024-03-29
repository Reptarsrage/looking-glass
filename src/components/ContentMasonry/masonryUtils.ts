import invariant from 'tiny-invariant';

export type MasonryItemSizeFunc = (index: number) => number;

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

const getItemMetadata = (
  itemSize: MasonryItemSizeFunc,
  index: number,
  instanceProps: MasonryInstanceProps
): MasonryItemMetadata => {
  const { itemMetadataMap, lastMeasuredIndex, gutter } = instanceProps;

  if (index > lastMeasuredIndex) {
    let offset = gutter;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      invariant(itemMetadata, 'Item metadata should not be null');
      offset = itemMetadata.offset + itemMetadata.size + gutter;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i += 1) {
      const size = itemSize(i);
      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size + gutter;
    }

    instanceProps.lastMeasuredIndex = index;
  }

  const meta = itemMetadataMap[index];
  invariant(meta, 'Item metadata should not be null');
  return meta;
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
    }
    if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  }
  return 0;
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

const findNearestItem = (
  itemSize: MasonryItemSizeFunc,
  itemCount: number,
  offset: number,
  instanceProps: MasonryInstanceProps
) => {
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  const meta = itemMetadataMap[lastMeasuredIndex];
  const lastMeasuredItemOffset = meta && lastMeasuredIndex > 0 ? meta.offset : 0;

  if (lastMeasuredItemOffset >= offset) {
    return findNearestItemBinarySearch(itemSize, instanceProps, lastMeasuredIndex, 0, offset);
  }

  return findNearestItemExponentialSearch(itemSize, itemCount, instanceProps, Math.max(0, lastMeasuredIndex), offset);
};

export const getEstimatedTotalSize = (itemCount: number, instanceProps: MasonryInstanceProps) => {
  let { itemMetadataMap, estimatedItemSize, lastMeasuredIndex } = instanceProps;
  let totalSizeOfMeasuredItems = instanceProps.gutter;

  if (lastMeasuredIndex >= itemCount) {
    lastMeasuredIndex = itemCount - 1;
  }

  if (lastMeasuredIndex >= 0) {
    const itemMetadata = itemMetadataMap[lastMeasuredIndex];
    invariant(itemMetadata, 'Item metadata should not be null');
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = itemCount - lastMeasuredIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * (estimatedItemSize + instanceProps.gutter);

  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems + instanceProps.gutter;
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
    }

    if (scrollOffset < minOffset) {
      return minOffset;
    }

    return maxOffset;
  }

  return Math.round(minOffset + (maxOffset - minOffset) / 2);
}

export const getItemOffset = (itemSize: MasonryItemSizeFunc, index: number, instanceProps: MasonryInstanceProps) =>
  getItemMetadata(itemSize, index, instanceProps).offset;

export const getItemSize = (index: number, instanceProps: MasonryInstanceProps) => {
  const itemMetadata = instanceProps.itemMetadataMap[index];
  invariant(itemMetadata, 'Item metadata should not be null');
  return itemMetadata.size;
};

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
  const { gutter } = instanceProps;
  const itemMetadata = getItemMetadata(itemSize, startIndex, instanceProps);
  const maxOffset = scrollOffset + height;

  let offset = itemMetadata.offset + itemMetadata.size + gutter;
  let stopIndex = startIndex;

  while (stopIndex < itemCount - 1 && offset < maxOffset) {
    stopIndex += 1;
    offset += getItemMetadata(itemSize, stopIndex, instanceProps).size + gutter;
  }

  return stopIndex;
};
