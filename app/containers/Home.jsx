import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
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
import FolderIcon from '@material-ui/icons/Folder';
import { remote } from 'electron';

import * as moduleActions from '../actions/moduleActions';
import * as galleryActions from '../actions/galleryActions';
import { successSelector, fetchingSelector, errorSelector, modulesSelector } from '../selectors/moduleSelectors';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Home extends React.Component {
  constructor() {
    super();

    this.chooseFolder = this.chooseFolder.bind(this);
  }

  componentWillMount() {
    const { fetching, success, fetchModules } = this.props;
    if (!fetching && !success) {
      fetchModules();
    }
  }

  chooseFolder() {
    const { history } = this.props;
    const result = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (result && result.length === 1) {
      const galleryId = encodeURIComponent(result[0]);
      history.push(`/gallery/fs/${galleryId}`);
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
                to={`/${m.get('authType') || 'gallery'}/${m.get('id')}${!!m.get('authType') ? '' : '/default'}`}
              >
                <ListItemAvatar>
                  <Avatar alt={m.get('title')} src={m.get('icon')} />
                </ListItemAvatar>
                <ListItemText primary={m.get('title')} secondary={m.get('description')} />
              </ListItem>
            ))}
            <ListItem key="fs" button onClick={this.chooseFolder}>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Local files" secondary="Choose a directory" />
            </ListItem>
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
  history: ReactRouterPropTypes.history.isRequired,
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Home);
