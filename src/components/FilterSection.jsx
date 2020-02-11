import React, { Component } from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

import { filterSectionByIdSelector } from '../selectors/filterSectionSelectors';
import * as filterActions from '../actions/filterActions';
import FilterValue from './FilterValue';
import LoadingIndicator from './LoadingIndicator';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class FilterSection extends Component {
  componentDidMount() {
    const { filterSection, filterSectionId, fetchFilters } = this.props;
    const { fetching, fetched } = filterSection;

    if (!fetching && !fetched) {
      fetchFilters(filterSectionId);
    }
  }

  render() {
    const { classes, filterSection, onClick } = this.props;
    const { fetching, fetched, error, values, name } = filterSection;

    if (fetching) {
      return <LoadingIndicator size={50} />;
    }

    if (error) {
      return <span>Error!</span>;
    }

    if (fetched && filterSection.values.length === 0) {
      return null;
    }

    return (
      <List className={classes.root} subheader={<ListSubheader>{name}</ListSubheader>}>
        {values.map(filterId => (
          <FilterValue key={filterId} filterId={filterId} onClick={onClick} />
        ))}
      </List>
    );
  }
}

FilterSection.defaultProps = {
  onClick: null,
};

FilterSection.propTypes = {
  // Required
  filterSectionId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,

  // Selectors
  filterSection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    error: PropTypes.object,
  }).isRequired,

  // Actions
  fetchFilters: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filterSection: filterSectionByIdSelector,
});

const mapDispatchToProps = {
  fetchFilters: filterActions.fetchFilters,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(FilterSection);
