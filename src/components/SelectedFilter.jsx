import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { filterByIdSelector } from '../selectors/filterSelectors';
import * as moduleActions from '../actions/moduleActions';

const styles = theme => ({
  filterItem: {
    margin: theme.spacing(0.5),
  },
});

const SelectedFilter = ({ filterChange, moduleId, galleryId, filter, classes }) => (
  <Chip
    className={classes.filterItem}
    color="primary"
    label={filter.name}
    onDelete={() => filterChange(moduleId, galleryId, null)}
  />
);

SelectedFilter.propTypes = {
  // required
  // eslint-disable-next-line react/no-unused-prop-types
  filterId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // selectors
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,

  // actions
  filterChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filter: filterByIdSelector,
});

const mapDispatchToProps = {
  filterChange: moduleActions.filterChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SelectedFilter);
