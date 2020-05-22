import React from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import { itemByIdSelector } from '../selectors/itemSelectors';
import Image from './Image';
import Video from './Video';

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
});

const MasonryItem = ({ classes, item, onClick, itemId, visible }) => {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event, item, itemId);
    }
  };

  const renderImage = () => {
    const { width, height, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible ? thumb : '';
    return <Image src={src} thumb={thumbSrc} title={title} width={width} height={height} />;
  };

  const renderVideo = () => {
    const { width, height, title, url, thumb } = item;
    const src = visible ? url : '';
    const thumbSrc = visible ? thumb : '';
    return <Video src={src} thumb={thumbSrc} title={title} width={width} height={height} muted autoPlay loop />;
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
  return (
    <Paper onClick={handleClick} className={classes.paper}>
      {renderLink(isVideo ? renderVideo() : renderImage())}
    </Paper>
  );
};

MasonryItem.defaultProps = {
  onClick: null,
  visible: false,
};

MasonryItem.propTypes = {
  // required
  itemId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
  visible: PropTypes.bool,

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
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(MasonryItem);
