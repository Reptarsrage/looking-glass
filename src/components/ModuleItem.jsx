import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import { moduleSelector } from 'selectors/moduleSelectors'

export default function ModuleItem({ moduleId }) {
  const module = useSelector((state) => moduleSelector(state, { moduleId }))

  return (
    <ListItem button component={RouterLink} to={`/gallery/${moduleId}/${module.defaultGalleryId}`}>
      <ListItemAvatar>
        <Avatar alt={module.title} src={module.icon} />
      </ListItemAvatar>
      <ListItemText primary={module.title} secondary={module.description} />
    </ListItem>
  )
}

ModuleItem.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
}
