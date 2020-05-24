import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { compose } from 'redux';
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
import * as path from 'path';
import { Helmet } from 'react-helmet';

import { productName } from '../../package.json';
import ModuleItem from '../components/ModuleItem';
import * as moduleActions from '../actions/moduleActions';
import * as navigationActions from '../actions/navigationActions';
import { successSelector, fetchingSelector, errorSelector, modulesSelector } from '../selectors/moduleSelectors';
import { FILE_SYSTEM_MODULE_ID } from '../reducers/constants';

const styles = (theme) => ({
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

const Home = ({ classes, fetching, success, fetchModules, navigateToGallery, error, modules }) => {
  useEffect(() => {
    // fetch modules
    if (!fetching && !success) {
      fetchModules();
    }
  });

  const chooseFolder = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(({ canceled, filePaths }) => {
      if (!canceled && filePaths) {
        const galleryId = filePaths[0];
        navigateToGallery(FILE_SYSTEM_MODULE_ID, galleryId, path.basename(galleryId));
      }
    });
  };

  const renderModule = (moduleId) => <ModuleItem key={moduleId} moduleId={moduleId} />;

  const renderModules = () => {
    if (fetching) {
      return <CircularProgress />;
    }

    if (error) {
      return <Typography color="error">An Error occurred</Typography>;
    }

    return (
      <List>
        {modules.filter((id) => id !== FILE_SYSTEM_MODULE_ID).map(renderModule)}
        <ListItem key="fs" button onClick={chooseFolder}>
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

  return (
    <main className={classes.main}>
      <Helmet>
        <title>{productName}</title>
      </Helmet>

      <Paper className={classes.paper}>{renderModules()}</Paper>
    </main>
  );
};

Home.defaultProps = {
  error: null,
};

Home.propTypes = {
  // selectors
  modules: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,

  // actions
  fetchModules: PropTypes.func.isRequired,
  navigateToGallery: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modules: modulesSelector,
  success: successSelector,
  fetching: fetchingSelector,
  error: errorSelector,
});

const mapDispatchToProps = {
  fetchModules: moduleActions.fetchModules,
  navigateToGallery: navigationActions.navigateToGallery,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Home);
