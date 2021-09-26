import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { useDispatch, useSelector } from 'react-redux'
import List from '@material-ui/core/List'

import { filterNameSelector } from 'selectors/filterSelectors'
import { fetchFilters } from 'actions/filterActions'
import {
  sectionCountsSelector,
  sectionItemsSelector,
  filtersFetchingSelector,
  filtersFetchedSelector,
  filtersErrorSelector,
} from 'selectors/filterSectionSelectors'
import { moduleFilterSectionsSelector } from 'selectors/moduleSelectors'
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

function SectionItem({ itemIndex, sectionIndex, style, moduleId, search, onClick }) {
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const sectionItems = useSelector((state) => sectionItemsSelector(state, { moduleId, filterSectionId, search }))
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
  search: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

function Inner({ moduleId, search, width, height, onClick }) {
  const sectionCounts = useSelector((state) => sectionCountsSelector(state, { moduleId, search }))

  return (
    <VirtualGroupedList
      height={height}
      width={width}
      itemSize={48}
      sectionCounts={sectionCounts}
      listComponent={List}
      headerComponent={FilterSectionHeader}
      itemComponent={SectionItem}
      itemData={{ moduleId, search, onClick }}
    />
  )
}

Inner.propTypes = {
  moduleId: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

const InnerWithResize = withResize(Inner)

export default function FilterList({ moduleId, onClick }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const fetching = useSelector((state) => filtersFetchingSelector(state, { moduleId }))
  const fetched = useSelector((state) => filtersFetchedSelector(state, { moduleId }))
  const error = useSelector((state) => filtersErrorSelector(state, { moduleId }))
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!fetched && !fetching) {
      dispatch(fetchFilters(moduleId))
    }
  }, [fetched, fetching, moduleId])

  const handleFilterSearchChange = (event) => {
    setSearch(event.target.value)
  }

  if (fetching) {
    return <LoadingIndicator size={50} />
  }

  if (error) {
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
        variant="standard"
      />

      <div className={classes.main}>
        <InnerWithResize moduleId={moduleId} search={search} onClick={onClick} />
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

  // optional
  onClick: PropTypes.func,
}
