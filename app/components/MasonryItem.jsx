import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { useInView } from 'react-intersection-observer';

import { itemByIdSelector } from '../selectors/itemSelectors';
import Image from './Image';
import Video from './Video';

const styles = theme => ({
  paper: {
    padding: 0,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 3,
  },
});

const MasonryItem = props => {
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
    rootMargin: '500px',
  });

  const handleClick = event => {
    const { onClick, itemId } = props;
    if (onClick) {
      onClick(event, itemId);
    }
  };

  const renderImage = () => {
    const { item } = props;
    const { width, height, title, imageURL, thumbURL } = item;
    return inView ? <Image src={imageURL} thumb={thumbURL} title={title} width={width} height={height} /> : null;
  };

  const renderVideo = () => {
    const { item } = props;
    const { width, height, title, videoURL, thumbURL } = item;
    return inView ? (
      <Video src={videoURL} thumb={thumbURL} title={title} width={width} height={height} muted autoPlay loop />
    ) : null;
  };

  const { classes, item, galleryId, moduleId } = props;
  const { isVideo, isGallery } = item;

  const to = isGallery ? `/gallery/${moduleId}/${galleryId}` : null;
  const Wrapper = isGallery ? Link : Fragment;
  const wrapperProps = to ? { to } : {};
  const clickHandler = to ? null : handleClick;

  return (
    <Paper ref={ref} onClick={clickHandler} className={classes.paper}>
      <Wrapper {...wrapperProps}>
        {isGallery ? <PhotoLibraryIcon color="primary" className={classes.icon} /> : null}
        {isVideo ? renderVideo() : renderImage()}
      </Wrapper>
    </Paper>
  );
};

MasonryItem.defaultProps = {
  onClick: null,
};

MasonryItem.propTypes = {
  classes: PropTypes.object.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    imageURL: PropTypes.string,
    thumbURL: PropTypes.string,
    videoURL: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(MasonryItem);
