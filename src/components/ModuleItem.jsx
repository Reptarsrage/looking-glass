import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import {
  moduleNameSelector,
  moduleDescriptionSelector,
  moduleDefaultGalleryIdSelector,
  moduleIconSelector,
} from 'selectors/moduleSelectors'

const useStyles = makeStyles((theme) => ({
  item: {
    color: theme.palette.text.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

export default function ModuleItem({ moduleId }) {
  const classes = useStyles()
  const defaultGalleryId = useSelector((state) => moduleDefaultGalleryIdSelector(state, { moduleId }))
  const name = useSelector((state) => moduleNameSelector(state, { moduleId }))
  const icon = useSelector((state) => moduleIconSelector(state, { moduleId }))
  const description = useSelector((state) => moduleDescriptionSelector(state, { moduleId }))

  return (
    <ListItem button component={RouterLink} to={`/gallery/${moduleId}/${defaultGalleryId}`} className={classes.item}>
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
