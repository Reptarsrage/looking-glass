import React from 'react';
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

const Video = ({ classes, src, width, height, title, to }) => (
  <video className={classes.video} width={width} height={height} title={title} muted autoPlay loop>
    <source src={src} type={`video/${extname(src).slice(1)}`} />
  </video>
);

Video.defaultProps = {
  title: '',
  to: null,
};

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  to: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(Video);
