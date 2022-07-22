import { useState, useRef } from "react";
import { animated, useSpring, config } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import styled from "@mui/system/styled";

const Animated = styled(animated.div)({
  touchAction: "none",
  WebkitAppRegion: "no-drag",
  transformOrigin: "0 0",
});

interface PinchZoomPanProps {
  width: number;
  children: React.ReactNode;
  height: number;
}

const PinchZoomPan: React.FC<PinchZoomPanProps> = ({ width, height, children }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  useGesture(
    {
      onDrag: ({ event, down, first, movement: [mx, my], memo }) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(down);

        if (first) {
          // record startiy
          const x = style.x.get();
          const y = style.y.get();
          const scale = style.scale.get();
          const w = width * scale;
          const h = height * scale;
          memo = [x, y, w, h];
        }

        // calculate new position based on starting pos and movement
        const limit = 0.75;
        let [x, y, w, h] = memo;
        x = Math.min(width * limit, Math.max(x + mx, -w * limit));
        y = Math.min(height * limit, Math.max(y + my, -h * limit));

        // update
        api.start({ x, y, config: config.default });
        return memo;
      },
      onWheel: ({ first, active, event, delta: [, dy], memo }) => {
        event.preventDefault();

        if (first) {
          // get current scale and pos
          const x = style.x.get();
          const y = style.y.get();
          const scale = style.scale.get();
          const w = width * scale;
          const h = height * scale;

          // measure things
          const boundsRect = boundsRef.current!.getBoundingClientRect();
          const bx = boundsRect.x; // bounds x relative to page
          const by = boundsRect.y; // bounds y relative to page

          // memoize
          memo = [scale, x, y, w, h, bx, by];
        }

        // pull from memo
        let [scale, x, y, w, h, bx, by] = memo;

        // calculate new  scale
        const minScale = 1;
        const maxScale = 10;
        const scalestep = 1.2;
        scale *= Math.pow(scalestep, dy / -100); // new scale
        scale = Math.min(maxScale, Math.max(scale, minScale));

        let conf: any = config.stiff;
        if (scale <= minScale) {
          x = 0;
          y = 0;
          conf = config.wobbly;
        } else if (active) {
          const tx = bx + x; // target x relative to page
          const ty = by + y; // target y relative to page
          const ox = event.pageX - tx; // cursor left relative to target
          const oy = event.pageY - ty; // cursor top relative to target
          const obx = event.pageX - bx; // cursor left relative to bounds
          const oby = event.pageY - by; // cursor top relative to bounds
          const rx = ox / w; // ratio of width from left of target
          const ry = oy / h; // ratio of height from top of target

          // calculate new size
          w = width * scale; // new width
          h = height * scale; // new hight

          // calculate new position
          x = obx - w * rx;
          y = oby - h * ry;

          // respect bounds
          x = Math.min(width, Math.max(x, -w));
          y = Math.min(height, Math.max(y, -h));
        }

        // update
        setIsZoomed(scale > 1);
        memo = [scale, x, y, w, h, bx, by];
        api.start({ scale, x, y, config: conf });
        return memo;
      },
    },
    {
      target: targetRef,
      drag: { enabled: isZoomed, eventOptions: { passive: false } },
      wheel: { eventOptions: { passive: false } },
    }
  );

  // choose cursor
  let cursor = undefined;
  if (isDragging) {
    cursor = "grabbing";
  } else if (isZoomed) {
    cursor = "grab";
  }

  return (
    <div ref={boundsRef} style={{ position: "relative", width, height }}>
      <Animated
        ref={targetRef}
        style={{
          ...style,
          width,
          height,
          cursor,
        }}
      >
        {children}
      </Animated>
    </div>
  );
};

export default PinchZoomPan;
