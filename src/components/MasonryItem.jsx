import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import clsx from 'clsx';

import { itemByIdSelector } from '../selectors/itemSelectors';
import * as itemActions from '../actions/itemActions';
import Image from './Image';
import Video from './Video';
import ImageFullscreenTransition from './ImageFullscreenTransition';
import globalStyles from '../index.scss';

const styles = (theme) => ({
  paper: {
    padding: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: theme.zIndex.drawer + 3,
  },
  // Modal Specific
  element: {
    position: 'absolute',
    display: 'flex',
    overflow: 'hidden',
  },
  animationElement: {
    zIndex: theme.zIndex.drawer + 5,
  },
  backdrop: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 4,
    background: 'rgba(0,0,0,1)',
  },
  button: {
    top: '50%',
    position: 'fixed',
    transform: 'translate(0, -50%)',
    zIndex: theme.zIndex.drawer + 6,
  },
  prev: {
    left: '0.5rem',
  },
  next: {
    right: '0.5rem',
  },
});

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const MasonryItem = ({ classes, item, itemId, visible, width, height, top, left, itemClick }) => {
  const prevItem = usePrevious(item);
  const [initialBounds, setInitialBounds] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [transitionIn, setTransitionIn] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (prevItem && prevItem.isFullScreen !== item.isFullScreen) {
      if (item.isFullScreen) {
        // Handle change from closed to open
        document.body.classList.add(globalStyles.stopScroll);
        const bounds = ref.current.getBoundingClientRect();
        setInitialBounds(bounds);
        setFullScreen(true);
        setTransitionIn(true);
      } else {
        // Handle change from open to closed
        setTransitionIn(false);
      }
    }
  });

  const handleClick = () => {
    itemClick(itemId);
  };

  const handleModalExited = () => {
    // Handle modal closed
    document.body.classList.remove(globalStyles.stopScroll);
    setFullScreen(false);
    setInitialBounds(null);
  };

  const renderImage = () => {
    const { width: itemWidth, height: itemHeight, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible && !fullScreen ? thumb : '';
    return <Image src={src} thumb={thumbSrc} title={title} width={itemWidth} height={itemHeight} />;
  };

  const renderVideo = () => {
    const { width: itemWidth, height: itemHeight, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible && !fullScreen ? thumb : '';
    return <Video src={src} thumb={thumbSrc} title={title} width={itemWidth} height={itemHeight} muted autoPlay loop />;
  };

  const renderLink = (children) => {
    const { isGallery } = item;

    if (isGallery) {
      return (
        <div className={classes.link}>
          <PhotoLibraryIcon color="primary" className={classes.icon} />
          {children}
        </div>
      );
    }

    return children;
  };

  const { isVideo } = item;
  const renderElt = isVideo ? renderVideo : renderImage;
  const style = fullScreen
    ? { left: `${initialBounds.left}px`, top: `${initialBounds.top}px`, position: 'fixed' }
    : { left: `${left}px`, top: `${top}px` };

  return (
    <ImageFullscreenTransition in={transitionIn} initialBounds={initialBounds} onExited={handleModalExited}>
      <div
        className={clsx(classes.element, fullScreen ? classes.animationElement : undefined)}
        style={{ ...style, width: `${width}px`, height: `${height}px` }}
        ref={ref}
      >
        <Paper onClick={handleClick} className={clsx(classes.transitionElt, classes.paper)}>
          {renderLink(renderElt())}
        </Paper>
      </div>
    </ImageFullscreenTransition>
  );
};

MasonryItem.defaultProps = {
  visible: false,
  width: 0,
  top: 0,
  height: 0,
  left: 0,
};

MasonryItem.propTypes = {
  // required
  itemId: PropTypes.string.isRequired,

  // optional
  visible: PropTypes.bool,
  height: PropTypes.number,
  left: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,

  // selectors
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    url: PropTypes.string,
    thumb: PropTypes.string,
    isFullScreen: PropTypes.bool,
  }).isRequired,

  // actions
  itemClick: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

const mapDispatchToProps = {
  itemClick: itemActions.itemClick,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(MasonryItem);
