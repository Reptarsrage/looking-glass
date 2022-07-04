import { forwardRef, HTMLProps } from "react";
import { useSpring, animated } from "@react-spring/web";

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

const ZoomFromTo = forwardRef<HTMLDivElement, ZoomFromToProps>(function ZoomFromTo(props, ref) {
  const { in: open, children, onEnter, onEntered, onExit, onExited, from, to, position, ...passThroughProps } = props;
  const styles = useSpring({
    from,
    to,
    config: { mass: 1, tension: 210, friction: 22 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }

      if (!open && onExit) {
        onExit();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }

      if (open && onEntered) {
        onEntered();
      }
    },
  });

  return (
    <animated.div ref={ref} style={{ ...styles, position }} {...passThroughProps}>
      {children}
    </animated.div>
  );
});

ZoomFromTo.defaultProps = {
  position: "fixed",
};

export default ZoomFromTo;
