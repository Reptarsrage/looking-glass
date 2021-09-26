import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@material-ui/icons/Search'
import { useHistory, useLocation, matchPath } from 'react-router-dom'
import Fade from '@material-ui/core/Fade'
import { styled, alpha } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'

import { searchChange } from 'actions/galleryActions'
import { modalOpenSelector, drawerOpenSelector } from '../selectors/modalSelectors'
import useQuery from '../hooks/useQuery'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  '-webkit-app-region': 'no-drag',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: 'auto',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
}))

export default function SearchBar() {
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

  const handleInput = React.useCallback(
    (event) => {
      const { value } = event.target
      setSearch(value)
      dispatch(searchChange(galleryId, value, history))
    },
    [galleryId]
  )

  const handleCancel = React.useCallback(() => {
    setSearch('')
    dispatch(searchChange(galleryId, '', history))
  }, [galleryId])

  const handleKeyUp = React.useCallback(
    (e) => {
      if (e.charCode === 27 || e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleCancel]
  )

  return (
    <Fade in={moduleId && galleryId && !modalOpen && !drawerOpen} unmountOnExit>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={handleInput}
          onKeyUp={handleKeyUp}
          disabled={disabled}
        />
      </Search>
    </Fade>
  )
}
