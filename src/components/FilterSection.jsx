import React, { useEffect } from 'react'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { withStyles } from '@material-ui/core/styles'

import { filterSectionByIdSelector, filterSectionValuesSearchSelector } from '../selectors/filterSectionSelectors'
import * as filterActions from '../actions/filterActions'
import FilterValue from './FilterValue'
import LoadingIndicator from './LoadingIndicator'

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
})

const FilterSection = ({ filterSection, filterSectionId, fetchFilters, classes, onClick, filterValues }) => {
  const { fetching, fetched, error, name } = filterSection

  useEffect(() => {
    if (!fetching && !fetched) {
      fetchFilters(filterSectionId)
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
  onClick: null,
  search: null,
}

FilterSection.propTypes = {
  // Required
  filterSectionId: PropTypes.string.isRequired,

  // Optional
  // eslint-disable-next-line react/no-unused-prop-types
  search: PropTypes.string,
  onClick: PropTypes.func,

  // Selectors
  filterValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterSection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    error: PropTypes.object,
  }).isRequired,

  // Actions
  fetchFilters: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  filterSection: filterSectionByIdSelector,
  filterValues: filterSectionValuesSearchSelector,
})

const mapDispatchToProps = {
  fetchFilters: filterActions.fetchFilters,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(FilterSection)
