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
  isMin: boolean;
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

  // Effect to keep track of scroll position as window scrolls
  useEffect(() => {
    function onScroll() {
      const { scrollY } = window;
      const { offsetTop = 0 } = containerRef.current ?? {};
      const newScrollOffset = Math.max(0, scrollY - offsetTop);
      const newScrolDirection = scrollOffset < newScrollOffset ? "forward" : "backward";

      setScrollDirection(newScrolDirection);
      setScrollOffset(newScrollOffset);
      setIsScrolling(true);

      setIsScrollingDebounced(false);
    }

    // use window scroll!
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  // calculate columns
  const columns = useMemo(() => {
    const initial: Column[] = [...Array(columnCount).keys()].map((id) => ({
      id,
      height: 0,
      items: [],
      isMin: false,
    }));

    const columns = items.reduce((acc, cur) => {
      // balance column heights
      let min = Math.min(...acc.map((col) => col.height));
      let minCol = acc.find((col) => col.height === min) ?? acc[0];
      minCol.items.push(cur);
      minCol.height += cur.height;

      return acc;
    }, initial);

    const minHeight = Math.min(...columns.map((c) => c.height));
    const minCol = columns.findIndex((c) => c.height === minHeight);
    columns[minCol].isMin = true;

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
          loadMore={column.isMin ? loadMore : undefined}
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
