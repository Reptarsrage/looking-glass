import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CheckIcon from '@mui/icons-material/Check'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'

import { valueNameSelector, valueIsCurrentlySelectedSelector } from 'selectors/sortSelectors'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles(() => ({
  icon: {
    justifyContent: 'flex-end',
  },
}))

export default function NestedSortMenuItem({ moduleId, galleryId, valueId, onClick }) {
  const classes = useStyles()
  const query = useQuery()
  const { search, sort } = query
  const name = useSelector((state) => valueNameSelector(state, { valueId, galleryId }))
  const valueIsCurrentlySelected = useSelector((state) =>
    valueIsCurrentlySelectedSelector(state, { valueId, moduleId, galleryId, sort, search })
  )

  return (
    <ListItem button onClick={onClick}>
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
