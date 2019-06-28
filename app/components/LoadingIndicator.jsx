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

const LoadingIndicator = ({ classes }) => (
  <div className={classes.wrapper}>
    <CircularProgress size={100} />
  </div>
);

LoadingIndicator.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoadingIndicator);
