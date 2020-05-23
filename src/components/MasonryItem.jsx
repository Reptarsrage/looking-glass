import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import clsx from 'clsx';

import { moduleIdSelector, galleryIdSelector, fullScreenItemIdSelector } from '../selectors/appSelectors';
import { itemByIdSelector } from '../selectors/itemSelectors';
import * as appActions from '../actions/appActions';
import * as navigationActions from '../actions/navigationActions';
import Image from './Image';
import Video from './Video';
import ImageFullscreenTransition from './ImageFullscreenTransition';
import globalStyles from '../index.scss';

const styles = (theme) => ({
  paper: {
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
    display: 'contents',
  },
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: theme.zIndex.drawer + 3,
  },
  element: {
    position: 'absolute',
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationElement: {
    zIndex: theme.zIndex.drawer + 5,
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

const MasonryItem = ({
  classes,
  moduleId,
  galleryId,
  item,
  itemId,
  visible,
  width,
  height,
  top,
  left,
  fullScreenItemId,
  navigateToGallery,
  fullScreenTransitionIn,
  fullScreenTransitionOut,
  fullScreenTransitionOver,
}) => {
  const prevFullScreenItemId = usePrevious(fullScreenItemId);
  const [initialBounds, setInitialBounds] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenIn, setFullScreenIn] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (prevFullScreenItemId === null && fullScreenItemId === itemId) {
      // Handle change from closed to open
      document.body.classList.add(globalStyles.stopScroll);
      const bounds = ref.current.getBoundingClientRect();
      setInitialBounds(bounds);
      setFullScreen(true);
      setFullScreenIn(true);
    }
  });

  const handleClick = (event) => {
    event.preventDefault();

    if (item.isGallery) {
      navigateToGallery(moduleId, galleryId, item.title);
    } else if (fullScreenItemId === itemId) {
      fullScreenTransitionOut();
      setFullScreenIn(false);
    } else {
      fullScreenTransitionIn(itemId);
    }
  };

  const handleFullScreenExited = () => {
    // Handle modal closed
    document.body.classList.remove(globalStyles.stopScroll);
    setFullScreen(false);
    setInitialBounds(null);
    fullScreenTransitionOver();
  };

  const renderImage = () => {
    const { width: itemWidth, height: itemHeight, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible ? thumb : '';
    return <Image src={src} thumb={thumbSrc} title={title} width={itemWidth} height={itemHeight} />;
  };

  const renderVideo = () => {
    const { width: itemWidth, height: itemHeight, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible ? thumb : '';
    return (
      <Video
        src={src}
        thumb={thumbSrc}
        title={title}
        width={itemWidth}
        height={itemHeight}
        muted={!fullScreen}
        controls={fullScreen}
        autoPlay
        loop
      />
    );
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
    <ImageFullscreenTransition in={fullScreenIn} initialBounds={initialBounds} onExited={handleFullScreenExited}>
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
  fullScreenItemId: null,
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
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  fullScreenItemId: PropTypes.string,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    url: PropTypes.string,
    thumb: PropTypes.string,
  }).isRequired,

  // actions
  navigateToGallery: PropTypes.func.isRequired,
  fullScreenTransitionIn: PropTypes.func.isRequired,
  fullScreenTransitionOut: PropTypes.func.isRequired,
  fullScreenTransitionOver: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  moduleId: moduleIdSelector,
  galleryId: galleryIdSelector,
  item: itemByIdSelector,
  fullScreenItemId: fullScreenItemIdSelector,
});

const mapDispatchToProps = {
  navigateToGallery: navigationActions.navigateToGallery,
  fullScreenTransitionIn: appActions.fullScreenTransitionIn,
  fullScreenTransitionOut: appActions.fullScreenTransitionOut,
  fullScreenTransitionOver: appActions.fullScreenTransitionOver,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(MasonryItem);
