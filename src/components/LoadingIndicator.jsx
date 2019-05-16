import React from 'react';
import PropTypes from 'prop-types';
import { BounceLoader } from 'halogenium';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  wrapper: {
    margin: '2em auto',
    width: '40px',
    height: '40px',
    position: 'relative',
  },
});

const LoadingIndicator = ({ classes }) => (
  <div className={classes.wrapper}>
    <BounceLoader color="#2196f3" size="100px" margin="2rem" />
  </div>
);

LoadingIndicator.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoadingIndicator);
