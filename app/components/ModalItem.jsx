import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Fab } from '@material-ui/core';

import Image from './Image';
import Video from './Video';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  paper: {
    width: 'fit-content',
    height: 'fit-content',
  },
  button: {
    top: '50%',
    position: 'absolute',
    transform: 'translate(0, -50%)',
    zIndex: 3,
  },
  prev: {
    left: '0.5rem',
  },
  next: {
    right: '0.5rem',
  },
});

class ModalItem extends React.PureComponent {
  goNext = () => {
    const { nextImage } = this.props;
    if (nextImage) {
      nextImage();
    }
  };

  goPrev = () => {
    const { prevImage } = this.props;
    if (prevImage) {
      prevImage();
    }
  };

  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render() {
    const { classes, width, height, title, videoURL, imageURL, isVideo, hasNext, hasPrev } = this.props;

    const Elt = isVideo ? Video : Image;
    const src = isVideo ? videoURL : imageURL;
    const clickHandler = this.handleClick;
    const next = hasPrev() ? (
      <Fab color="default" aria-label="Previous" className={`${classes.prev} ${classes.button}`} onClick={this.goPrev}>
        <ChevronLeftIcon />
      </Fab>
    ) : null;
    const prev = hasNext() ? (
      <Fab color="default" aria-label="Next" className={`${classes.next} ${classes.button}`} onClick={this.goNext}>
        <ChevronRightIcon />
      </Fab>
    ) : null;

    return (
      <div className={classes.container}>
        {prev}
        {next}
        <Paper className={classes.paper} onClick={clickHandler}>
          <Elt src={src} title={title} width={width} height={height} autopilot={false} />
        </Paper>
      </div>
    );
  }
}

ModalItem.defaultProps = {
  videoURL: '',
  imageURL: '',
  title: '',
  onClick: null,
  prevImage: null,
  nextImage: null,
  hasPev: () => false,
  hasNext: () => false,
};

ModalItem.propTypes = {
  classes: PropTypes.object.isRequired,
  videoURL: PropTypes.string,
  imageURL: PropTypes.string,
  isVideo: PropTypes.bool.isRequired,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  nextImage: PropTypes.func,
  prevImage: PropTypes.func,
  hasPev: PropTypes.func,
  hasNext: PropTypes.func,
};

export default withStyles(styles)(ModalItem);
