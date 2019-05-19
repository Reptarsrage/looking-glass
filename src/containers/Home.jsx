import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';

import * as moduleActions from '../actions/moduleActions';
import { successSelector, fetchingSelector, errorSelector, modulesSelector } from '../selectors/moduleSelectors';

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
    const { classes, fetching, error, modules } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {fetching && <CircularProgress />}
          {error && <Typography color="error">An Error occurred</Typography>}
          <List>
            {modules.map(m => (
              <ListItem
                key={m.get('id')}
                button
                component={Link}
                to={`/${m.get('authType') || 'gallery'}/${m.get('id')}`}
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
});

const mapDispatchToProps = {
  fetchModules: moduleActions.fetchModules,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
