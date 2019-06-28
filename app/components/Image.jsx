import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InView } from 'react-intersection-observer';

const styles = () => ({
  image: {
    width: 'auto',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  thumb: {
    filter: 'blur(8px)',
    width: 'auto',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

const Image = ({ classes, src, thumb, width, height, title }) => (
  <InView threshold={0.1}>
    {({ inView, ref }) => (
      <img
        ref={ref}
        className={inView ? classes.image : classes.thumb}
        src={inView ? src : thumb}
        alt={title}
        width={width}
        height={height}
        title={title}
      />
    )}
  </InView>
);

Image.defaultProps = {
  title: '',
  to: null,
};

Image.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  thumb: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Image);
