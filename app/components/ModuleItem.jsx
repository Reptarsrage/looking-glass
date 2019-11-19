import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { moduleSelector } from '../selectors/moduleSelectors';

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

const ModuleItem = ({ module, moduleId }) => (
  <ListItem
    button
    component={Link}
    to={`/${module.authType || 'gallery'}/${moduleId}${module.authType ? '' : '/default'}`}
  >
    <ListItemAvatar>
      <Avatar alt={module.title} src={module.icon} />
    </ListItemAvatar>
    <ListItemText primary={module.title} secondary={module.description} />
  </ListItem>
);

ModuleItem.defaultProps = {
  module: null,
};

ModuleItem.propTypes = {
  moduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  module: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  module: moduleSelector,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(ModuleItem);
