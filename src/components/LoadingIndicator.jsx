import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  wrapper: {
    margin: '2em auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    position: 'relative',
  },
});

const LoadingIndicator = ({ classes, size }) => (
  <div className={classes.wrapper}>
    <CircularProgress size={size} />
  </div>
);

LoadingIndicator.defaultProps = {
  size: 100,
};

LoadingIndicator.propTypes = {
  // optional
  size: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingIndicator);
