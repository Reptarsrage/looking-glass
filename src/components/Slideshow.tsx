import { useCallback, useRef, useState, useContext } from "react";
import styled from "@mui/system/styled";
import { useDrag } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useModalStore } from "../store/modal";
import { useMasonryStore } from "../store/masonry";
import useKeyPress from "../hooks/useKeyPress";
import { useResize } from "./ResizeObserver";
import PinchZoomPan from "./PinchZoomPan";
import { ModalContext } from "./ContentMasonry/context";
import Post from "./Post";

const TitleBarHeight = 30;
const Gutter = 16;

const Animated = styled(animated.div)({
  touchAction: "none",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  overflow: "hidden",
});

const PrevButton = styled(Fab)(({ theme }) => ({
  top: "calc(50% + 30px)",
  left: "0.5rem",
  position: "fixed",
  transform: "translate(0, -50%)",
  zIndex: (theme.zIndex as any).modal + 1,
}));

const NextButton = styled(Fab)(({ theme }) => ({
  top: "calc(50% + 30px)",
  right: "0.5rem",
  position: "fixed",
  transform: "translate(0, -50%)",
  zIndex: (theme.zIndex as any).modal + 1,
}));

function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num));
}

function capBounds(originalWidth: number, originalHeight: number, maxHeight: number, maxWidth: number): number[] {
  const clampTo = Math.min(maxHeight, maxWidth);
  let clamp_width = Math.min(originalWidth, clampTo);
  let clamp_height = Math.min(originalHeight, clampTo);

  if (originalWidth > originalHeight) {
    clamp_height = (originalHeight / originalWidth) * clamp_width;
  } else {
    clamp_width = (originalWidth / originalHeight) * clamp_height;
  }

  return [clamp_width, clamp_height];
}

const itemsToRender = 5;
function getPos(i: number, shownIndex: number, originalIndex: number) {
  const current =
    shownIndex >= originalIndex
      ? (shownIndex - originalIndex) % itemsToRender // 0, 1, 2, 3, 4, 0, ...
      : (((shownIndex - originalIndex) % itemsToRender) + itemsToRender) % itemsToRender; // 0, 4, 3, 2, 1, 0, ...

  if (i === current) return 0;
  if (i === current - 1 || i === current + 4) return -1;
  if (i === current + 1 || i === current - 4) return 1;
  if (i === current + 2 || i === current - 3) return 2;
  return -2;
}

interface SlideshowProps {
  modalIsTransitioning: boolean;
}

const Slideshow: React.FC<SlideshowProps> = ({ modalIsTransitioning }) => {
  const [width, height] = useResize();
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const scrollMasonryTo = useMasonryStore((state) => state.scrollMasonryTo);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const posts = useContext(ModalContext);
  const open = useModalStore((state) => state.modalIsOpen);
  const setCurrentModalItem = useModalStore((state) => state.setCurrentModalItem);
  const postId = useModalStore((state) => state.modalItem);
  const shownIndex = useModalStore(
    useCallback((state) => (state.modalItem ? posts.findIndex((i) => i.id === state.modalItem) : 0), [posts, postId])
  );

  function update(i: number, active: boolean = false, xDelta: number = 0) {
    const pos = getPos(i, shownIndex, originalIndex);
    return {
      x: pos * width + (open && active ? xDelta : 0),
      scale: open && active ? 1 - Math.abs(xDelta) / width / 2 : 1,
    };
  }

  function handleRest(index: number) {
    const pos = getPos(index, shownIndex, originalIndex);
    if (pos === 0) {
      setIsTransitioning(false);
    }
  }

  function handleStart(index: number) {
    const pos = getPos(index, shownIndex, originalIndex);
    if (pos === 0) {
      setIsTransitioning(true);
    }
  }

  const originalIndex = useRef(shownIndex).current;
  const [springs, api] = useSprings(
    itemsToRender,
    (i) => ({
      ...update(i, false, 0),
      onRest: () => handleRest(i),
      onStart: () => handleStart(i),
    }),
    [shownIndex, width]
  );

  const goPrevModalItem = useCallback(() => {
    if (postId) {
      let idx = posts.findIndex((i) => i.id === postId);
      idx = clamp(idx - 1, 0, posts.length - 1);
      setCurrentModalItem(posts[idx].id);
      scrollMasonryTo(posts[idx].id);
    }
  }, [posts, postId, setCurrentModalItem]);

  const goNextModalItem = useCallback(() => {
    if (postId) {
      let idx = posts.findIndex((i) => i.id === postId);
      idx = clamp(idx + 1, 0, posts.length - 1);
      setCurrentModalItem(posts[idx].id);
      scrollMasonryTo(posts[idx].id);
    }
  }, [posts, postId, setCurrentModalItem]);

  const bind = useDrag(({ active, movement: [xDelta], direction: [xDir], cancel, args: [isZooming, open] }) => {
    if (!open || isZooming) {
      cancel();
    }

    setIsDragging(active);

    if (open && active && Math.abs(xDelta) > width / 2) {
      if (xDir > 0) {
        goPrevModalItem();
      } else {
        goNextModalItem();
      }

      cancel();
    }

    api.start((i) => update(i, active, xDelta));
  });

  useKeyPress("ArrowLeft", goPrevModalItem);
  useKeyPress("ArrowRight", goNextModalItem);

  if (modalIsTransitioning) {
    const post = posts[shownIndex];

    return (
      <Post
        isVideo={post.isVideo}
        urls={post.urls}
        name={post.name}
        width={post.width}
        height={post.height}
        poster={post.poster}
      />
    );
  }

  return (
    <>
      <Zoom in={open} unmountOnExit>
        <PrevButton color="default" onClick={goPrevModalItem}>
          <ChevronLeftIcon />
        </PrevButton>
      </Zoom>

      <Zoom in={open} unmountOnExit>
        <NextButton color="default" onClick={goNextModalItem}>
          <ChevronRightIcon />
        </NextButton>
      </Zoom>

      {springs.map((style, i) => {
        const pos = getPos(i, shownIndex, originalIndex);
        if (Math.abs(pos) === 2) {
          return null;
        }

        const idx = shownIndex + pos;
        if (idx < 0 || idx >= posts.length) {
          return null;
        }

        const post = posts[idx];
        const [post_width, post_height] = capBounds(post.width, post.height, width, height - TitleBarHeight - Gutter);

        return (
          <Animated
            tabIndex={pos === 0 ? -1 : undefined}
            {...(pos === 0 && !isZooming ? bind(isZooming, open) : {})}
            style={style}
            key={i}
          >
            <PinchZoomPan width={post_width} height={post_height}>
              <Post
                isVideo={post.isVideo}
                urls={post.urls}
                name={post.name}
                width={post.width}
                height={post.height}
                poster={post.poster}
              />
            </PinchZoomPan>
          </Animated>
        );
      })}
    </>
  );
};

export default Slideshow;
