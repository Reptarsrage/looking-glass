import React from 'react';
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

class Video extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      volume: 0.5,
    };

    this.videoRef = React.createRef();
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  componentWillMount() {
    const volume = sessionStorage.getItem('volume');
    if (volume !== null) {
      this.setState({ volume });
    }
  }

  componentWillUnmount() {
    const { volume } = this.state;
    sessionStorage.setItem('volume', volume);
  }

  handleVolumeChange(event) {
    this.setState({ volume: event.target.volume });
  }

  render() {
    const { classes, src, thumb, width, height, title, autopilot } = this.props;

    return (
      <InView threshold={0}>
        {({ inView, ref }) => (
          <video
            ref={ref}
            className={classes.video}
            width={width}
            height={height}
            title={title}
            muted={autopilot}
            autoPlay
            loop={autopilot}
            poster={thumb}
            controls={!autopilot}
            onVolumeChange={this.handleVolumeChange}
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
  to: null,
  autopilot: true,
};

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  thumb: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  autopilot: PropTypes.bool,
};

export default withStyles(styles)(Video);
