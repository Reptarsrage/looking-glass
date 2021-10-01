import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search'
import { useHistory, useLocation, matchPath } from 'react-router-dom'
import Fade from '@mui/material/Fade'
import InputBase from '@mui/material/InputBase'
import { makeStyles } from '@mui/styles'

import { searchChange } from 'actions/galleryActions'
import { modalOpenSelector, drawerOpenSelector } from '../selectors/modalSelectors'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    '-webkit-app-region': 'no-drag',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  searchIconWrapper: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '16ch',
      '&:focus': {
        width: '28ch',
      },
    },
  },
}))

export default function SearchBar() {
  const classes = useStyles()
  const history = useHistory()
  const query = useQuery()
  const dispatch = useDispatch()
  const location = useLocation()
  const path = matchPath(location.pathname, { path: '/(gallery|search)/:moduleId/:galleryId' })
  const { galleryId, moduleId } = (path && path.params) || {}
  const querySearch = query.search || ''
  const [search, setSearch] = useState(querySearch)
  const disabled = !moduleId || !galleryId
  const modalOpen = useSelector(modalOpenSelector)
  const drawerOpen = useSelector(drawerOpenSelector)

  // ensure search is in parity with qs, when qs changes
  useEffect(() => {
    setSearch(querySearch)
  }, [querySearch])

  const handleInput = useCallback(
    (event) => {
      const { value } = event.target
      setSearch(value)
      dispatch(searchChange(galleryId, value, history))
    },
    [galleryId]
  )

  const handleCancel = useCallback(() => {
    setSearch('')
    dispatch(searchChange(galleryId, '', history))
  }, [galleryId])

  const handleKeyUp = useCallback(
    (e) => {
      if (e.charCode === 27 || e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleCancel]
  )

  return (
    <Fade in={moduleId && galleryId && !modalOpen && !drawerOpen} unmountOnExit>
      <div className={classes.search}>
        <div className={classes.searchIconWrapper}>
          <SearchIcon />
        </div>

        <InputBase
          className={classes.searchInput}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={handleInput}
          onKeyUp={handleKeyUp}
          disabled={disabled}
        />
      </div>
    </Fade>
  )
}
