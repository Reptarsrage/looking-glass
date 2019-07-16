import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import ReactRouterPropTypes from 'react-router-prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

class BackButton extends Component {
  shouldComponentUpdate(nextProps) {
    const { color } = this.props;

    return nextProps.color !== color;
  }

  goBack = () => {
    const { history } = this.props;

    if (history && history.goBack) {
      history.goBack();
    }
  };

  render() {
    const { color, classes } = this.props;

    return (
      <Fab color={color} aria-label="Back" className={classes.fab} onClick={this.goBack}>
        <ArrowBackIcon />
      </Fab>
    );
  }
}

BackButton.defaultProps = {
  color: 'default',
};

BackButton.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
};

export default compose(
  withStyles(styles),
  withRouter
)(BackButton);
