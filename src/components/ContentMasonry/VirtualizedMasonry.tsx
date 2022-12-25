import { useEffect, useRef, useState, useMemo, memo, useLayoutEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDebounceCallback } from "@react-hook/debounce";

import VirtualizedMasonryColumn from "./VirtualizedMasonryColumn";
import type { MasonryItemProps, ScrollDirection, RequiredItemData } from "./VirtualizedMasonryColumn";
import useSize from "../../hooks/useSize";
import Loading from "../Status/Loading";
import TheEnd from "../Status/TheEnd";
import { SettingsContext } from "../../store/settings";

interface VirtualizedMasonryProps<TItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  items: TItemData[];
  loadMore: () => void;
  scrollToItem: string | null;
  isLoading: boolean;
  isTranitioning: boolean;
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
    return window.scrollStorage[locationKey];
  }

  return { scroll: 0, height: 0 };
}

function VirtualizedMasonry<TItemData extends RequiredItemData>({
  children,
  items,
  loadMore,
  scrollToItem,
  isLoading,
  isTranitioning,
  isEnd,
}: VirtualizedMasonryProps<TItemData>) {
  const { settings } = useContext(SettingsContext);
  const columnCount = settings.masonryColumnCount;

  // constants
  const gutter = 6;
  const overscanCount = 1;
  const estimatedItemSize = 500;

  // keep track of size
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  // keep track of scroll
  const location = useLocation();
  const loaded = useMemo(() => loadScroll(location.key), [location]);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("forward");
  const [scrollOffset, setScrollOffset] = useState(loaded.scroll);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const setIsScrollingDebounced = useDebounceCallback(setIsScrolling, 100, false);

  // Restore scroll based on location
  useLayoutEffect(() => {
    containerRef.current!.scrollTop = loaded.scroll;
  }, []);

  // Effect to keep track of scroll position as document body scrolls
  useEffect(() => {
    function onScroll() {
      const scrollY = containerRef.current?.scrollTop ?? 0;
      const offsetTop = containerRef.current?.offsetTop ?? 0;
      const scrollHeight = containerRef.current?.scrollHeight ?? 0;
      const newScrollOffset = Math.max(0, scrollY - offsetTop);
      const newScrolDirection = scrollOffset < newScrollOffset ? "forward" : "backward";

      setScrollDirection(newScrolDirection);
      setScrollOffset(newScrollOffset);
      setIsScrolling(true);

      const key = `scroll/${location.key}`;
      sessionStorage.setItem(key, newScrollOffset.toString());

      if (!isTranitioning) {
        saveScroll(location.key, newScrollOffset, scrollHeight);
      }

      setIsScrollingDebounced(false);
    }

    const elt = containerRef.current;
    if (elt) {
      elt.addEventListener("scroll", onScroll);
      return () => {
        elt.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  // calculate columns
  const columns = useMemo(() => {
    const initial: Column<TItemData>[] = [...Array(columnCount).keys()].map((id) => ({
      id,
      items: [],
    }));

    const columns = items.reduce((acc, cur, index) => {
      acc[index % columnCount].items.push(cur);
      return acc;
    }, initial);

    return columns;
  }, [items]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2,
        overflow: "auto",
      }}
    >
      {size && size.width > 0 ? (
        <div
          style={{
            display: "flex",
            flex: "1",
          }}
        >
          {columns.map((column) => (
            <VirtualizedMasonryColumn
              key={column.id}
              width={size.width / columnCount}
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
              {children}
            </VirtualizedMasonryColumn>
          ))}
        </div>
      ) : (
        <div style={{ minHeight: loaded.height }} />
      )}

      {isLoading && <Loading />}

      {isEnd && <TheEnd />}
    </div>
  );
}

export default memo(
  VirtualizedMasonry,
  (prev, next) =>
    prev.items === next.items && prev.loadMore === next.loadMore && prev.scrollToItem === next.scrollToItem
);
