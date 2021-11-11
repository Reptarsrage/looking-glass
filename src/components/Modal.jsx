import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import Fade from '@mui/material/Fade'
import Zoom from '@mui/material/Zoom'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import Backdrop from '@mui/material/Backdrop'
import Drawer from '@mui/material/Drawer'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Link from '@mui/material/Link'
import clsx from 'clsx'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import moment from 'moment'

import {
  modalOpenSelector,
  modalBoundsSelector,
  modalItemSelector,
  modalItemHasFiltersSelector,
} from 'selectors/modalSelectors'
import { moduleDefaultGalleryIdSelector, moduleSupportsItemFiltersSelector } from 'selectors/moduleSelectors'
import { modalClose, modalClear } from 'actions/modalActions'
import { filterAdded } from 'actions/galleryActions'
import ModalTransitionContainer from './ModalTransitionContainer'
import ItemFilterList from './ItemFilterList'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    height: '100%',
    width: '100%',
    top: '30px', // titleBar height
    left: 0,
    zIndex: theme.zIndex.drawer - 4,
    backgroundColor: 'rgba(0,0,0,1) !important',
  },
  drawer: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    minWidth: '360px',
    height: 'calc(100% - 30px)',
    zIndex: theme.zIndex.drawer,
  },
  button: {
    top: '46px', // 16 + titleBar height
    right: '16px',
    position: 'fixed !important',
    zIndex: theme.zIndex.drawer - 1,
  },
  menuButton: {
    top: '116px',
  },
  caption: {
    position: 'fixed',
    top: '30px', // titleBar height
    left: 0,
    right: 0,
    background: 'linear-gradient(#000, transparent)',
    color: theme.palette.grey[50],
    zIndex: theme.zIndex.drawer - 2,
    padding: theme.spacing(1),
    paddingLeft: '88px',
  },
  subCaption: {
    color: theme.palette.grey[400],
  },
  title: {
    minHeight: '1em',
  },
  toggleCaption: {
    left: '16px',
    right: 'unset',
  },
  link: {
    cursor: 'pointer',
  },
  dark: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.32)',
    },
  },
  author: {
    textTransform: 'capitalize',
  },
}))

export default function Modal({ moduleId }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [animating, setAnimating] = useState(true)
  const [showCaption, setShowCaption] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const modalItem = useSelector(modalItemSelector)
  const modalOpen = useSelector(modalOpenSelector)
  const modalBounds = useSelector(modalBoundsSelector)
  const defaultGalleryId = useSelector((state) => moduleDefaultGalleryIdSelector(state, { moduleId }))
  const modalItemHasFilters = useSelector(modalItemHasFiltersSelector)
  const supportsItemFilters = useSelector((state) => moduleSupportsItemFiltersSelector(state, { moduleId }))

  const handleAnimationComplete = useCallback(() => {
    if (!modalOpen) {
      dispatch(modalClear())
    }
  }, [modalOpen])

  const close = useCallback(() => {
    dispatch(modalClose())
  }, [])

  const drawerOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const toggleCaption = useCallback(() => {
    setShowCaption((prevValue) => !prevValue)
  }, [])

  const drawerClose = useCallback(
    (filterId) => {
      setOpen(false)

      if (filterId) {
        dispatch(filterAdded(defaultGalleryId, filterId, navigate, location, searchParams))
      }
    },
    [defaultGalleryId, searchParams]
  )

  const onAnimationStart = useCallback(() => {
    setAnimating(true)
  }, [])

  const handleAuthorClick = useCallback(() => {
    dispatch(filterAdded(defaultGalleryId, modalItem.author.id, navigate, location, searchParams, true))
  }, [defaultGalleryId, modalItem, searchParams])

  const handleSourceClick = useCallback(() => {
    dispatch(filterAdded(defaultGalleryId, modalItem.source.id, navigate, location, searchParams, true))
  }, [defaultGalleryId, modalItem, searchParams])

  const onAnimationComplete = useCallback(() => {
    setAnimating(false)
  }, [])

  let initial = false
  if (modalBounds) {
    const { top, left, width, height } = modalBounds
    initial = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  const renderFilters = supportsItemFilters || modalItemHasFilters
  const author = modalItem.author || {}
  const source = modalItem.source || {}
  const subCaption = [
    author.name && (
      <span key="author">
        by{' '}
        <Link className={clsx(classes.link, classes.author)} role="button" onClick={handleAuthorClick}>
          {author.name}
        </Link>
      </span>
    ),
    source.name && (
      <span key="source">
        to{' '}
        <Link className={classes.link} role="button" onClick={handleSourceClick}>
          {source.name}
        </Link>
      </span>
    ),
    modalItem.date && <span key="date">on {moment.utc(modalItem.date).local().format('LLL')}</span>,
  ]
    .filter(Boolean)
    .reduce((prev, curr) => [prev, ' ', curr], [])

  return (
    <>
      <Fade in={modalOpen} unmountOnExit>
        <Fab
          className={clsx(classes.button, classes.toggleCaption, !showCaption && classes.dark)}
          onClick={toggleCaption}
        >
          {showCaption ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </Fab>
      </Fade>

      {showCaption && (
        <Fade in={modalOpen} unmountOnExit>
          <div className={classes.caption}>
            <Typography variant="h4" className={classes.title}>
              {modalItem.name}
            </Typography>
            <Typography className={classes.subCaption} variant="subtitle1">
              {subCaption}
            </Typography>
            {modalItem.description && (
              <Typography className={classes.subCaption} variant="subtitle1">
                {modalItem.description}
              </Typography>
            )}
          </div>
        </Fade>
      )}

      <Backdrop className={classes.backdrop} open={modalOpen} unmountOnExit />

      <Zoom in={modalOpen} unmountOnExit>
        <Fab color="default" aria-label="Close" className={classes.button} onClick={close}>
          <CloseIcon />
        </Fab>
      </Zoom>

      {renderFilters && (
        <Zoom in={modalOpen} unmountOnExit>
          <Fab color="default" className={clsx(classes.button, classes.menuButton)} onClick={drawerOpen}>
            <MenuIcon />
          </Fab>
        </Zoom>
      )}

      <Drawer classes={{ paper: classes.drawer }} anchor="right" open={open} onClose={() => drawerClose()}>
        {modalItem.id && <ItemFilterList moduleId={moduleId} itemId={modalItem.id} onClick={drawerClose} />}
      </Drawer>

      {modalItem && modalItem.id && (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
          {modalOpen && (
            <ModalTransitionContainer
              animating={animating}
              initial={initial}
              onAnimationStart={onAnimationStart}
              onAnimationComplete={onAnimationComplete}
            />
          )}
        </AnimatePresence>
      )}
    </>
  )
}

Modal.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
}
