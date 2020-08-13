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
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FolderIcon from '@material-ui/icons/Folder';
import { remote } from 'electron';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router';

import { productName } from '../../package.json';
import ModuleItem from '../components/ModuleItem';
import * as moduleActions from '../actions/moduleActions';
import * as galleryActions from '../actions/galleryActions';
import { fetchedSelector, fetchingSelector, errorSelector, modulesSelector } from '../selectors/moduleSelectors';
import { FILE_SYSTEM_MODULE_ID, generateGalleryId } from '../reducers/constants';
import LoadingIndicator from '../components/LoadingIndicator';

const styles = (theme) => ({
  main: {
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

const Home = ({ classes, fetching, fetched, fetchModules, error, modules, setFileSystemDirectory }) => {
  const history = useHistory();

  useEffect(() => {
    // fetch modules
    if (!fetching && !fetched) {
      fetchModules();
    }
  }, []);

  const chooseFolder = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(({ canceled, filePaths }) => {
      if (!canceled && filePaths) {
        const directoryPath = filePaths[0];
        setFileSystemDirectory(directoryPath);
        const siteId = Buffer.from(directoryPath, 'utf-8').toString('base64');
        const galleryId = generateGalleryId(FILE_SYSTEM_MODULE_ID, siteId);
        history.push(`/gallery/${FILE_SYSTEM_MODULE_ID}/${galleryId}`);
      }
    });
  };

  const renderModule = (moduleId) => <ModuleItem key={moduleId} moduleId={moduleId} />;

  const renderModules = () => {
    if (fetching) {
      return <LoadingIndicator />;
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
  fetched: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,

  // actions
  fetchModules: PropTypes.func.isRequired,
  setFileSystemDirectory: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modules: modulesSelector,
  fetched: fetchedSelector,
  fetching: fetchingSelector,
  error: errorSelector,
});

const mapDispatchToProps = {
  fetchModules: moduleActions.fetchModules,
  setFileSystemDirectory: galleryActions.setFileSystemDirectory,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Home);
