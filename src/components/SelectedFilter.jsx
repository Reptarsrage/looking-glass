import React from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import { filterSelector } from 'selectors/filterSelectors'
import { filterRemoved } from 'actions/galleryActions'

const useStyles = makeStyles((theme) => ({
  filterItem: {
    margin: theme.spacing(0.5),
  },
}))

export default function SelectedFilter({ galleryId, filterId }) {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const filter = useSelector((state) => filterSelector(state, { filterId }))

  const onDelete = () => {
    dispatch(filterRemoved(galleryId, filterId, history))
  }

  return <Chip className={classes.filterItem} color="primary" label={filter.name} onDelete={onDelete} />
}

SelectedFilter.propTypes = {
  // required
  filterId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
}
