import React from 'react'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { valueByIdSelector, valueIsCurrentlySelectedSelector } from '../selectors/sortSelectors'
import NestedSortMenuItem from './NestedSortMenuItem'

const styles = () => ({
  icon: {
    justifyContent: 'flex-end',
  },
  secondIcon: {
    marginLeft: '-20px',
  },
})

const SortMenuItem = ({ classes, value, valueId, onClick, valueIsCurrentlySelected, galleryId, moduleId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const nestedValues = value.values || []
  const ariaId = `${valueId}-nested-sort-menu`
  const hasNestedValues = nestedValues.length > 0

  const handleClick = (event) => {
    if (hasNestedValues) {
      setAnchorEl(event.currentTarget)
    } else {
      onClick(valueId)
    }
  }

  const handleClose = (id) => {
    setAnchorEl(null)
    onClick(id)
  }

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={value.name} />
      {valueIsCurrentlySelected && (
        <ListItemIcon className={classes.icon}>
          <CheckIcon color="primary" />
        </ListItemIcon>
      )}

      {hasNestedValues && (
        <ListItemIcon className={clsx(classes.icon, valueIsCurrentlySelected ? classes.secondIcon : undefined)}>
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
            {nestedValues.map((nestedValueId) => (
              <NestedSortMenuItem
                key={nestedValueId}
                onClick={() => handleClose(nestedValueId)}
                valueId={nestedValueId}
                moduleId={moduleId}
                galleryId={galleryId}
              />
            ))}
          </List>
        </Popover>
      )}
    </ListItem>
  )
}

SortMenuItem.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,

  // selectors
  valueIsCurrentlySelected: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  value: valueByIdSelector,
  valueIsCurrentlySelected: valueIsCurrentlySelectedSelector,
})

export default compose(connect(mapStateToProps), withStyles(styles))(SortMenuItem)
