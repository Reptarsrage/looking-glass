import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { galleryFiltersSelector } from 'selectors/gallerySelectors'
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
  const filters = useSelector((state) => galleryFiltersSelector(state, { galleryId }))

  return (
    <div className={classes.filtersContainer}>
      {filters.map((filterId) => (
        <SelectedFilter key={filterId} filterId={filterId} galleryId={galleryId} />
      ))}
    </div>
  )
}

SelectedFilters.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
}
