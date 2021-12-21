import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import List from '@mui/material/List'

import { filterNameSelector } from 'selectors/filterSelectors'
import { fetchFilters } from 'actions/filterActions'
import {
  sectionCountsSelector,
  sectionItemsSelector,
  filtersFetchingSelector,
  filtersFetchedSelector,
  filtersErrorSelector,
  sectionItemIdsSelector,
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

function SectionItem({ itemIndex, sectionIndex, style, moduleId, search, onClick, active }) {
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const sectionItems = useSelector((state) => sectionItemsSelector(state, { moduleId, filterSectionId, search }))
  const filterId = sectionItems[itemIndex]
  const name = useSelector((state) => filterNameSelector(state, { filterId }))

  const handleClick = useCallback(() => {
    onClick(filterId)
  }, [filterId, onClick])

  return (
    <ListItem button selected={active} style={style} onClick={handleClick}>
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
  active: PropTypes.bool.isRequired,
}

function Inner({ moduleId, search, width, height, onClick, active }) {
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
      active={active}
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
  active: PropTypes.number.isRequired,
}

const InnerWithResize = withResize(Inner)

export default function FilterList({ moduleId, onClick }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const fetching = useSelector((state) => filtersFetchingSelector(state, { moduleId }))
  const fetched = useSelector((state) => filtersFetchedSelector(state, { moduleId }))
  const error = useSelector((state) => filtersErrorSelector(state, { moduleId }))
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(-1)
  const filterIds = useSelector((state) => sectionItemIdsSelector(state, { moduleId, search }))

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    if (!fetched && !fetching) {
      dispatch(fetchFilters(moduleId))
    }
  }, [fetched, fetching, moduleId])

  useEffect(() => {
    setActive(-1)
  }, [filterIds])

  const handleFilterSearchChange = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const handleKeyDown = (event) => {
    if (event.keyCode === 38 && active > 0) {
      // ↑
      setActive(active - 1)
    } else if (event.keyCode === 40 && active < filterIds.length - 1) {
      // ↓
      setActive(active + 1)
    } else if (event.keyCode === 13 && active >= 0) {
      // enter
      onClick(filterIds[active])
    }

    event.preventDefault()
    event.stopPropagation()
  }

  if (fetching) {
    return <LoadingIndicator size={50} />
  }

  if (error) {
    return <span>Error!</span>
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
        <InnerWithResize moduleId={moduleId} search={search} onClick={onClick} active={active} />
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
