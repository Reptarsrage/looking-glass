import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import {
  moduleNameSelector,
  moduleDescriptionSelector,
  moduleDefaultGalleryIdSelector,
  moduleIconSelector,
} from 'selectors/moduleSelectors'

export default function ModuleItem({ moduleId }) {
  const defaultGalleryId = useSelector((state) => moduleDefaultGalleryIdSelector(state, { moduleId }))
  const name = useSelector((state) => moduleNameSelector(state, { moduleId }))
  const icon = useSelector((state) => moduleIconSelector(state, { moduleId }))
  const description = useSelector((state) => moduleDescriptionSelector(state, { moduleId }))

  return (
    <ListItem button component={RouterLink} to={`/gallery/${moduleId}/${defaultGalleryId}`}>
      <ListItemAvatar>
        <Avatar alt={name} src={icon} />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={description} />
    </ListItem>
  )
}

ModuleItem.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
}
