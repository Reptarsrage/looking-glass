import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'

import SelectedFilter from './SelectedFilter'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
}))

export default function SelectedFilters({ galleryId }) {
  const classes = useStyles()
  const query = useQuery()
  const { filters } = query

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
