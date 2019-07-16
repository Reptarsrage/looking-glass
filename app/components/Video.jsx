import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { extname } from 'path';
import { InView } from 'react-intersection-observer';

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
      volume: 0.5,
    };

    this.videoRef = null;
  }

  componentWillMount() {
    const volume = sessionStorage.getItem('volume');
    if (volume !== null) {
      this.setState({ volume });
    }
  }

  componentDidMount() {
    if (this.videoRef) {
      const { volume } = this.state;
      this.videoRef.volume = volume;
    }
  }

  componentWillUnmount() {
    const { volume } = this.state;
    sessionStorage.setItem('volume', volume);
  }

  handleVolumeChange = event => {
    this.setState({ volume: event.target.volume });
  };

  handleSetRef = (ref, refCallback) => {
    refCallback(ref);
    this.videoRef = ref;
  };

  render() {
    const { volume } = this.state;
    const { classes, src, thumb, width, height, title, ...other } = this.props;

    return (
      <InView threshold={0}>
        {({ inView, ref: refCallback }) => (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            ref={ref => this.handleSetRef(ref, refCallback)}
            className={classes.video}
            width={width}
            height={height}
            title={title}
            poster={thumb}
            onVolumeChange={this.handleVolumeChange}
            volume={volume}
            {...other}
          >
            {inView ? (
              <source
                src={src}
                type={`video/${
                  extname(src)
                    .slice(1)
                    .split('?')[0]
                }`}
              />
            ) : null}
          </video>
        )}
      </InView>
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
