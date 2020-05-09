import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { extname } from 'path';

const styles = () => ({
  video: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 'inherit',
    marginBottom: '-4px',
  },
});

const Video = ({ classes, src, thumb, width, height, title, ...other }) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video className={classes.video} width={width} height={height} title={title} poster={thumb} {...other}>
    {src && (
      <source
        src={src}
        type={`video/${
          extname(src)
            .slice(1)
            .split('?')[0]
        }`}
      />
    )}
  </video>
);

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
