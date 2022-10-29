import { useCallback, useRef, useState, useContext } from "react";
import styled from "@mui/system/styled";
import { useDrag } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { ModalContext } from "../store/modal";
import { GalleryContext } from "../store/gallery";
import useKeyPress from "../hooks/useKeyPress";
import { useResize } from "./ResizeObserver";
import PinchZoomPan from "./PinchZoomPan";
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
  overflow: "visible",
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

/**
 * Resizes image dimensions to fit container, preserving aspect ratio
 * @param {*} width
 * @param {*} height
 * @param {*} maxHeight
 * @param {*} maxWidth
 */
function clampImageDimensions(width: number, height: number, maxHeight: number, maxWidth: number) {
  let clampTo = Math.min(maxHeight, maxWidth);
  let clampWidth = Math.min(width, clampTo);
  let clampHeight = Math.min(height, clampTo);

  if (width > height) {
    clampHeight = (height / width) * clampWidth;
  } else {
    clampWidth = (width / height) * clampHeight;
  }
  return { width: clampWidth, height: clampHeight };
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const galleryContext = useContext(GalleryContext);
  const modalContext = useContext(ModalContext);
  const posts = galleryContext.posts;
  const open = modalContext.state.modalIsOpen;
  const setCurrentModalItem = (item: string | null) =>
    modalContext.dispatch({ type: "SET_MODAL_ITEM", payload: { item } });
  const postId = modalContext.state.modalItem;
  const shownIndex = modalContext.state.modalItem ? posts.findIndex((i) => i.id === modalContext.state.modalItem) : 0;

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
    }
  }, [posts, postId, setCurrentModalItem]);

  const goNextModalItem = useCallback(() => {
    if (postId) {
      let idx = posts.findIndex((i) => i.id === postId);
      idx = clamp(idx + 1, 0, posts.length - 1);
      setCurrentModalItem(posts[idx].id);
    }
  }, [posts, postId, setCurrentModalItem]);

  const bind = useDrag(({ active, movement: [xDelta], direction: [xDir], cancel, args: [isZooming, open] }) => {
    if (!open || isZooming) {
      cancel();
    }

    setIsDragging(active);

    if (open && active && Math.abs(xDelta) > width / 3) {
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
    return <Post post={posts[shownIndex]} />;
  }

  const idx = posts.findIndex((i) => i.id === postId);
  const hasNext = idx < posts.length - 1;
  const hasPrev = idx > 0;

  return (
    <>
      <Zoom in={open && hasPrev} unmountOnExit>
        <PrevButton color="default" onClick={goPrevModalItem}>
          <ChevronLeftIcon />
        </PrevButton>
      </Zoom>

      <Zoom in={open && hasNext} unmountOnExit>
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
        const totalHeight = window.innerHeight - TitleBarHeight - 2 * Gutter;
        const totalWidth = window.innerWidth - 2 * Gutter;
        const { width: post_width, height: post_height } = clampImageDimensions(
          post.width,
          post.height,
          totalWidth,
          totalHeight
        );

        return (
          <Animated
            tabIndex={pos === 0 ? -1 : undefined}
            {...(pos === 0 && !isZooming ? bind(isZooming, open) : {})}
            style={{
              overflow: "hidden",
              position: modalIsTransitioning ? "absolute" : "fixed",
              top: modalIsTransitioning ? 0 : 30,
              ...style,
            }}
            key={i}
          >
            <PinchZoomPan width={post_width} height={post_height} reset={pos !== 0}>
              <Post post={post} interactable={!isZooming && pos === 0} />
            </PinchZoomPan>
          </Animated>
        );
      })}
    </>
  );
};

export default Slideshow;
