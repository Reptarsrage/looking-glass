import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Fab from '@material-ui/core/Fab'
import clsx from 'clsx'
import Zoom from '@material-ui/core/Zoom'

import {
  modalItemIdSelector,
  modalNextSelector,
  modalPrevSelector,
  modalOpenSelector,
  modalItemSelector,
} from 'selectors/modalSelectors'
import * as modalActions from 'actions/modalActions'
import Image from './ImageWithZoom'
import Video from './Video'

const styles = (theme) => ({
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
    position: 'fixed',
    transform: 'translate(0, -50%)',
    zIndex: theme.zIndex.drawer + 3,
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
})

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}

const SlideShow = ({ item, classes, itemId, modalNext, modalPrev, modalOpen, modalSetItem, animating }) => {
  const [direction, setDirection] = useState(0)
  const [leaving, setLeaving] = useState(false)

  const handleAnimationEnd = () => {
    setLeaving(false)
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity

  const paginate = (id, newDirection) => {
    setLeaving(true)
    setDirection(newDirection)
    modalSetItem(id)
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

  return (
    <div className={classes.slideShow}>
      <AnimatePresence initial={false} custom={direction} onExitComplete={handleAnimationEnd}>
        {item.isVideo ? (
          <Video
            {...commonProps}
            src={item.url}
            thumb={item.thumb}
            title={item.title}
            width={item.width}
            height={item.height}
            controls
            autoPlay
            loop
            muted={leaving}
          />
        ) : (
          <Image
            {...commonProps}
            enableZoom={!animating && modalOpen}
            src={item.url}
            title={item.title}
            width={item.width}
            height={item.height}
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

SlideShow.defaultProps = {
  item: null,
  itemId: null,
  modalNext: null,
  modalPrev: null,
}

SlideShow.propTypes = {
  item: PropTypes.object,
  itemId: PropTypes.string,
  modalNext: PropTypes.string,
  modalPrev: PropTypes.string,
  modalOpen: PropTypes.bool.isRequired,
  animating: PropTypes.bool.isRequired,
  modalSetItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  itemId: modalItemIdSelector,
  modalNext: modalNextSelector,
  modalPrev: modalPrevSelector,
  modalOpen: modalOpenSelector,
  item: modalItemSelector,
})

const mapDispatchToProps = {
  modalSetItem: modalActions.modalSetItem,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SlideShow)
