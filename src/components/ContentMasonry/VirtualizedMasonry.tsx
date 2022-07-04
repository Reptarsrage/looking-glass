import { useLayoutEffect, useEffect, useRef, useState, useContext } from "react";
import Box from "@mui/material/Box";

import { MasonryItemSizeFunc } from "./masonryUtils";
import VirtualizedMasonryColumn, {
  MasonryItemProps,
  MasonryOnItemsRenderedParams,
  MasonryOnScrollParams,
  ScrollDirection,
} from "./VirtualizedMasonryColumn";
import { useMasonryStore } from "../../store/masonry";
import useDebounce from "../../hooks/useDebounce";
import { MasonryContext } from "./context";
import TheEnd from "../Status/TheEnd";

export interface VirtualizedMasonryProps<TItemData> {
  children: React.FunctionComponent<MasonryItemProps<TItemData>>;
  itemSize: MasonryItemSizeFunc;
  itemData?: TItemData;
  width: number;
  height: number;
  overscanCount: number;
  estimatedItemSize?: number;
  initialScrollOffset?: number;
  gutter: number;
  end: boolean;
  onItemsRendered?: (params: MasonryOnItemsRenderedParams) => void;
  onScroll?: (params: MasonryOnScrollParams) => void;
}

function VirtualizedMasonry<TItemData>({
  children,
  onItemsRendered,
  onScroll,
  width,
  height,
  estimatedItemSize,
  overscanCount,
  itemSize,
  itemData,
  gutter,
  end,
  initialScrollOffset,
}: VirtualizedMasonryProps<TItemData>) {
  const columns = useContext(MasonryContext);
  const masonryScrollOffset = useMasonryStore((state) => state.masonryScrollOffset);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("forward");
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const prevWidthRef = useRef<number>(width);
  const outerRef = useRef<HTMLDivElement>(null);
  const setIsScrollingDebounced = useDebounce(setIsScrolling);

  function onScrollVertical(event: React.SyntheticEvent<HTMLDivElement>) {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollOffset === scrollTop) {
      return;
    }

    const nextScrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));

    setIsScrolling(true);
    setScrollDirection(scrollOffset < nextScrollOffset ? "forward" : "backward");
    setScrollOffset(nextScrollOffset);

    setIsScrollingDebounced(false);
  }

  function scrollTo(newScrollOffset: number) {
    newScrollOffset = Math.max(0, newScrollOffset);
    if (newScrollOffset !== scrollOffset && outerRef.current != null) {
      outerRef.current.scrollTop = newScrollOffset;
    }
  }

  useEffect(() => {
    if (Math.abs(masonryScrollOffset - scrollOffset) > 5) {
      scrollTo(masonryScrollOffset);
    }
  }, [masonryScrollOffset]);

  // Effect to handle restoring scroll from cache
  useEffect(() => {
    if (outerRef.current != null && initialScrollOffset !== undefined) {
      outerRef.current.scrollTop = initialScrollOffset;
      setScrollOffset(initialScrollOffset);
    }
  }, [initialScrollOffset]);

  // Effect to invoke on scroll callback
  useEffect(() => {
    if (typeof onScroll === "function") {
      onScroll({ scrollDirection, scrollOffset });
    }
  }, [onScroll, scrollDirection, scrollOffset]);

  // Effect to adjust things when width changes
  useLayoutEffect(() => {
    if (width !== prevWidthRef.current) {
      // maintain scroll ratio
      if (outerRef.current) {
        const scrollRatio = outerRef.current.scrollTop / outerRef.current.scrollHeight;
        const heightRatio = outerRef.current.scrollHeight / prevWidthRef.current;
        outerRef.current.scrollTop = scrollRatio * heightRatio * width;
        setScrollOffset(scrollRatio * heightRatio * width);
      }

      prevWidthRef.current = width;
    }
  }, [width, height]);

  const scrollBarWidth = 17;
  return (
    <div
      onScroll={onScrollVertical}
      ref={outerRef}
      style={{
        height: height,
        width: width,
        overflow: "auto",
        transform: "translate3d(0,0,0)", // Enable GPU acceleration
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        {columns.map((column, columnIndex) => (
          <VirtualizedMasonryColumn
            key={column.id}
            itemSize={itemSize}
            itemData={itemData}
            width={(width - scrollBarWidth - gutter) / columns.length}
            height={height}
            gutter={gutter}
            overscanCount={overscanCount}
            estimatedItemSize={estimatedItemSize}
            onItemsRendered={onItemsRendered}
            isScrolling={isScrolling}
            scrollDirection={scrollDirection}
            scrollOffset={scrollOffset}
            columnIndex={columnIndex}
          >
            {children}
          </VirtualizedMasonryColumn>
        ))}
      </div>

      <Box sx={{ mb: 4 }}>{end && <TheEnd />}</Box>
    </div>
  );
}

VirtualizedMasonry.defaultProps = {
  gutter: 8,
};

export default VirtualizedMasonry;
