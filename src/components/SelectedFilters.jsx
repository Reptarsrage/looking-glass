import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { currentFilterSelector } from '../selectors/gallerySelectors';
import SelectedFilter from './SelectedFilter';

const styles = (theme) => ({
  filtersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
});

const SelectedFilters = ({ galleryId, currentFilter, classes }) => {
  if (currentFilter) {
    return (
      <div className={classes.filtersContainer}>
        <SelectedFilter filterId={currentFilter} galleryId={galleryId} />
      </div>
    );
  }

  return null;
};

SelectedFilters.defaultProps = {
  currentFilter: null,
};

SelectedFilters.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // selectors
  currentFilter: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  currentFilter: currentFilterSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(SelectedFilters);
