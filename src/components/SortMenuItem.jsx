import React from 'react';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { valueByIdSelector } from '../selectors/sortSelectors';
import NestedSortMenuItem from './NestedSortMenuItem';

const styles = () => ({
  icon: {
    justifyContent: 'flex-end',
  },
});

const SortMenuItem = ({ classes, value, valueId, onClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const nestedValues = value.values || [];
  const ariaId = `${valueId}-nested-sort-menu`;
  const hasNestedValues = nestedValues.length > 0;

  const handleClick = event => {
    if (hasNestedValues) {
      setAnchorEl(event.currentTarget);
    } else {
      onClick(valueId);
    }
  };

  const handleClose = id => {
    setAnchorEl(null);
    onClick(id);
  };

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={value.name} />
      {hasNestedValues && (
        <ListItemIcon className={classes.icon}>
          <ChevronRightIcon />
        </ListItemIcon>
      )}
      {hasNestedValues && (
        <Popover
          id={ariaId}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => handleClose(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List>
            {nestedValues.map(nestedValueId => (
              <NestedSortMenuItem
                key={nestedValueId}
                onClick={() => handleClose(nestedValueId)}
                valueId={nestedValueId}
              />
            ))}
          </List>
        </Popover>
      )}
    </ListItem>
  );
};

SortMenuItem.propTypes = {
  // required
  valueId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,

  // selectors
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  value: valueByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(SortMenuItem);
