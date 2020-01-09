import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { valueByIdSelector } from '../selectors/sortSelectors';

const NestedSortMenuItem = ({ value, onClick }) => (
  <ListItem button onClick={onClick}>
    <ListItemText primary={value.name} />
  </ListItem>
);

NestedSortMenuItem.propTypes = {
  // required
  valueId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  onClick: PropTypes.func.isRequired,

  // selectors
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  value: valueByIdSelector,
});

export default connect(mapStateToProps)(NestedSortMenuItem);
