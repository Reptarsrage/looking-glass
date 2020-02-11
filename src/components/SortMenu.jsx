import React from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';

import * as moduleActions from '../actions/moduleActions';
import { moduleValuesSelector, currentSortTextSelector } from '../selectors/sortSelectors';
import SortMenuItem from './SortMenuItem';

const styles = theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
});

function SortMenu({ sortByValues, moduleId, sortChange, galleryId, classes, currentSortText }) {
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
  if (!sortByValues || !currentSortText) {
    return null;
  }

  const ariaId = `${moduleId}-sort-menu`;
  return (
    <>
      <Button aria-controls={ariaId} aria-haspopup="true" onClick={handleClick}>
        <SortIcon className={classes.extendedIcon} />
        <Typography color="textSecondary">Sort By</Typography>
      </Button>
      <Popover
        id={ariaId}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => handleClose(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List>
          {sortByValues.map(valueId => (
            <SortMenuItem key={valueId} valueId={valueId} onClick={handleClose} />
          ))}
        </List>
      </Popover>
    </>
  );
}

SortMenu.defaultProps = {
  currentSortText: null,
};

SortMenu.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,

  // selectors
  sortByValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentSortText: PropTypes.string,

  // actions
  sortChange: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sortByValues: moduleValuesSelector,
  currentSortText: currentSortTextSelector,
});

const mapDispatchToProps = {
  sortChange: moduleActions.sortChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SortMenu);
