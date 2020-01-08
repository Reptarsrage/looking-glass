import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import * as moduleActions from '../actions/moduleActions';
import { moduleValuesSelector, defaultSortValueSelector } from '../selectors/sortSelectors';
import { currentSortSelector } from '../selectors/gallerySelectors';
import SortMenuItem from './SortMenuItem';

const styles = () => ({});

function SortMenu({ sortByValues, moduleId, sortChange, currentSort, galleryId, defaultSort }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = valueId => {
    if (valueId) {
      sortChange(moduleId, galleryId, valueId);
    }

    setAnchorEl(null);
  };

  // nothing to display
  if (!sortByValues || !defaultSort) {
    return null;
  }

  const ariaId = `${moduleId}-sort-menu`;
  return (
    <>
      <Button aria-controls={ariaId} aria-haspopup="true" onClick={handleClick}>
        <SortMenuItem valueId={currentSort || defaultSort} />
      </Button>
      <Menu id={ariaId} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleClose(null)}>
        {sortByValues.map(valueId => (
          <MenuItem key={valueId} onClick={() => handleClose(valueId)}>
            <SortMenuItem valueId={valueId} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

SortMenu.defaultProps = {
  defaultSort: null,
  currentSort: null,
};

SortMenu.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,

  // selectors
  sortByValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentSort: PropTypes.string,
  defaultSort: PropTypes.string,

  // actions
  sortChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sortByValues: moduleValuesSelector,
  currentSort: currentSortSelector,
  defaultSort: defaultSortValueSelector,
});

const mapDispatchToProps = {
  sortChange: moduleActions.sortChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SortMenu);
