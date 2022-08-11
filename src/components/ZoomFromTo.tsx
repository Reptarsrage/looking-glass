import { useState, forwardRef, HTMLProps } from "react";
import { useSpring, animated } from "@react-spring/web";
import { TrainRounded } from "@mui/icons-material";

interface ZoomFromToProps extends Omit<HTMLProps<HTMLDivElement>, "ref" | "children" | "style"> {
  children?: React.ReactElement;
  in: boolean;
  from: React.CSSProperties;
  to: React.CSSProperties;
  position?: "fixed" | "unset";
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

const defaultStyles = {
  top: 30,
  left: 0,
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 1,
  overflow: "hidden",
};

const ZoomFromTo = forwardRef<HTMLDivElement, ZoomFromToProps>(function ZoomFromTo(props, ref) {
  const [settled, setSettled] = useState(true);
  const { in: open, children, onEnter, onEntered, onExit, onExited, from, to, position, ...passThroughProps } = props;
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
    <animated.div ref={ref} style={{ ...defaultStyles, ...(settled ? {} : styles) }} {...passThroughProps}>
      {children}
    </animated.div>
  );
});

ZoomFromTo.defaultProps = {
  position: "fixed",
};

export default ZoomFromTo;
