import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Chip from '@mui/material/Chip'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
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

  const onDelete = useCallback(() => {
    dispatch(filterRemoved(galleryId, filterId, history))
  }, [galleryId, filterId])

  return <Chip className={classes.filterItem} color="primary" label={filter.name} onDelete={onDelete} />
}

SelectedFilter.propTypes = {
  // required
  filterId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
}
