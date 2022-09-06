import { useState, forwardRef, HTMLProps, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

interface ZoomFromToProps extends Omit<HTMLProps<HTMLDivElement>, "ref" | "children" | "style"> {
  children?: React.ReactElement;
  in: boolean;
  from: React.CSSProperties;
  to: React.CSSProperties;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

const defaultStyles: React.CSSProperties = {
  position: "fixed",
  zIndex: 1,
  overflow: "hidden",
};

const ZoomFromTo = forwardRef<HTMLDivElement, ZoomFromToProps>(function ZoomFromTo(props, ref) {
  const [settled, setSettled] = useState(true);
  const { in: open, children, onEnter, onEntered, onExit, onExited, from, to, ...passThroughProps } = props;
  const styles = useSpring({
    from,
    to,
    config: { mass: 1, tension: 210, friction: 22 },
    onStart: () => {
      setSettled(false);

      if (open && onEnter) {
        onEnter();
      }

      if (!open && onExit) {
        onExit();
      }
    },
    onRest: () => {
      setSettled(true);

      if (!open && onExited) {
        onExited();
      }

      if (open && onEntered) {
        onEntered();
      }
    },
  });

  return (
    <animated.div ref={ref} style={{ ...defaultStyles, ...styles }} {...passThroughProps}>
      {children}
    </animated.div>
  );
});

export default ZoomFromTo;
