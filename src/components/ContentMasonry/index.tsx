import React, { memo } from 'react';

import type { Post } from '../../types';
import EndIndicator from '../EndIndicator';
import LoadingIndicator from '../LoadingIndicator';
import MasonryItem from '../MasonryItem';

import VirtualizedMasonry from './VirtualizedMasonry';

interface ContentMasonryProps {
  items: Post[];
  loadMore: () => void;
  locationKey: string;
  isTransitioning: boolean;
  scrollToItem: string | null;
  size: DOMRect | undefined;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
}

function ContentMasonry({
  size,
  items,
  loadMore,
  locationKey,
  isTransitioning,
  scrollToItem,
  isLoading,
  hasNextPage,
}: ContentMasonryProps) {
  return (
    <div className="flex flex-1 flex-col">
      <VirtualizedMasonry
        items={items}
        loadMore={loadMore}
        locationKey={locationKey}
        isTransitioning={isTransitioning}
        scrollToItem={scrollToItem}
        size={size}
        isLoading={isLoading}
        isEnd={!hasNextPage}
        LoadingIndicator={<LoadingIndicator size={80} />}
        EndIndicator={<EndIndicator />}
      >
        {MasonryItem}
      </VirtualizedMasonry>
    </div>
  );
}

export default memo(ContentMasonry, (prev, next) => {
  // If masonry is transitioning away, don't update
  if (next.isTransitioning) {
    return true;
  }

  // Otherwise, update as normal
  return (
    prev.items === next.items &&
    prev.locationKey === next.locationKey &&
    prev.isTransitioning === next.isTransitioning &&
    prev.size === next.size &&
    prev.scrollToItem === next.scrollToItem &&
    prev.loadMore === next.loadMore &&
    prev.isLoading === next.isLoading &&
    prev.hasNextPage === next.hasNextPage
  );
});
