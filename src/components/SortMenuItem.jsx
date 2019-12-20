import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { valueByIdSelector } from '../selectors/sortSelectors';

const styles = () => ({
  icon: {
    justifyContent: 'flex-end',
  },
});

const SortMenuItem = ({ classes, value }) => (
  <>
    <ListItemText primary={value.name} />
    {value.values && (
      <ListItemIcon className={classes.icon}>
        <ChevronRightIcon />
      </ListItemIcon>
    )}
  </>
);

SortMenuItem.propTypes = {
  // required
  valueId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types

  // selectors
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string),
    icon: PropTypes.string.isRequired,
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  value: valueByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(SortMenuItem);
