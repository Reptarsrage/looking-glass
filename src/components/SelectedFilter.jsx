import React from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { filterSelector } from 'selectors/filterSelectors'
import { filterChange } from 'actions/galleryActions'

const useStyles = makeStyles((theme) => ({
  filterItem: {
    margin: theme.spacing(0.5),
  },
}))

export default function SelectedFilter({ galleryId, filterId }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const filter = useSelector((state) => filterSelector(state, { filterId }))

  const onDelete = () => {
    dispatch(filterChange(galleryId, null))
  }

  return <Chip className={classes.filterItem} color="primary" label={filter.name} onDelete={onDelete} />
}

SelectedFilter.propTypes = {
  // required
  filterId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
}
