import React, { Component } from 'react';
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
import FolderIcon from '@material-ui/icons/Folder';
import { remote } from 'electron';

import ModuleItem from '../components/ModuleItem';
import * as moduleActions from '../actions/moduleActions';
import * as appActions from '../actions/appActions';
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

class Home extends Component {
  componentWillMount() {
    const { fetching, success, fetchModules, setCurrentGallery } = this.props;

    // make sure no module is selected
    setCurrentGallery(null, null);

    // fetch modules
    if (!fetching && !success) {
      fetchModules();
    }
  }

  chooseFolder = () => {
    const { history } = this.props;
    const result = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (result && result.length === 1) {
      const galleryId = encodeURIComponent(result[0]);
      history.push(`/gallery/fs/${galleryId}`); // TODO: set current filesystem gallery
    }
  };

  renderModule = moduleId => <ModuleItem key={moduleId} moduleId={moduleId} />;

  renderModules = () => {
    const { fetching, error, modules } = this.props;

    if (fetching) {
      return <CircularProgress />;
    }

    if (error) {
      return <Typography color="error">An Error occurred</Typography>;
    }

    return (
      <List>
        {modules.map(this.renderModule)}
        <ListItem key="fs" button onClick={this.chooseFolder}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Local files" secondary="Choose a directory" />
        </ListItem>
      </List>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>{this.renderModules()}</Paper>
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
  setCurrentGallery: PropTypes.func.isRequired,
  modules: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  history: ReactRouterPropTypes.history.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modules: modulesSelector,
  success: successSelector,
  fetching: fetchingSelector,
  error: errorSelector,
});

const mapDispatchToProps = {
  fetchModules: moduleActions.fetchModules,
  setCurrentGallery: appActions.setCurrentGallery,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Home);
