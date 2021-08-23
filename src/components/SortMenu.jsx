import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import SortIcon from '@material-ui/icons/Sort'

import { sortChange } from 'actions/galleryActions'
import { moduleSupportsSortingSelector } from 'selectors/moduleSelectors'
import { moduleValuesSelector } from 'selectors/sortSelectors'
import SortMenuItem from './SortMenuItem'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}))

export default function SortMenu({ moduleId, galleryId }) {
  const classes = useStyles()
  const query = useQuery()
  const history = useHistory()
  const { search } = query
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const sortValues = useSelector((state) => moduleValuesSelector(state, { moduleId, galleryId, search }))
  const moduleSupportsSorting = useSelector((state) => moduleSupportsSortingSelector(state, { moduleId }))

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (valueId) => {
    if (valueId) {
      dispatch(sortChange(galleryId, valueId, history))
    }

    setAnchorEl(null)
  }

  if (!moduleSupportsSorting || sortValues.length === 0) {
    return null
  }

  const ariaId = `${moduleId}-sort-menu`
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
          {sortValues.map((valueId) => (
            <SortMenuItem
              key={valueId}
              moduleId={moduleId}
              galleryId={galleryId}
              valueId={valueId}
              onClick={handleClose}
            />
          ))}
        </List>
      </Popover>
    </>
  )
}

SortMenu.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
}
