import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import Image from './Image';
import Video from './Video';

const styles = theme => ({
  paper: {
    padding: 0,
    flex: '1',
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

class MasonryItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onClick, id } = this.props;
    if (onClick) {
      onClick(id);
    }
  }

  render() {
    const {
      classes,
      width,
      height,
      title,
      videoURL,
      imageURL,
      isVideo,
      isGallery,
      id,
      galleryId,
      moduleId,
      thumbURL,
    } = this.props;

    const Elt = isVideo ? Video : Image;
    const src = isVideo ? videoURL : imageURL;
    const to = isGallery ? `/gallery/${moduleId}/${galleryId}` : null;

    const Wrapper = to ? Link : React.Fragment;
    const wrapperProps = to ? { to } : {};
    const clickHandler = to ? null : this.handleClick;

    return (
      <Paper key={id} onClick={clickHandler} className={classes.paper}>
        <Wrapper {...wrapperProps}>
          {isGallery ? <PhotoLibraryIcon color="primary" className={classes.icon} /> : null}
          <Elt src={src} thumb={thumbURL} title={title} width={width} height={height} />
        </Wrapper>
      </Paper>
    );
  }
}

MasonryItem.defaultProps = {
  videoURL: '',
  imageURL: '',
  thumbURL: '',
  title: '',
  onClick: null,
};

MasonryItem.propTypes = {
  classes: PropTypes.object.isRequired,
  videoURL: PropTypes.string,
  imageURL: PropTypes.string,
  thumbURL: PropTypes.string,
  isVideo: PropTypes.bool.isRequired,
  isGallery: PropTypes.bool.isRequired,
  title: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  galleryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  moduleId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(MasonryItem);
