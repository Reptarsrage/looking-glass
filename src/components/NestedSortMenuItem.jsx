import React from 'react'
import { compose } from 'redux'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckIcon from '@material-ui/icons/Check'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { valueByIdSelector, valueIsCurrentlySelectedSelector } from 'selectors/sortSelectors'

const styles = () => ({
  icon: {
    justifyContent: 'flex-end',
  },
})

const NestedSortMenuItem = ({ classes, value, onClick, valueIsCurrentlySelected }) => (
  <ListItem button onClick={onClick}>
    <ListItemText primary={value.name} />
    {valueIsCurrentlySelected && (
      <ListItemIcon className={classes.icon}>
        <CheckIcon color="primary" />
      </ListItemIcon>
    )}
  </ListItem>
)

NestedSortMenuItem.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  galleryId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  valueId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  onClick: PropTypes.func.isRequired,

  // selectors
  valueIsCurrentlySelected: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  value: valueByIdSelector,
  valueIsCurrentlySelected: valueIsCurrentlySelectedSelector,
})

export default compose(connect(mapStateToProps), withStyles(styles))(NestedSortMenuItem)
