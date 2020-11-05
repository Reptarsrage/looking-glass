import React from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import * as filterActions from 'actions/filterActions'
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

const styles = () => ({
  spacer: {
    minWidth: '360px',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
})

const ItemFilters = ({
  classes,
  itemId,
  moduleId,
  fetchItemFilters,
  itemFiltersEnabled,
  fetching,
  fetched,
  error,
  filters,
  filterSections,
  onClick,
}) => {
  React.useEffect(() => {
    if (itemFiltersEnabled && !fetched && !fetching) {
      fetchItemFilters(moduleId, itemId)
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
  filters: [],
  onClick: () => {},
  error: null,
  itemId: null,
  fetching: false,
  fetched: false,
}

ItemFilters.propTypes = {
  // Required
  itemId: PropTypes.string,
  moduleId: PropTypes.string.isRequired,

  // Optional
  onClick: PropTypes.func,

  // Selectors
  itemFiltersEnabled: PropTypes.bool.isRequired,
  fetching: PropTypes.bool,
  fetched: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.object,
  filterSections: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Actions
  fetchItemFilters: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  itemFiltersEnabled: itemFiltersEnabledSelector,
  fetching: itemFetchingFiltersSelector,
  fetched: itemFetchedFiltersSelector,
  error: itemFetchFiltersErrorSelector,
  filters: itemFiltersSelector,
  filterSections: filterBySelector,
})

const mapDispatchToProps = {
  fetchItemFilters: filterActions.fetchItemFilters,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(ItemFilters)
