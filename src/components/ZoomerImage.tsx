import { useRef, useState, useEffect, useMemo } from "react";
import styled from "@mui/system/styled";
import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import Fade from "@mui/material/Fade";

import { Post } from "../store/gallery";

const Img = styled("img")({
  touchAction: "none",
  WebkitUserSelect: "none",
  WebkitUserDrag: "none",
});

const Container = styled(animated.div)(({ theme }) => ({
  transformOrigin: "0px 0px",
  transform: "translate(0, 0) scale(1)",
  touchAction: "none",
  boxShadow: (theme.shadows as any)[1],
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

interface ZoomerImage2Props {
  post: Post;
  onZoom: (isZooming: boolean) => void;
  enableZoom?: boolean;
  width: number;
  height: number;
}

type RefState = {
  w: number;
  h: number;
};

function capBounds(width: number, height: number, x: number, y: number, scale: number): number[] {
  const newWidth = width * scale;
  const newHeight = height * scale;
  const right = x + newWidth;
  const bottom = y + newHeight;
  if (right < width) {
    x = width - newWidth;
  } else {
    x = Math.min(x, 0);
  }

  if (bottom < height) {
    y = height - newHeight;
  } else {
    y = Math.min(y, 0);
  }

  return [x, y];
}

const ZoomerImage: React.FC<ZoomerImage2Props> = ({ enableZoom, post, onZoom, width, height }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const sorted = useMemo(() => [...post.urls].sort((a, b) => a.width - b.width), [post]);
  const [loaded, setLoaded] = useState(false);
  const refState = useRef<RefState>({
    w: 0,
    h: 0,
  }).current;

  // effect to bootstrap zooming
  const [style, api] = useSpring(() => ({ scale: 1, translateX: 0, translateY: 0 }), [enableZoom]);
  useGesture(
    {
      onDrag: ({ active, delta: [dx, dy], memo, first }) => {
        // Update state
        setIsDragging(active);

        if (first) {
          memo = [style.translateX.get(), style.translateY.get(), style.scale.get()];
        }

        // Calculate xy translation, cap xy translation to original bounds
        let [translateX, translateY, scale] = memo;
        [translateX, translateY] = capBounds(refState.w, refState.h, translateX + dx, translateY + dy, scale);

        // Animate
        api.start({ translateX, translateY });

        // Memoize values
        return [translateX, translateY, scale];
      },

      onWheel: ({ event, direction: [, direction], movement: [, dy] }) => {
        // Do nothing if the ref isn't set (should never happen!)
        const img = imageRef.current;
        if (!img) {
          return;
        }

        const translateX = style.translateX.get();
        const translateY = style.translateY.get();
        const scale = style.scale.get();

        // Calculate zoom point
        let rect = img.getBoundingClientRect();
        let offsetX = event.pageX - rect.left - window.pageXOffset;
        let offsetY = event.pageY - rect.top - window.pageYOffset;
        offsetX /= scale;
        offsetY /= scale;
        const xs = (offsetX - translateX) / scale;
        const ys = (offsetY - translateY) / scale;

        // Get scroll direction & set zoom level
        let mvmt = Math.min(2.5, Math.max(1.2, 1 + Math.log10(Math.abs(dy / 100))));
        let newScale = direction <= 0 ? scale * mvmt : scale / mvmt;

        // Reverse the offset amount with the new scale
        let newTranslateX = offsetX - xs * newScale;
        let newTranslateY = offsetY - ys * newScale;

        // Cap zoom
        if (newScale < 1) {
          newScale = 1;
          newTranslateX = 0;
          newTranslateY = 0;
        }

        // Cap xy translation to original bounds
        [newTranslateX, newTranslateY] = capBounds(refState.w, refState.h, newTranslateX, newTranslateY, newScale);

        // Update state
        if (newScale > 1) {
          setZoomedIn(true);
        } else {
          setZoomedIn(false);
        }

        // Animate
        api.start({ scale: newScale, translateX: newTranslateX, translateY: newTranslateY });
      },
    },
    {
      target: imageRef,
    }
  );

  useEffect(() => {
    if (imageRef.current && enableZoom) {
      // Save initial dimensions
      const computedStyle = window.getComputedStyle(imageRef.current, null);
      const w = parseInt(computedStyle.width, 10);
      const h = parseInt(computedStyle.height, 10);
      refState.w = w;
      refState.h = h;
    }
  }, [enableZoom]);

  useEffect(() => {
    onZoom(zoomedIn);
  }, [zoomedIn]);

  const handleImageLoad: React.ReactEventHandler<HTMLImageElement> = () => {
    setLoaded(true);
  };

  if (sorted.length === 0) {
    return null;
  }

  return (
    <Container
      style={{
        position: "relative",
        cursor: isDragging ? "grabbing" : zoomedIn ? "grab" : undefined,
        translateX: style.translateX,
        translateY: style.translateY,
        scale: style.scale,
        width,
        height,
      }}
    >
      {/* Render the original image */}
      <picture style={{ width, height, position: "absolute", top: 0, left: 0 }}>
        {sorted.slice(1).map((source, idx) => (
          <source key={idx} srcSet={source.url} media={`(min-width: ${source.width}px)`} />
        ))}

        <Img
          ref={imageRef}
          alt={post.name}
          src={`${sorted[0].url}`}
          width={width}
          height={height}
          draggable={zoomedIn}
        />
      </picture>

      {/* Render a hidden image at a higher resolution . When it loads, swap it with the original */}
      <Fade in={loaded}>
        <img
          alt={post.name}
          src={sorted[sorted.length - 1].url}
          width={width}
          height={height}
          draggable={zoomedIn}
          onLoad={handleImageLoad}
          style={{ width, height, position: "absolute", top: 0, left: 0, opacity: loaded ? 1 : 0 }}
        />
      </Fade>
    </Container>
  );
};

ZoomerImage.defaultProps = {
  enableZoom: false,
};

export default ZoomerImage;
