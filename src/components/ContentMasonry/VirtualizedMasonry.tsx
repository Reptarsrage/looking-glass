import { useEffect, useRef, useState, useMemo, memo } from "react";

import VirtualizedMasonryColumn, { MasonryItemProps, ScrollDirection } from "./VirtualizedMasonryColumn";
import useSize from "../../hooks/useSize";
import type { Post } from "../../store/gallery";
import useDebounce from "../../hooks/useDebounce";

interface VirtualizedMasonryProps<TItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  items: TItemData[];
  loadMore: () => void;
  scrollToItem: string | null;
}

interface Column {
  id: number;
  height: number;
  items: Post[];
}

function VirtualizedMasonry({ children, items, loadMore, scrollToItem }: VirtualizedMasonryProps<Post>) {
  // constants
  const columnCount = 3;
  const gutter = 6;
  const overscanCount = 1;
  const estimatedItemSize = 500;

  // keep track of size
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(containerRef);

  // keep track of scroll
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("forward");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const setIsScrollingDebounced = useDebounce(setIsScrolling);

  // Effect to keep track of scroll position as document body scrolls
  useEffect(() => {
    function onScroll() {
      const scrollY = document.body.scrollTop;
      const offsetTop = containerRef.current?.offsetTop ?? 0;
      const newScrollOffset = Math.max(0, scrollY - offsetTop);
      const newScrolDirection = scrollOffset < newScrollOffset ? "forward" : "backward";

      setScrollDirection(newScrolDirection);
      setScrollOffset(newScrollOffset);
      setIsScrolling(true);

      setIsScrollingDebounced(false);
    }

    // use document body scroll!
    document.body.addEventListener("scroll", onScroll);
    return () => {
      document.body.removeEventListener("scroll", onScroll);
    };
  });

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
        height: "100%",
        display: "flex",
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2,
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
        >
          {children}
        </VirtualizedMasonryColumn>
      ))}
    </div>
  );
}

export default memo(
  VirtualizedMasonry,
  (prev, next) =>
    prev.items === next.items && prev.loadMore === next.loadMore && prev.scrollToItem === next.scrollToItem
);
