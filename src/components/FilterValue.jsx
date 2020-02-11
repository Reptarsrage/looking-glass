import React from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { filterByIdSelector } from '../selectors/filterSelectors';

const styles = () => ({
  listItem: {
    textTransform: 'capitalize',
  },
});

function FilterValue({ filter, classes }) {
  return (
    <ListItem button>
      <ListItemText className={classes.listItem} primary={filter.name} />
    </ListItem>
  );
}

FilterValue.propTypes = {
  // Required
  // eslint-disable-next-line react/no-unused-prop-types
  filterId: PropTypes.string.isRequired,

  // Selectors
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filter: filterByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(FilterValue);
