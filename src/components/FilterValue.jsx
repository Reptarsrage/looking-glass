import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'

import { filterByIdSelector } from 'selectors/filterSelectors'

const useStyles = makeStyles(() => ({
  listItem: {
    textTransform: 'capitalize',
  },
}))

export default function FilterValue({ filterId, onClick }) {
  const classes = useStyles()
  const filter = useSelector((state) => filterByIdSelector(state, { filterId }))

  const handleClick = () => {
    onClick(filterId)
  }

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText className={classes.listItem} primary={filter.name} />
    </ListItem>
  )
}

FilterValue.defaultProps = {
  onClick: () => {},
}

FilterValue.propTypes = {
  // Required
  filterId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,
}
