import React from 'react';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';

import { filterBySelector } from '../selectors/moduleSelectors';
import FilterSection from './FilterSection';

function FilterList({ filterSections, onClick }) {
  return (
    <>
      {filterSections
        .map((filterSectionId) => (
          <FilterSection key={filterSectionId} onClick={onClick} filterSectionId={filterSectionId} />
        ))
        .reduce((p, c) => [...p, <Divider key={`${c.key}-divider`} />, c], [])}
    </>
  );
}

FilterList.defaultProps = {
  onClick: null,
};

FilterList.propTypes = {
  // Required
  // eslint-disable-next-line react/no-unused-prop-types
  moduleId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,

  // Selectors
  filterSections: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = createStructuredSelector({
  filterSections: filterBySelector,
});

export default connect(mapStateToProps)(FilterList);
