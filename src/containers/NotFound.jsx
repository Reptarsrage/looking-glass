import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';

import * as naviagationActions from '../actions/navigationActions';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
  body: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
});

const NotFound = ({ classes, navigateHome }) => (
  <>
    <Typography variant="h1">Not Found</Typography>
    <Typography>
      <Button variant="contained" color="default" className={classes.button} onClick={navigateHome}>
        <HomeIcon className={classes.icon} /> Home
      </Button>
    </Typography>
    <Typography className={classes.body} variant="subtitle2">
      Nothing to see here
    </Typography>
  </>
);

NotFound.propTypes = {
  // actions
  navigateHome: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  navigateHome: naviagationActions.navigateHome,
};

export default compose(connect(null, mapDispatchToProps), withStyles(styles))(NotFound);
