import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'

import { moduleByIdSelector } from '../selectors/moduleSelectors'

const styles = () => ({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const ModuleItem = ({ moduleId, module }) => {
  const history = useHistory()
  const go = () => {
    history.push(`/gallery/${moduleId}/${module.defaultGalleryId}`)
  }

  return (
    <ListItem button onClick={go}>
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

  // selectors
  module: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    defaultGalleryId: PropTypes.string.isRequired,
  }).isRequired,
}

const mapStateToProps = createStructuredSelector({
  module: moduleByIdSelector,
})

export default compose(connect(mapStateToProps), withStyles(styles))(ModuleItem)
