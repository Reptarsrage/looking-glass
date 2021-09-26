import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/styles'
import Fade from '@material-ui/core/Fade'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'

import { modalOpenSelector, drawerOpenSelector } from '../selectors/modalSelectors'
import { clearGallery } from '../actions/galleryActions'

const useStyles = makeStyles((theme) => ({
  navButtons: {
    display: 'inline-block',
  },
  navButton: {
    '-webkit-app-region': 'no-drag',
  },
  back: {
    marginRight: theme.spacing(0.5),
  },
}))

export default function NavButtons() {
  const classes = useStyles()
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [stack, setStack] = useState([])
  const [ptr, setPtr] = useState(-1)
  const modalOpen = useSelector(modalOpenSelector)
  const drawerOpen = useSelector(drawerOpenSelector)

  const { action } = history
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

  const handleBack = () => {
    const galleryId = parseGalleryIdFromPathname(stack[ptr].pathname)
    const nextGalleryId = ptr === 0 ? null : parseGalleryIdFromPathname(stack[ptr - 1].pathname)
    if (galleryId === nextGalleryId) {
      dispatch(clearGallery(galleryId))
    }

    setPtr(ptr - 1)
    history.goBack()
  }

  const handleForward = () => {
    const galleryId = ptr === -1 ? null : parseGalleryIdFromPathname(stack[ptr].pathname)
    const nextGalleryId = parseGalleryIdFromPathname(stack[ptr + 1].pathname)
    if (galleryId === nextGalleryId) {
      dispatch(clearGallery(galleryId))
    }

    setPtr(ptr + 1)
    history.goForward()
  }

  return (
    <Fade in={!modalOpen && !drawerOpen} unmountOnExit>
      <span className={classes.navButtons}>
        <IconButton className={clsx(classes.navButton, classes.back)} onClick={handleBack} disabled={!hasBack}>
          <ChevronLeftIcon />
        </IconButton>

        <IconButton className={classes.navButton} onClick={handleForward} disabled={!hasFwd}>
          <ChevronRightIcon />
        </IconButton>
      </span>
    </Fade>
  )
}
