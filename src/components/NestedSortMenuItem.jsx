import React, { useCallback } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CheckIcon from '@mui/icons-material/Check'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import { useSearchParams } from 'react-router-dom'

import { valueNameSelector, valueIsCurrentlySelectedSelector } from 'selectors/sortSelectors'

const useStyles = makeStyles(() => ({
  icon: {
    justifyContent: 'flex-end',
  },
}))

export default function NestedSortMenuItem({ moduleId, galleryId, valueId, onClick }) {
  const classes = useStyles()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  const name = useSelector((state) => valueNameSelector(state, { valueId, galleryId }))
  const valueIsCurrentlySelected = useSelector((state) =>
    valueIsCurrentlySelectedSelector(state, { valueId, moduleId, galleryId, sort, search })
  )

  const handleClick = useCallback(() => {
    onClick(valueId)
  }, [onClick, valueId])

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={name} />
      {valueIsCurrentlySelected && (
        <ListItemIcon className={classes.icon}>
          <CheckIcon color="primary" />
        </ListItemIcon>
      )}
    </ListItem>
  )
}

NestedSortMenuItem.defaultProps = {
  onClick: () => {},
}

NestedSortMenuItem.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
}
