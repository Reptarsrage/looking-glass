import React, { forwardRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { duration } from '@material-ui/core/styles/transitions';
import { reflow, getTransitionProps } from '@material-ui/core/transitions/utils';
import useForkRef from '@material-ui/core/utils/useForkRef';
import useTheme from '@material-ui/core/styles/useTheme';

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

const defaultInitialBounds = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
};

/**
 * The ImageFullscreenTransition transition.
 * Based on material-ui Zoom transition here:
 * https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Zoom/Zoom.js
 */
const ImageFullscreenTransition = forwardRef(function ImageFullscreenTransition(props, ref) {
  const { children, initialBounds, in: inProp, onExited, style, timeout, disabled, ...other } = props;

  const theme = useTheme();
  const handleRef = useForkRef(children.ref, ref);

  const handleEnter = (node) => {
    reflow(node); // So the animation always start from the start.

    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      }
    );

    node.style.webkitTransition = disabled
      ? ''
      : theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
    node.style.transition = disabled
      ? ''
      : theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
  };

  const handleExited = (node) => {
    node.style.webkitTransition = '';
    node.style.transition = '';
    if (onExited) {
      onExited(node);
    }
  };

  const handleExit = (node) => {
    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      }
    );

    node.style.webkitTransition = disabled
      ? ''
      : theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
    node.style.transition = disabled
      ? ''
      : theme.transitions.create(['width', 'height', 'top', 'left'], transitionProps);
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
      timeout={disabled ? 0 : timeout}
      {...other}
    >
      {(state, childProps) => {
        return cloneElement(children, {
          style: {
            ...children.props.style,
            ...initialStyles,
            ...transitionStyles[state],
            ...style,
          },
          ref: handleRef,
          ...childProps,
        });
      }}
    </Transition>
  );
});

ImageFullscreenTransition.defaultProps = {
  in: true,
  onExited: null,
  disabled: false,
  style: {},
  timeout: defaultTimeout,
  initialBounds: defaultInitialBounds,
};

ImageFullscreenTransition.propTypes = {
  children: PropTypes.element.isRequired,
  initialBounds: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  in: PropTypes.bool,
  disabled: PropTypes.bool,
  onExited: PropTypes.func,
  style: PropTypes.object,
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
  ]),
};

export default ImageFullscreenTransition;
