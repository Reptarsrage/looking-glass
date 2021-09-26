import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import { useHistory, useLocation, matchPath } from 'react-router-dom'
import clsx from 'clsx'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'

import { searchChange } from 'actions/galleryActions'
import { modalOpenSelector, drawerOpenSelector } from '../selectors/modalSelectors'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    '-webkit-app-region': 'no-drag',
    marginLeft: theme.spacing(2),
  },
  iconButton: {
    color: theme.palette.action.active,
    transform: 'scale(1, 1)',
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  iconButtonHidden: {
    transform: 'scale(0, 0)',
    '& > $icon': {
      opacity: 0,
    },
  },
  searchIconButton: {
    marginRight: theme.spacing(-6),
  },
  icon: {
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  input: {
    width: '100%',
  },
  searchContainer: {
    margin: 'auto 16px',
    width: `calc(100% - ${theme.spacing(6 + 4)}px)`, // 6 button + 4 margin
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
      <Paper className={classes.root}>
        <div className={classes.searchContainer}>
          <Input
            value={search}
            onChange={handleInput}
            onKeyUp={handleKeyUp}
            fullWidth
            className={classes.input}
            disableUnderline
            disabled={disabled}
          />
        </div>
        <IconButton
          className={clsx(classes.iconButton, classes.searchIconButton, {
            [classes.iconButtonHidden]: search !== '',
          })}
          disabled={disabled}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          onClick={handleCancel}
          className={clsx(classes.iconButton, {
            [classes.iconButtonHidden]: search === '',
          })}
          disabled={disabled}
        >
          <ClearIcon />
        </IconButton>
      </Paper>
    </Fade>
  )
}
