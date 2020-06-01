import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { extname } from 'path';
import clsx from 'clsx';

const styles = () => ({
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
});

const Video = ({ classes, src, thumb, width, height, title, styleName, ...other }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      // based on https://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element/40419032
      videoRef.current.pause();
      videoRef.current.querySelector('source').removeAttribute('src');
      videoRef.current.load();
    };
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      className={clsx(classes.video, styleName)}
      width={width}
      height={height}
      title={title}
      poster={thumb}
      {...other}
    >
      <source src={src} type={`video/${extname(src).slice(1).split('?')[0]}`} />
    </video>
  );
};

Video.defaultProps = {
  title: '',
  thumb: null,
  styleName: null,
};

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  thumb: PropTypes.string,
  title: PropTypes.string,
  styleName: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Video);
