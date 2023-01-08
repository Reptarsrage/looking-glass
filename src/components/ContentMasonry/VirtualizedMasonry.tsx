import { useDebounceCallback } from '@react-hook/debounce';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

import VirtualizedMasonryColumn from './VirtualizedMasonryColumn';
import type { MasonryItemProps, RequiredItemData, ScrollDirection } from './VirtualizedMasonryColumn';

interface VirtualizedMasonryProps<TItemData extends RequiredItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  items: TItemData[];
  loadMore: () => void;
  scrollToItem: string | null;
  locationKey: string;
  isTransitioning: boolean;
  size: DOMRect | undefined;
  LoadingIndicator: React.ReactNode;
  EndIndicator: React.ReactNode;
  isLoading: boolean;
  isEnd: boolean;
}

interface Column<TItemData> {
  id: number;
  items: TItemData[];
}

interface SavedScroll {
  scroll: number;
  height: number;
}

declare global {
  interface Window {
    scrollStorage?: Record<string, SavedScroll>;
  }
}

function saveScroll(locationKey: string, scroll: number, height: number) {
  window.scrollStorage = window.scrollStorage ?? {};
  window.scrollStorage[locationKey] = { scroll, height };
}

function loadScroll(locationKey: string): SavedScroll {
  if (window.scrollStorage && locationKey in window.scrollStorage) {
    const cached = window.scrollStorage[locationKey];
    invariant(cached, 'Scroll storage should be defined');
    return cached;
  }

  return { scroll: 0, height: 0 };
}

function VirtualizedMasonry<TItemData extends RequiredItemData>({
  children,
  items,
  loadMore,
  scrollToItem,
  locationKey,
  isTransitioning,
  size,
  isLoading,
  isEnd,
  LoadingIndicator,
  EndIndicator,
}: VirtualizedMasonryProps<TItemData>) {
  const columnCount = 5;

  // constants
  const gutter = 6;
  const overscanCount = 1;
  const estimatedItemSize = 500;

  // keep track of scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useMemo(() => loadScroll(locationKey), [locationKey]);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('forward');
  const [scrollOffset, setScrollOffset] = useState(loaded.scroll);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const setIsScrollingDebounced = useDebounceCallback(setIsScrolling, 100, false);

  // Restore scroll based on location
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = loaded.scroll;
    }
  }, [loaded]);

  function onScroll() {
    const scrollY = containerRef.current?.scrollTop ?? 0;
    const offsetTop = containerRef.current?.offsetTop ?? 0;
    const scrollHeight = containerRef.current?.scrollHeight ?? 0;
    const newScrollOffset = Math.max(0, scrollY - offsetTop);
    const newScrolDirection = scrollOffset < newScrollOffset ? 'forward' : 'backward';

    if (newScrollOffset !== scrollOffset) {
      setScrollDirection(newScrolDirection);
      setScrollOffset(newScrollOffset);
      setIsScrolling(true);

      if (!isTransitioning) {
        saveScroll(locationKey, newScrollOffset, scrollHeight);
      }

      setIsScrollingDebounced(false);
    }
  }

  // calculate columns
  const columns = useMemo(() => {
    const initial: Column<TItemData>[] = [...Array(columnCount).keys()].map((id) => ({
      id,
      items: [],
    }));

    return items.reduce((acc, cur, index) => {
      const column = acc[index % columnCount];
      invariant(column, 'Column should be defined');
      column.items.push(cur);
      return acc;
    }, initial);
  }, [items]);

  return (
    <div className="flex flex-1 flex-col relative">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex flex-col overflow-auto w-full h-full top-0 left-0 absolute"
        style={{
          paddingLeft: gutter / 2,
          paddingRight: gutter / 2,
        }}
      >
        {size && size.width > 0 ? (
          <div className="flex flex-1">
            {columns.map((column) => (
              <VirtualizedMasonryColumn
                key={column.id}
                width={(size.width - gutter - 17) / columnCount}
                id={column.id}
                items={column.items}
                gutter={gutter}
                scrollDirection={scrollDirection}
                scrollOffset={scrollOffset}
                isScrolling={isScrolling}
                overscanCount={overscanCount}
                estimatedItemSize={estimatedItemSize}
                scrollToItem={scrollToItem}
                loadMore={loadMore}
                scrollTo={(y: number) => containerRef.current?.scrollTo(0, y)}
              >
                {children as React.FunctionComponent<MasonryItemProps<RequiredItemData>>}
              </VirtualizedMasonryColumn>
            ))}
          </div>
        ) : (
          <div style={{ minHeight: loaded.height }} />
        )}
        <div className="flex justify-center items-center mt-8 mb-16">
          {isLoading && LoadingIndicator}
          {isEnd && EndIndicator}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedMasonry;
