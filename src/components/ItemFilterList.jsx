import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { useSelector, useDispatch } from 'react-redux'
import List from '@material-ui/core/List'

import { filterNameSelector } from 'selectors/filterSelectors'
import { fetchItemFilters } from 'actions/filterActions'
import {
  itemFiltersSectionItemsSelector,
  itemFiltersSectionCountsSelector,
  itemFetchingFiltersSelector,
  itemFetchedFiltersSelector,
  itemFetchFiltersErrorSelector,
} from 'selectors/itemSelectors'
import { moduleFilterSectionsSelector, moduleSupportsItemFiltersSelector } from 'selectors/moduleSelectors'
import withResize from 'hocs/WithResize'
import VirtualGroupedList from './VirtualGroupedList'
import FilterSectionHeader from './FilterSectionHeader'
import LoadingIndicator from './LoadingIndicator'

const useStyles = makeStyles((theme) => ({
  main: {
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
  },
  listSection: {
    backgroundColor: theme.palette.background.paper,
  },
}))

function SectionItem({ itemId, itemIndex, sectionIndex, style, moduleId, search, onClick }) {
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const sectionItems = useSelector((state) =>
    itemFiltersSectionItemsSelector(state, { itemId, moduleId, filterSectionId, search })
  )
  const filterId = sectionItems[itemIndex]
  const name = useSelector((state) => filterNameSelector(state, { filterId }))

  const handleClick = () => {
    onClick(filterId)
  }

  return (
    <ListItem button style={style} onClick={handleClick}>
      <ListItemText primary={name} />
    </ListItem>
  )
}

SectionItem.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  moduleId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

function Inner({ moduleId, search, width, height, itemId, onClick }) {
  const sectionCounts = useSelector((state) => itemFiltersSectionCountsSelector(state, { itemId, moduleId, search }))

  return (
    <VirtualGroupedList
      height={height}
      width={width}
      itemSize={48}
      sectionCounts={sectionCounts}
      listComponent={List}
      headerComponent={FilterSectionHeader}
      itemComponent={SectionItem}
      itemData={{ moduleId, search, itemId, onClick }}
    />
  )
}

Inner.propTypes = {
  moduleId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

const InnerWithResize = withResize(Inner)

export default function FilterList({ moduleId, itemId, onClick }) {
  const classes = useStyles()
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const fetching = useSelector((state) => itemFetchingFiltersSelector(state, { itemId }))
  const fetched = useSelector((state) => itemFetchedFiltersSelector(state, { itemId }))
  const error = useSelector((state) => itemFetchFiltersErrorSelector(state, { itemId }))
  const itemFiltersSupported = useSelector((state) => moduleSupportsItemFiltersSelector(state, { moduleId }))

  useEffect(() => {
    if (itemFiltersSupported && !fetched && !fetching) {
      dispatch(fetchItemFilters(moduleId, itemId))
    }
  }, [fetched, fetching, itemFiltersSupported, moduleId, itemId])

  const handleFilterSearchChange = (event) => {
    setSearch(event.target.value)
  }

  if (itemFiltersSupported && fetching) {
    return <LoadingIndicator size={50} />
  }

  if (itemFiltersSupported && error) {
    return <span>Error!</span>
  }

  return (
    <>
      <TextField
        id="filter"
        label="Filter items"
        fullWidth
        autoFocus
        value={search}
        onChange={handleFilterSearchChange}
        margin="dense"
      />

      <div className={classes.main}>
        <InnerWithResize moduleId={moduleId} itemId={itemId} search={search} onClick={onClick} />
      </div>
    </>
  )
}

FilterList.defaultProps = {
  onClick: () => {},
}

FilterList.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
}
