import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams] = useSearchParams()
  let filters = searchParams.get('filters') || ''
  filters = filters.split(',').filter(Boolean)

  if (filters.length === 0) {
    return null
  }

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
