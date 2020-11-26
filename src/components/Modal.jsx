import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Zoom from '@material-ui/core/Zoom'
import CloseIcon from '@material-ui/icons/Close'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import Backdrop from '@material-ui/core/Backdrop'
import Drawer from '@material-ui/core/Drawer'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'

import {
  modalOpenSelector,
  modalBoundsSelector,
  modalItemSelector,
  modalItemHasFiltersSelector,
} from 'selectors/modalSelectors'
import { moduleDefaultGalleryIdSelector, moduleSupportsItemFiltersSelector } from 'selectors/moduleSelectors'
import { modalClose, modalClear } from 'actions/modalActions'
import { filterChange } from 'actions/galleryActions'
import ModalTransitionContainer from './ModalTransitionContainer'
import ItemFilterList from './ItemFilterList'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: '30px', // titleBar height
    left: 0,
    zIndex: theme.zIndex.drawer + 1,
    background: 'rgba(0,0,0,1)',
  },
  drawer: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    minWidth: '360px',
    height: 'calc(100% - 30px)',
  },
  button: {
    top: '46px', // 16 + titleBar height
    right: '16px',
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 5,
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
    zIndex: theme.zIndex.drawer + 4,
    padding: theme.spacing(1),
  },
  toggleCaption: {
    position: 'fixed',
    top: '30px', // titleBar height
    left: 0,
    background: 'rgba(0,0,0,1)',
    color: '#fff',
    zIndex: theme.zIndex.drawer + 5,
    margin: theme.spacing(1),
  },
}))

export default function Modal({ moduleId }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [animating, setAnimating] = useState(true)
  const [showCaption, setShowCaption] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()
  const modalItem = useSelector(modalItemSelector)
  const modalOpen = useSelector(modalOpenSelector)
  const modalBounds = useSelector(modalBoundsSelector)
  const defaultGalleryId = useSelector((state) => moduleDefaultGalleryIdSelector(state, { moduleId }))
  const modalItemHasFilters = useSelector(modalItemHasFiltersSelector)
  const supportsItemFilters = useSelector((state) => moduleSupportsItemFiltersSelector(state, { moduleId }))

  const handleAnimationComplete = () => {
    if (!modalOpen) {
      dispatch(modalClear())
    }
  }

  const close = () => {
    dispatch(modalClose())
  }

  const drawerOpen = () => {
    setOpen(true)
  }

  const toggleCaption = () => {
    setShowCaption(!showCaption)
  }

  const drawerClose = (filterId) => {
    setOpen(false)

    // TODO: Something better than this
    if (filterId) {
      dispatch(modalClose())
      dispatch(filterChange(defaultGalleryId, filterId))
      history.push(`/gallery/${moduleId}/${defaultGalleryId}`)
    }
  }

  const onAnimationStart = () => {
    setAnimating(true)
  }

  const onAnimationComplete = () => {
    setAnimating(false)
  }

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
  return (
    <>
      {!showCaption && (
        <Fade in={modalOpen}>
          <div className={classes.toggleCaption}>
            <Typography variant="h4">
              <Button onClick={toggleCaption}>{showCaption ? <VisibilityOffIcon /> : <VisibilityIcon />}</Button>
            </Typography>
          </div>
        </Fade>
      )}

      {showCaption && (
        <Fade in={modalOpen}>
          <div className={classes.caption}>
            <Typography variant="h4">
              <Button onClick={toggleCaption}>{showCaption ? <VisibilityOffIcon /> : <VisibilityIcon />}</Button>&nbsp;
              {modalItem.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {modalItem.description}
            </Typography>
          </div>
        </Fade>
      )}

      <Backdrop className={classes.backdrop} open={modalOpen} />

      <Zoom in={modalOpen}>
        <Fab color="default" aria-label="Close" className={classes.button} onClick={close}>
          <CloseIcon />
        </Fab>
      </Zoom>

      {renderFilters && (
        <Zoom in={modalOpen}>
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
