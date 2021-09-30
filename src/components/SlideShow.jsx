import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Fab from '@mui/material/Fab'
import clsx from 'clsx'
import Zoom from '@mui/material/Zoom'

import {
  modalItemIdSelector,
  modalNextSelector,
  modalPrevSelector,
  modalOpenSelector,
  modalItemSelector,
} from 'selectors/modalSelectors'
import { itemUrlsSelector } from 'selectors/itemSelectors'
import { modalSetItem } from 'actions/modalActions'
import Image from './ImageWithZoom'
import Video from './Video'

const useStyles = makeStyles((theme) => ({
  slideShow: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    top: 'calc(50% + 30px)', // titleBar height
    position: 'fixed !important',
    transform: 'translate(0, -50%)',
    zIndex: theme.zIndex.drawer - 2,
  },
  prev: {
    left: '0.5rem',
  },
  next: {
    right: '0.5rem',
  },
  slide: {
    position: 'absolute',
    maxHeight: '100%',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
  },
}))

const variants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 1000 : -1000,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction < 0 ? 1000 : -1000,
  }),
}

export default function SlideShow({ animating }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [direction, setDirection] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const itemId = useSelector(modalItemIdSelector)
  const modalNext = useSelector(modalNextSelector)
  const modalPrev = useSelector(modalPrevSelector)
  const modalOpen = useSelector(modalOpenSelector)
  const modalItem = useSelector(modalItemSelector)
  const urls = useSelector((state) => itemUrlsSelector(state, { itemId }))
  const swipeConfidenceThreshold = 10000

  const handleAnimationEnd = () => {
    setLeaving(false)
  }

  const swipePower = (offset, velocity) => Math.abs(offset) * velocity

  const paginate = (id, newDirection) => {
    setLeaving(true)
    setDirection(newDirection)
    dispatch(modalSetItem(id))
  }

  const commonProps = {
    key: itemId,
    custom: direction,
    variants,
    styleName: classes.slide,
    initial: 'enter',
    animate: 'center',
    exit: 'exit',
    transition: {
      x: { type: 'spring', damping: 25, mass: 1.25, stiffness: 200 },
      opacity: { duration: 0.2 },
    },
    drag: 'x',
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 1,
    onDragEnd: (_, { offset, velocity }) => {
      const swipe = swipePower(offset.x, velocity.x)

      if (modalNext !== null && swipe < -swipeConfidenceThreshold) {
        paginate(modalNext, 1)
      } else if (modalPrev !== null && swipe > swipeConfidenceThreshold) {
        paginate(modalPrev, -1)
      }
    },
  }

  // TODO: Theres a bug with using both AnimatePresence and drag
  // when the user drags the element before the enter animation completes
  // the element will teleport for a single frame back to its starting position
  return (
    <div className={classes.slideShow}>
      <AnimatePresence initial={false} custom={direction} onExitComplete={handleAnimationEnd}>
        {modalItem.isVideo ? (
          <Video
            {...commonProps}
            sources={urls}
            poster={modalItem.poster}
            title={modalItem.name}
            width={modalItem.width}
            height={modalItem.height}
            controls
            autoPlay
            loop
            muted={leaving}
          />
        ) : (
          <Image
            {...commonProps}
            enableZoom={!animating && modalOpen}
            sources={urls}
            title={modalItem.name}
            width={modalItem.width}
            height={modalItem.height}
          />
        )}
      </AnimatePresence>

      <Zoom in={modalOpen && modalPrev !== null}>
        <Fab
          color="default"
          aria-label="Previous"
          className={clsx(classes.prev, classes.button)}
          onClick={() => paginate(modalPrev, -1)}
        >
          <ChevronLeftIcon />
        </Fab>
      </Zoom>

      <Zoom in={modalOpen && modalNext !== null}>
        <Fab
          color="default"
          aria-label="Next"
          className={clsx(classes.next, classes.button)}
          onClick={() => paginate(modalNext, 1)}
        >
          <ChevronRightIcon />
        </Fab>
      </Zoom>
    </div>
  )
}

SlideShow.propTypes = {
  // required
  animating: PropTypes.bool.isRequired,
}
