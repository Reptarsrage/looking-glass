import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { extname } from 'path';

const styles = () => ({
  video: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    marginBottom: '-4px',
  },
});

class Video extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      volume: sessionStorage.getItem('volume') || 0.5,
    };

    this.video = null;
  }

  componentDidMount() {
    const { volume } = this.state;

    if (this.video) {
      this.video.volume = volume;
    }
  }

  componentWillUnmount() {
    const { volume } = this.state;
    sessionStorage.setItem('volume', volume);
  }

  setVideo = elt => {
    this.video = elt;
  };

  handleVolumeChange = event => {
    const { target } = event;
    const { volume, muted } = target;
    this.setState({ volume: muted ? 0 : volume });
  };

  render() {
    const { classes, src, thumb, width, height, title, ...other } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        ref={this.setVideo}
        className={classes.video}
        width={width}
        height={height}
        title={title}
        poster={thumb}
        onVolumeChange={this.handleVolumeChange}
        {...other}
      >
        <source
          src={src}
          type={`video/${
            extname(src)
              .slice(1)
              .split('?')[0]
          }`}
        />
      </video>
    );
  }
}

Video.defaultProps = {
  title: '',
  thumb: null,
};

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  thumb: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Video);
