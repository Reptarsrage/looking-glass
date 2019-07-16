import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

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
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class ModalItem extends PureComponent {
  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  renderImage = () => {
    const { width, height, title, imageURL } = this.props;

    return <Image src={imageURL} title={title} width={width} height={height} />;
  };

  renderVideo = () => {
    const { width, height, title, videoURL } = this.props;

    return <Video src={videoURL} title={title} width={width} height={height} autoPlay controls />;
  };

  render() {
    const { classes, isVideo } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.paper} onClick={this.handleClick}>
          {isVideo ? this.renderVideo() : this.renderImage()}
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
};

export default withStyles(styles)(ModalItem);
