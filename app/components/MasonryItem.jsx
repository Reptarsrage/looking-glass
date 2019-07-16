import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import Image from './Image';
import Video from './Video';

const styles = theme => ({
  paper: {
    padding: 0,
    height: '100%',
    width: '100%',
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

  handleClick(event) {
    const { onClick, id } = this.props;
    if (onClick) {
      onClick(event, id);
    }
  }

  renderImage = () => {
    const { width, height, title, imageURL, thumbURL } = this.props;

    return <Image src={imageURL} thumb={thumbURL} title={title} width={width} height={height} />;
  };

  renderVideo = () => {
    const { width, height, title, thumbURL, videoURL } = this.props;

    return <Video src={videoURL} thumb={thumbURL} title={title} width={width} height={height} muted autoPlay loop />;
  };

  render() {
    const { classes, isVideo, isGallery, id, galleryId, moduleId } = this.props;

    const to = isGallery ? `/gallery/${moduleId}/${galleryId}` : null;
    const Wrapper = isGallery ? Link : React.Fragment;
    const wrapperProps = to ? { to } : {};
    const clickHandler = to ? null : this.handleClick;

    return (
      <Paper key={id} onClick={clickHandler} className={classes.paper}>
        <Wrapper {...wrapperProps}>
          {isGallery ? <PhotoLibraryIcon color="primary" className={classes.icon} /> : null}
          {isVideo ? this.renderVideo() : this.renderImage()}
        </Wrapper>
      </Paper>
    );
  }
}

MasonryItem.defaultProps = {
  thumbURL: null,
  onClick: null,
  galleryId: null,
  imageURL: null,
  videoURL: null,
};

MasonryItem.propTypes = {
  classes: PropTypes.object.isRequired,
  imageURL: PropTypes.string,
  videoURL: PropTypes.string,
  thumbURL: PropTypes.string,
  isVideo: PropTypes.bool.isRequired,
  isGallery: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  moduleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  galleryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(MasonryItem);
