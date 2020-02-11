import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  image: {
    width: 'auto',
    height: '100%',
    maxWidth: '100%',
    maxHeight: 'inherit',
    position: 'relative',
    objectFit: 'contain',
    zIndex: theme.zIndex.drawer + 2,
  },
  thumb: {
    filter: 'blur(8px)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 1,
    position: 'absolute',
  },
});

const Image = ({ classes, src, thumb, width, height, title, ...other }) => (
  <>
    <div className={classes.thumb} style={{ backgroundImage: thumb ? `url("${thumb}") ` : undefined }} />
    <img
      className={classes.image}
      src={src}
      alt={title}
      width={`${width}px`}
      height={`${height}px`}
      title={title}
      {...other}
    />
  </>
);

Image.defaultProps = {
  title: '',
  thumb: null,
};

Image.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  thumb: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Image);
