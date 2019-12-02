import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import ReactRouterPropTypes from 'react-router-prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  iconButton: {
    marginLeft: -12,
    marginRight: 20,
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
    const { color, classes, isFab } = this.props;
    const Container = isFab ? <Fab /> : <IconButton />;

    return (
      <Container
        color={color}
        aria-label="Back"
        className={isFab ? classes.fab : classes.iconButton}
        onClick={this.goBack}
      >
        <ArrowBackIcon />
      </Container>
    );
  }
}

BackButton.defaultProps = {
  color: 'default',
  isFab: true,
};

BackButton.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  isFab: PropTypes.bool,
};

export default compose(
  withStyles(styles),
  withRouter
)(BackButton);
