import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { currentFilterSelector } from 'selectors/gallerySelectors'
import SelectedFilter from './SelectedFilter'

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
}))

export default function SelectedFilters({ galleryId }) {
  const classes = useStyles()
  const currentFilter = useSelector((state) => currentFilterSelector(state, { galleryId }))

  return (
    currentFilter && (
      <div className={classes.filtersContainer}>
        <SelectedFilter filterId={currentFilter} galleryId={galleryId} />
      </div>
    )
  )
}

SelectedFilters.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
}
