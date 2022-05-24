import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "@mui/system/styled";
import { useDrag } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";

import { useModalStore } from "../store/modal";
import { useGalleryStore, getKey } from "../store/gallery";
import { useMasonryStore } from "../store/masonry";
import useKeyPress from "../hooks/useKeyPress";
import { useResize } from "./ResizeObserver";
import Video from "./Video";
import ZoomerImage from "./ZoomerImage";
import { useVolumeStore } from "../store/volume";

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

const Slideshow: React.FC = () => {
  const [width, height] = useResize();
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const scrollMasonryTo = useMasonryStore((state) => state.scrollMasonryTo);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const galleryKey = getKey(location);
  const posts = useGalleryStore(
    useCallback((state) => state.galleriesByLocation[galleryKey]?.items ?? [], [galleryKey])
  );
  const open = useModalStore((state) => state.modalIsOpen);
  const setCurrentModalItem = useModalStore((state) => state.setCurrentModalItem);
  const postId = useModalStore((state) => state.modalItem);
  const shownIndex = useModalStore(
    useCallback((state) => (state.modalItem ? posts.findIndex((i) => i.id === state.modalItem) : 0), [posts, postId])
  );

  // video volume
  const videoRef = useRef<HTMLVideoElement>(null);
  const volume = useVolumeStore((state) => state.volume);
  const setVolume = useVolumeStore((state) => state.setVolume);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    if (open && !isTransitioning) {
      setVolume(e.currentTarget.muted ? 0 : e.currentTarget.volume);
    }
  };

  const handleCanPlay: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    e.currentTarget.volume = volume;
  };

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
        const [post_width, post_height] = capBounds(post.width, post.height, width, height - 30 - 16);

        return (
          <Animated
            tabIndex={pos === 0 ? -1 : undefined}
            {...(pos === 0 && !isZooming ? bind(isZooming, open) : {})}
            style={style}
            key={i}
          >
            {post.isVideo ? (
              <Box
                sx={{
                  boxShadow: 1,
                  borderRadius: 2,
                  width: post_width,
                  height: post_height,
                  overflow: "hidden",
                }}
              >
                <Video
                  ref={videoRef}
                  preload="metadata"
                  autoPlay
                  controls
                  loop
                  muted={isTransitioning || pos !== 0}
                  poster={post.poster}
                  width={post_width}
                  height={post_height}
                  sources={post.urls}
                  onVolumeChange={!isTransitioning && pos === 0 ? handleVolumeChange : undefined}
                  onLoadedMetadata={handleCanPlay}
                />
              </Box>
            ) : (
              <ZoomerImage
                post={post}
                enableZoom={!isDragging && !isTransitioning && pos === 0}
                onZoom={setIsZooming}
                width={post_width}
                height={post_height}
              />
            )}
          </Animated>
        );
      })}
    </>
  );
};

export default Slideshow;
