import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InView } from 'react-intersection-observer';

const styles = () => ({
  image: {
    width: 'auto',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'relative',
    zIndex: 2,
  },
  thumb: {
    filter: 'blur(8px)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    position: 'absolute',
  },
});

const Image = ({ classes, src, thumb, width, height, title, ...other }) => (
  <InView threshold={0}>
    {({ inView, ref }) => (
      <Fragment>
        <div ref={ref} className={classes.thumb} style={{ backgroundImage: thumb ? `url("${thumb}") ` : undefined }} />
        <img
          className={classes.image}
          src={inView ? src : null}
          alt={title}
          width={`${width}px`}
          height={`${height}px`}
          title={title}
          style={{ display: inView ? 'inline-block' : 'none' }}
          {...other}
        />
      </Fragment>
    )}
  </InView>
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
