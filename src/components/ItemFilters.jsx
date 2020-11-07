import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import { fetchItemFilters } from 'actions/filterActions'
import { itemFiltersEnabledSelector, filterBySelector } from 'selectors/moduleSelectors'
import {
  itemFetchingFiltersSelector,
  itemFetchedFiltersSelector,
  itemFetchFiltersErrorSelector,
  itemFiltersSelector,
} from 'selectors/itemSelectors'
import NoResults from './NoResults'
import ItemFiltersSection from './ItemFiltersSection'
import LoadingIndicator from './LoadingIndicator'

const useStyles = makeStyles(() => ({
  spacer: {
    minWidth: '360px',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
}))

export default function ItemFilters({ itemId, moduleId, onClick }) {
  const classes = useStyles()
  const itemFiltersEnabled = useSelector((state) => itemFiltersEnabledSelector(state, { moduleId }))
  const fetching = useSelector((state) => itemFetchingFiltersSelector(state, { itemId }))
  const fetched = useSelector((state) => itemFetchedFiltersSelector(state, { itemId }))
  const error = useSelector((state) => itemFetchFiltersErrorSelector(state, { itemId }))
  const filters = useSelector((state) => itemFiltersSelector(state, { itemId }))
  const filterSections = useSelector((state) => filterBySelector(state, { moduleId }))
  const dispatch = useDispatch()

  useEffect(() => {
    if (itemFiltersEnabled && !fetched && !fetching) {
      dispatch(fetchItemFilters(moduleId, itemId))
    }
  }, [])

  if (itemFiltersEnabled && fetching) {
    return (
      <div className={classes.spacer}>
        <LoadingIndicator />
      </div>
    )
  }

  if (error || (fetched && filters.length === 0) || (!itemFiltersEnabled && filters.length === 0)) {
    return (
      <div className={classes.spacer}>
        <NoResults />
      </div>
    )
  }

  return (
    <div className={classes.spacer}>
      {filterSections
        .map((filterSectionId) => (
          <ItemFiltersSection
            key={filterSectionId}
            onClick={onClick}
            filterSectionId={filterSectionId}
            itemId={itemId}
          />
        ))
        .reduce((p, c) => [...p, <Divider key={`${c.key}-divider`} />, c], [])}
    </div>
  )
}

ItemFilters.defaultProps = {
  onClick: () => {},
}

ItemFilters.propTypes = {
  // Required
  itemId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,
}
