import { useDebounceCallback } from '@react-hook/debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import useSize from '../../hooks/useSize';

import FilterSection, { FilterSectionProps } from './FilterSection';

export interface FilterListProps {
  filters: FilterSectionProps[];
  itemCount: number;
  focusOnIndex: number | null;
  onItemFocused: (index: number) => void;
}

export type ScrollDirection = 'forward' | 'backward';

const ItemHeight = 32;
const Overscan = 2;

/**
 * Calculates range to render across all sections
 */
const getRangeToRender = (
  scrollOffset: number,
  size: DOMRect | undefined,
  itemCount: number,
  scrollDirection: ScrollDirection,
  isScrolling: boolean
): [number, number] => {
  if (!size || itemCount === 0) {
    return [0, 0];
  }

  const overscanBackward = !isScrolling || scrollDirection === 'backward' ? Math.max(1, Overscan) : 1;
  const overscanForward = !isScrolling || scrollDirection === 'forward' ? Math.max(1, Overscan) : 1;
  const startIndex = Math.max(0, Math.min(itemCount, Math.floor(scrollOffset / ItemHeight) - overscanBackward));
  const offset = startIndex * ItemHeight;
  const numVisibleItems = Math.ceil((size.height + scrollOffset - offset) / ItemHeight);
  const endIndex = Math.max(0, Math.min(itemCount, startIndex + numVisibleItems + overscanForward));

  return [startIndex, endIndex];
};

function FilterList({ filters, focusOnIndex, itemCount, onItemFocused }: FilterListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('forward');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const setIsScrollingDebounced = useDebounceCallback(setIsScrolling, 100, false);

  /**
   * When scroll happens, update our virtualized position
   */
  function onScroll(event: React.SyntheticEvent) {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollOffset === scrollTop) {
      return;
    }

    const nextScrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));

    setIsScrolling(true);
    setScrollDirection(scrollOffset < nextScrollOffset ? 'forward' : 'backward');
    setScrollOffset(nextScrollOffset);

    setIsScrollingDebounced(false);
  }

  // Calculate range of visible items based on size and virtualized position
  const [startIndex, stopIndex] = useMemo(
    () => getRangeToRender(scrollOffset, size, itemCount, scrollDirection, isScrolling),
    [scrollOffset, size, itemCount, scrollDirection, isScrolling]
  );

  // Effect to scroll to focused item
  useEffect(() => {
    if (focusOnIndex !== null && scrollRef.current) {
      const buffer = 2;
      if (focusOnIndex - Overscan - buffer <= startIndex || focusOnIndex + Overscan + buffer >= stopIndex) {
        const offset = (focusOnIndex + 1) * ItemHeight; // top of item
        scrollRef.current.scrollTo(0, offset - (size?.height ?? 0) / 2); // center item
      }
    }
  }, [focusOnIndex]);

  return (
    <div ref={containerRef} className="flex flex-1 relative will-change-transform">
      <div ref={scrollRef} className="top-0 left-0 w-full h-full absolute overflow-auto" onScroll={onScroll}>
        <ul className="relative" style={{ height: itemCount * ItemHeight }}>
          {filters.map((result, index) => (
            <FilterSection
              key={result.filterType.id}
              startIndex={startIndex}
              stopIndex={stopIndex}
              focusOnIndex={focusOnIndex}
              onItemFocused={onItemFocused}
              index={index}
              {...result}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterList;
