import { useState, useRef, useEffect, useMemo, useContext } from "react";
import List from "@mui/material/List";

import Section from "./Section";
import { TagsContext } from "./context";
import useDebounce from "../../hooks/useDebounce";

export type ScrollDirection = "forward" | "backward";
export type OnItemsRenderedParams = { startIndex: number; stopIndex: number };
export type OnScrollParams = { scrollDirection: ScrollDirection; scrollOffset: number };

const getRangeToRender = (
  scrollOffset: number,
  height: number,
  itemCount: number,
  scrollDirection: ScrollDirection,
  isScrolling: boolean,
  overscanCount: number
) => {
  const itemHeight = 48;
  const overscanBackward = !isScrolling || scrollDirection === "backward" ? Math.max(1, overscanCount) : 1;
  const overscanForward = !isScrolling || scrollDirection === "forward" ? Math.max(1, overscanCount) : 1;
  const startIndex = Math.max(0, Math.min(itemCount, Math.floor(scrollOffset / itemHeight) - overscanBackward));
  const offset = startIndex * itemHeight;
  const numVisibleItems = Math.ceil((height + scrollOffset - offset) / itemHeight);
  const endIndex = Math.max(0, Math.min(itemCount, startIndex + numVisibleItems + overscanForward));
  return [startIndex, endIndex];
};

export interface TagListInnerProps {
  width: number;
  height: number;
  overscanCount: number;
  initialScrollOffset?: number;
}

const TagListInner: React.FC<TagListInnerProps> = ({ width, height, overscanCount, initialScrollOffset }) => {
  // Virtualized stuffs
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("forward");
  const [scrollOffset, setScrollOffset] = useState<number>(initialScrollOffset ?? 0);
  const setIsScrollingDebounced = useDebounce(setIsScrolling);
  const outerRef = useRef<HTMLDivElement>(null);

  function onScrollVertical(event: React.SyntheticEvent) {
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

  // Effect to handle setting initial scroll offset
  useEffect(() => {
    if (typeof initialScrollOffset === "number" && outerRef.current != null) {
      outerRef.current.scrollTop = initialScrollOffset;
    }
  }, []);

  // Tag-related stuffs
  const tagSections = useContext(TagsContext);
  const tagSectionCounts = useMemo(() => Object.values(tagSections).map((sec) => sec.items.length), [tagSections]);

  // Calculate range of visible items
  const itemCount = tagSectionCounts.reduce((a, b) => a + b, 0) + tagSectionCounts.length;
  const [startIndex, stopIndex] = useMemo(
    () => getRangeToRender(scrollOffset, height, itemCount, scrollDirection, isScrolling, overscanCount),
    [scrollOffset, height, itemCount, scrollDirection, isScrolling, overscanCount]
  );

  let offset = 1;
  return (
    <List
      onScroll={onScrollVertical}
      sx={{
        width,
        height,
        position: "relative",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        willChange: "transform",
        padding: 0,
        transform: "translate3d(0,0,0)", // Enable GPU acceleration
      }}
    >
      {Object.keys(tagSections).map((sectionId, index) => {
        const count = tagSectionCounts[index];
        const start = Math.min(count, Math.max(0, startIndex - offset));
        const end = Math.min(count, Math.max(0, stopIndex - offset));
        offset += tagSectionCounts[index] + 1;

        return <Section key={sectionId} sectionId={sectionId} startIndex={start} stopIndex={end} />;
      })}
    </List>
  );
};

export default TagListInner;
