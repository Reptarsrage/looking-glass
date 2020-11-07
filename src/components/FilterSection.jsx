import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles'

import { filterSectionByIdSelector, filterSectionValuesSearchSelector } from 'selectors/filterSectionSelectors'
import { fetchFilters } from 'actions/filterActions'
import FilterValue from './FilterValue'
import LoadingIndicator from './LoadingIndicator'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function FilterSection({ filterSectionId, onClick }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const filterSection = useSelector((state) => filterSectionByIdSelector(state, { filterSectionId }))
  const filterValues = useSelector((state) => filterSectionValuesSearchSelector(state, { filterSectionId }))

  const { fetching, fetched, error, name } = filterSection

  useEffect(() => {
    if (!fetching && !fetched) {
      dispatch(fetchFilters(filterSectionId))
    }
  })

  if (fetching) {
    return <LoadingIndicator size={50} />
  }

  if (error) {
    return <span>Error!</span>
  }

  if (fetched && filterValues.length === 0) {
    return null
  }

  return (
    <List className={classes.root} subheader={<ListSubheader>{name}</ListSubheader>}>
      {filterValues.map((filterId) => (
        <FilterValue key={filterId} filterId={filterId} onClick={onClick} />
      ))}
    </List>
  )
}

FilterSection.defaultProps = {
  onClick: () => {},
}

FilterSection.propTypes = {
  // Required
  filterSectionId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,
}
