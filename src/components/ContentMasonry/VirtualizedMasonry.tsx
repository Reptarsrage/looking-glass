import { useEffect, useRef, useState, useMemo, memo, useLayoutEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import VirtualizedMasonryColumn, { MasonryItemProps, ScrollDirection } from "./VirtualizedMasonryColumn";
import useSize from "../../hooks/useSize";
import type { Post } from "../../store/gallery";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../Status/Loading";
import TheEnd from "../Status/TheEnd";
import { SettingsContext } from "../../store/settings";

interface VirtualizedMasonryProps<TItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  items: TItemData[];
  loadMore: () => void;
  scrollToItem: string | null;
  isLoading: boolean;
  isEnd: boolean;
}

interface Column {
  id: number;
  height: number;
  items: Post[];
}

function VirtualizedMasonry({
  children,
  items,
  loadMore,
  scrollToItem,
  isLoading,
  isEnd,
}: VirtualizedMasonryProps<Post>) {
  const { settings } = useContext(SettingsContext);
  const columnCount = settings.masonryColumnCount;

  // constants
  const gutter = 6;
  const overscanCount = 1;
  const estimatedItemSize = 500;

  // keep track of size
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(containerRef);

  // keep track of scroll
  const location = useLocation();
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("forward");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const setIsScrollingDebounced = useDebounce(setIsScrolling);

  // Restore scroll based on location
  useLayoutEffect(() => {
    const key = `scroll/${location.key}`;
    const old = sessionStorage.getItem(key);
    if (containerRef.current !== null && old !== null) {
      containerRef.current.scrollTo(0, parseInt(old, 10));
    }
  }, []);

  // Effect to keep track of scroll position as document body scrolls
  useEffect(() => {
    function onScroll() {
      const scrollY = containerRef.current?.scrollTop ?? 0;
      const offsetTop = containerRef.current?.offsetTop ?? 0;
      const newScrollOffset = Math.max(0, scrollY - offsetTop);
      const newScrolDirection = scrollOffset < newScrollOffset ? "forward" : "backward";

      setScrollDirection(newScrolDirection);
      setScrollOffset(newScrollOffset);
      setIsScrolling(true);

      const key = `scroll/${location.key}`;
      sessionStorage.setItem(key, newScrollOffset.toString());

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
    const initial: Column[] = [...Array(columnCount).keys()].map((id) => ({
      id,
      height: 0,
      items: [],
    }));

    const columns = items.reduce((acc, cur, index) => {
      acc[index % columnCount].items.push(cur);
      acc[index % columnCount].height += cur.height;
      return acc;
    }, initial);

    return columns;
  }, [items]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2,
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: "1",
        }}
      >
        {columns.map((column) => (
          <VirtualizedMasonryColumn
            key={column.id}
            width={width / columnCount}
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
