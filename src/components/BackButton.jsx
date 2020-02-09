import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import * as naviagationActions from '../actions/navigationActions';

const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  iconButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

const BackButton = ({ color, classes, isFab, navigateBack }) => {
  if (isFab) {
    return (
      <Fab color={color} aria-label="Back" className={isFab ? classes.fab : classes.iconButton} onClick={navigateBack}>
        <ArrowBackIcon />
      </Fab>
    );
  }

  return (
    <IconButton
      color={color}
      aria-label="Back"
      className={isFab ? classes.fab : classes.iconButton}
      onClick={navigateBack}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

BackButton.defaultProps = {
  color: 'default',
  isFab: true,
};

BackButton.propTypes = {
  // optional
  color: PropTypes.string,
  isFab: PropTypes.bool,

  // withStyles
  classes: PropTypes.object.isRequired,

  // actions
  navigateBack: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  navigateBack: naviagationActions.navigateBack,
};

export default compose(connect(null, mapDispatchToProps), withStyles(styles))(BackButton);
