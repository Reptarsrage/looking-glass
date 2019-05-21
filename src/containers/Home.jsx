import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { WbSunny, Brightness2 } from '@material-ui/icons';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
import {
  ListItem,
  Fab,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';

import * as moduleActions from '../actions/moduleActions';
import * as appActions from '../actions/appActions';
import { successSelector, fetchingSelector, errorSelector, modulesSelector } from '../selectors/moduleSelectors';
import { darkThemeSelector } from '../selectors/appSelectors';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Home extends React.Component {
  componentWillMount() {
    const { fetching, success, fetchModules } = this.props;
    if (!fetching && !success) {
      fetchModules();
    }
  }

  render() {
    const { classes, fetching, error, modules, toggleDarkTheme, darkTheme } = this.props;

    return (
      <main className={classes.main}>
        <Fab color="secondary" aria-label="Toggle Theme" onClick={toggleDarkTheme}>
          {darkTheme ? <Brightness2 /> : <WbSunny />}
        </Fab>
        <Paper className={classes.paper}>
          {fetching && <CircularProgress />}
          {error && <Typography color="error">An Error occurred</Typography>}
          <List>
            {modules.map(m => (
              <ListItem
                key={m.get('id')}
                button
                component={Link}
                to={`/${m.get('authType') || 'gallery'}/${m.get('id')}${!!m.get('authType') ? '' : '/default'}`}
              >
                <ListItemAvatar>
                  <Avatar alt={m.get('title')} src={m.get('icon')} />
                </ListItemAvatar>
                <ListItemText primary={m.get('title')} secondary={m.get('description')} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </main>
    );
  }
}

Home.defaultProps = {
  error: null,
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchModules: PropTypes.func.isRequired,
  modules: PropTypes.instanceOf(Immutable.List).isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  modules: modulesSelector(),
  success: successSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  darkTheme: darkThemeSelector(),
});

const mapDispatchToProps = {
  fetchModules: moduleActions.fetchModules,
  toggleDarkTheme: appActions.toggleDarkTheme,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Home);
