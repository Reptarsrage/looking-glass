import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import * as naviagationActions from '../actions/navigationActions';
import { moduleByIdSelector } from '../selectors/moduleSelectors';

const styles = () => ({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ModuleItem = ({ moduleId, module, navigateToGallery }) => {
  const handleClick = () => {
    navigateToGallery(moduleId, module.defaultGalleryId, module.title);
  };

  return (
    <ListItem button onClick={handleClick}>
      <ListItemAvatar>
        <Avatar alt={module.title} src={module.icon} />
      </ListItemAvatar>
      <ListItemText primary={module.title} secondary={module.description} />
    </ListItem>
  );
};

ModuleItem.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,

  // selectors
  module: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    defaultGalleryId: PropTypes.string.isRequired,
  }).isRequired,

  // actions
  navigateToGallery: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  module: moduleByIdSelector,
});

const mapDispatchToProps = {
  navigateToGallery: naviagationActions.navigateToGallery,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(ModuleItem);
