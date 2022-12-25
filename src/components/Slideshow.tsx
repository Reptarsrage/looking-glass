import { animated, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import React, { useCallback, useRef } from 'react';
import invariant from 'tiny-invariant';

import { ReactComponent as ChevronIcon } from '../assets/chevron.svg';
import useKeyPress from '../hooks/useKeyPress';
import useSize from '../hooks/useSize';
import usePostStore from '../store/posts';

import Fab from './Fab';
import LoadingIndicator from './LoadingIndicator';
import { InnerItem as MasonryItem } from './MasonryItem';
import PinchZoomPan from './PinchZoomPan';

// Constants
const AppBarHeight = 28;
const Gutter = 16;
const ItemsToRender = 5;

/**
 * Clamp a value between a min and max
 */
function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num));
}

/**
 * Resizes image dimensions to fit container, preserving aspect ratio
 */
function clampImageDimensions(width: number, height: number, maxHeight: number, maxWidth: number) {
  const clampTo = Math.min(maxHeight, maxWidth);
  let clampWidth = Math.min(width, clampTo);
  let clampHeight = Math.min(height, clampTo);

  if (width > height) {
    clampHeight = (height / width) * clampWidth;
  } else {
    clampWidth = (width / height) * clampHeight;
  }
  return { width: clampWidth, height: clampHeight };
}

/**
 * Determines the position of the image in the carousel
 */
function getPositionInCarousel(i: number, shownIndex: number, originalIndex: number) {
  const current =
    shownIndex >= originalIndex
      ? (shownIndex - originalIndex) % ItemsToRender // 0, 1, 2, 3, 4, 0, ...
      : (((shownIndex - originalIndex) % ItemsToRender) + ItemsToRender) % ItemsToRender; // 0, 4, 3, 2, 1, 0, ...

  if (i === current) return 0;
  if (i === current - 1 || i === current + 4) return -1;
  if (i === current + 1 || i === current - 4) return 1;
  if (i === current + 2 || i === current - 3) return 2;
  return -2;
}

interface SlideshowProps {
  currentItem: string;
  setCurrentModalItem: (index: string) => void;
  loadMore: () => void;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
}

function Slideshow({ currentItem, setCurrentModalItem, loadMore, hasNextPage, isLoading }: SlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef) ?? { width: window.innerWidth, height: window.innerHeight };

  const postIds = usePostStore((store) => store.postIds);
  const postsById = usePostStore((store) => store.postsById);
  const currentItemIndex = postIds.indexOf(currentItem);
  const originalItemIndex = useRef(currentItemIndex).current;

  /**
   * Update spring values for carousel item
   */
  const update = (indexOfItem: number, active = false, xDelta = 0) => {
    const pos = getPositionInCarousel(indexOfItem, currentItemIndex, originalItemIndex);

    const scaleFactor = 4;
    let x = pos * size.width;
    let scale = 1;

    if (active) {
      x += xDelta;
      scale = 1.025 - Math.abs(xDelta) / size.width / scaleFactor;
    } else if (pos !== 0) {
      scale = 1.025 - size.width / size.width / scaleFactor;
    }

    return {
      x,
      scale,
    };
  };

  /**
   * Transitions to next item in carousel
   */
  const goPrevModalItem = useCallback(() => {
    const newIdx = clamp(currentItemIndex - 1, 0, postIds.length - 1);
    const newPostId = postIds[newIdx];
    if (newPostId) {
      setCurrentModalItem(newPostId);
    }
  }, [setCurrentModalItem, postIds, currentItemIndex]);

  /**
   * Transitions to previous item in carousel
   */
  const goNextModalItem = useCallback(() => {
    const newIdx = clamp(currentItemIndex + 1, 0, postIds.length - 1);
    if (newIdx >= postIds.length - 1 && !isLoading && hasNextPage) {
      loadMore();
    }

    const newPostId = postIds[newIdx];
    if (newPostId) {
      setCurrentModalItem(newPostId);
    }
  }, [setCurrentModalItem, postIds, currentItemIndex, isLoading, hasNextPage, loadMore]);

  // Spring to animate carousel items
  const [springs, api] = useSprings(ItemsToRender, (i) => ({ ...update(i, false, 0) }), [currentItemIndex]);

  // Gesture to drag carousel items
  const bind = useDrag(
    ({ active, movement: [xDelta], direction: [xDir], velocity: [xVelocity], cancel, args: [zoomedIn] }) => {
      if (zoomedIn) {
        cancel();
      }

      if (active && (Math.abs(xDelta) > size.width * 0.45 || xVelocity > 6)) {
        if (xDir > 0) {
          goPrevModalItem();
        } else {
          goNextModalItem();
        }

        cancel();
      }

      api.start((i) => update(i, active, xDelta));
    }
  );

  // Hooks for global key presses
  useKeyPress('ArrowLeft', goPrevModalItem);
  useKeyPress('ArrowRight', goNextModalItem);

  const hasNext = currentItemIndex < postIds.length - 1;
  const hasPrev = currentItemIndex > 0;

  return (
    <div ref={containerRef} className="w-full h-full">
      {hasPrev && (
        <Fab
          onClick={goPrevModalItem}
          disabled={!hasPrev}
          className="absolute left-4 top-2/4 -translate-y-1/2 z-20 w-20 h-20 pr-3"
        >
          <ChevronIcon className="rotate-180 w-12 h-12" />
        </Fab>
      )}

      {!hasNext && isLoading && (
        <div className="absolute right-4 top-2/4 -translate-y-1/2 z-20">
          <LoadingIndicator size={72} />
        </div>
      )}

      {hasNext && (
        <Fab
          onClick={goNextModalItem}
          disabled={!hasNext}
          className="absolute right-4 top-2/4 -translate-y-1/2 z-20 w-20 h-20 pl-3"
        >
          <ChevronIcon className="w-12 h-12" />
        </Fab>
      )}

      {springs.map((style, i) => {
        const pos = getPositionInCarousel(i, currentItemIndex, originalItemIndex);
        if (Math.abs(pos) === 2) {
          return null;
        }

        const idx = currentItemIndex + pos;
        if (idx < 0 || idx >= postIds.length) {
          return null;
        }

        const id = i;
        const postId = postIds[idx];
        invariant(postId, 'Post should exist in store');

        const post = postsById[postId];
        invariant(post, 'Post should exist in store');

        const totalHeight = size.height - AppBarHeight - 2 * Gutter;
        const totalWidth = size.width - 2 * Gutter;
        const { width, height } = clampImageDimensions(post.width, post.height, totalWidth, totalHeight);
        const left = (totalWidth - width) / 2 + Gutter;
        const top = (totalHeight - height) / 2 + Gutter;

        return (
          <animated.div
            tabIndex={pos === 0 ? -1 : undefined}
            {...(pos === 0 ? bind() : {})}
            className="z-10 touch-none flex justify-center items-center absolute"
            key={id}
            style={{ ...style, width, height, top, left }}
          >
            <PinchZoomPan width={width} height={height} reset={pos !== 0}>
              <MasonryItem post={post} imageLoading="eager" lowRes={false} controls />
            </PinchZoomPan>
          </animated.div>
        );
      })}
    </div>
  );
}

export default Slideshow;
