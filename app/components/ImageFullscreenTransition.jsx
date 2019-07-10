import * as React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { duration } from '@material-ui/core/styles/transitions';
import { reflow, getTransitionProps } from '@material-ui/core/transitions/utils';
import { useForkRef } from '@material-ui/core/utils/reactHelpers';
import { useTheme } from '@material-ui/core/styles';

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

/**
 * The ImageFullscreenTransition transition.
 * Based on material-ui Zoom transition here:
 * https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Zoom/Zoom.js
 */
const ImageFullscreenTransition = React.forwardRef(function ImageFullscreenTransition(props, ref) {
  const { children, initialBounds, in: inProp, onExited, style, timeout = defaultTimeout, ...other } = props;

  const theme = useTheme();
  const handleRef = useForkRef(children.ref, ref);

  const handleEnter = node => {
    reflow(node); // So the animation always start from the start.

    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      }
    );
    node.style.webkitTransition = theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
    node.style.transition = theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
  };

  const handleExited = node => {
    if (onExited) {
      onExited(node);
    }
  };

  const handleExit = node => {
    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      }
    );
    node.style.webkitTransition = theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
    node.style.transition = theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
  };

  const initialStyles = {};
  const transitionStyles = { entering: {}, entered: {} };
  if (initialBounds) {
    /* calculate initial position */
    initialStyles.width = `${initialBounds.width}px`;
    initialStyles.height = `${initialBounds.height}px`;
    initialStyles.left = `${initialBounds.left}px`;
    initialStyles.top = `${initialBounds.top}px`;

    /* calculate final position */
    transitionStyles.entered.width = '100%';
    transitionStyles.entered.height = '100%';
    transitionStyles.entered.left = '0px';
    transitionStyles.entered.top = '0px';
    transitionStyles.entering = transitionStyles.entered;
  }

  return (
    <Transition
      in={inProp}
      appear
      onEnter={handleEnter}
      onExit={handleExit}
      onExited={handleExited}
      timeout={timeout}
      {...other}
    >
      {(state, childProps) => {
        return React.cloneElement(children, {
          style: {
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...initialStyles,
            ...transitionStyles[state],
            ...style,
            ...children.props.style,
          },
          ref: handleRef,
          ...childProps,
        });
      }}
    </Transition>
  );
});

ImageFullscreenTransition.propTypes = {
  children: PropTypes.element,
  initialBounds: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  in: PropTypes.bool,
  onExited: PropTypes.func,
  style: PropTypes.object,
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
  ]),
};

export default ImageFullscreenTransition;
