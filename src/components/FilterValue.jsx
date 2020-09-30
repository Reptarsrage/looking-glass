import React, { memo } from 'react';
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

function FilterValue({ filterId, filter, classes, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(filterId);
    }
  };

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText className={classes.listItem} primary={filter.name} />
    </ListItem>
  );
}

FilterValue.defaultProps = {
  onClick: null,
};

FilterValue.propTypes = {
  // Required
  filterId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,

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

const areEqual = (prevProps, nextProps) => prevProps.filterId === nextProps.filterId;

export default compose(connect(mapStateToProps), withStyles(styles))(memo(FilterValue, areEqual));
