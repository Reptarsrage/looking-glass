import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useNavigationType, useLocation } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { makeStyles } from '@mui/styles'
import Fade from '@mui/material/Fade'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import Fab from '@mui/material/Fab'

import { modalOpenSelector, drawerOpenSelector } from '../selectors/modalSelectors'
import { clearGallery } from '../actions/galleryActions'

const useStyles = makeStyles((theme) => ({
  navButtons: {
    display: 'inline-block',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  navButton: {
    '-webkit-app-region': 'no-drag',
  },
  back: {
    marginRight: `${theme.spacing(2)} !important`,
  },
}))

export default function NavButtons() {
  const classes = useStyles()
  const location = useLocation()
  const dispatch = useDispatch()
  const action = useNavigationType()
  const navigate = useNavigate()
  const [stack, setStack] = useState([])
  const [ptr, setPtr] = useState(-1)
  const modalOpen = useSelector(modalOpenSelector)
  const drawerOpen = useSelector(drawerOpenSelector)

  const { pathname, search } = location
  const hasBack = ptr >= 0
  const hasFwd = stack.length > 0 && ptr < stack.length - 1

  const parseGalleryIdFromPathname = (s) => {
    if (s === '/') return null
    return s.split('/').splice(-1)[0]
  }

  // handle history changes (push and pop)
  useEffect(() => {
    // add item to history stack
    if (action === 'PUSH') {
      setStack([...stack.slice(0, ptr + 1), { pathname, search }])
      setPtr(ptr + 1)
    }
  }, [pathname, search])

  const handleBack = useCallback(() => {
    const galleryId = parseGalleryIdFromPathname(stack[ptr].pathname)
    const nextGalleryId = ptr === 0 ? null : parseGalleryIdFromPathname(stack[ptr - 1].pathname)
    if (galleryId === nextGalleryId) {
      dispatch(clearGallery(galleryId))
    }

    setPtr(ptr - 1)
    navigate(-1)
  }, [stack, ptr])

  const handleForward = useCallback(() => {
    const galleryId = ptr === -1 ? null : parseGalleryIdFromPathname(stack[ptr].pathname)
    const nextGalleryId = parseGalleryIdFromPathname(stack[ptr + 1].pathname)
    if (galleryId === nextGalleryId) {
      dispatch(clearGallery(galleryId))
    }

    setPtr(ptr + 1)
    navigate(1)
  }, [stack, ptr])

  return (
    <Fade in={!modalOpen && !drawerOpen} unmountOnExit>
      <span className={classes.navButtons}>
        <Fab
          size="small"
          color="primary"
          className={clsx(classes.navButton, classes.back)}
          onClick={handleBack}
          disabled={!hasBack}
        >
          <ChevronLeftIcon />
        </Fab>

        <Fab size="small" color="primary" className={classes.navButton} onClick={handleForward} disabled={!hasFwd}>
          <ChevronRightIcon />
        </Fab>
      </span>
    </Fade>
  )
}
