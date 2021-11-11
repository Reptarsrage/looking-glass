import React, { useState, useCallback } from 'react'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import CheckIcon from '@mui/icons-material/Check'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useSearchParams } from 'react-router-dom'

import { valueSelector, valueIsCurrentlySelectedSelector, nestedSelector } from 'selectors/sortSelectors'
import NestedSortMenuItem from './NestedSortMenuItem'

const useStyles = makeStyles(() => ({
  icon: {
    justifyContent: 'flex-end',
  },
  secondIcon: {
    marginLeft: '-20px',
  },
}))

export default function SortMenuItem({ onClick, valueId, galleryId, moduleId }) {
  const classes = useStyles()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  const value = useSelector((state) => valueSelector(state, { valueId, galleryId }))
  const nestedValues = useSelector((state) => nestedSelector(state, { valueId, galleryId, search }))
  const valueIsCurrentlySelected = useSelector((state) =>
    valueIsCurrentlySelectedSelector(state, { valueId, moduleId, galleryId, sort, search })
  )

  const [anchorEl, setAnchorEl] = useState(null)
  const ariaId = `${valueId}-nested-sort-menu`
  const hasNestedValues = Array.isArray(nestedValues) && nestedValues.length > 0

  const handleClick = useCallback(
    (event) => {
      if (hasNestedValues) {
        setAnchorEl(event.currentTarget)
      } else {
        onClick(valueId)
      }
    },
    [valueId, hasNestedValues, onClick]
  )

  const handleClose = useCallback(
    (id) => {
      setAnchorEl(null)
      onClick(id)
    },
    [onClick]
  )

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
                onClick={handleClose}
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

SortMenuItem.defaultProps = {
  onClick: () => {},
}

SortMenuItem.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
}
