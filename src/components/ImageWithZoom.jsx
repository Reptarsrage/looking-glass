import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const styles = () => ({
  container: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    transformOrigin: '0px 0px',
    transform: 'translate(0, 0) scale(1)',
  },
})
const ImageWithZoom = ({
  classes,
  enableZoom,
  width,
  height,
  src,
  title,
  styleName,
  zoom,
  maxZoom,
  initialZoom,
  initialX,
  initialY,
  ...other
}) => {
  const [scale, setScale] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(0)

  const imageRef = useRef(null)
  const refState = useRef({
    previousEvent: null,
    dragging: false,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  }).current

  // Effect to unload image from memory
  useEffect(() => {
    if (!imageRef.current.hasAttribute('src')) {
      imageRef.current.setAttribute('src', src)
    }

    return () => {
      imageRef.current.removeAttribute('src')
    }
  }, [])

  // Effect to bootstrap zooming
  useEffect(() => {
    const img = imageRef.current
    if (!enableZoom) {
      return undefined
    }

    // calculate initial dimensions
    const computedStyle = window.getComputedStyle(img, null)
    const w = parseInt(computedStyle.width, 10)
    const h = parseInt(computedStyle.height, 10)

    // Set state
    setScale(1)
    setTranslateX(0)
    setTranslateY(0)

    // Set non-state properties
    refState.x = 0
    refState.y = 0
    refState.w = w
    refState.h = h
    refState.scale = 1

    return () => {
      setScale(1)
      setTranslateX(0)
      setTranslateY(0)
      setIsDragging(false)
    }
  }, [enableZoom])

  const handleWheel = (event) => {
    const img = imageRef.current
    if (!img) {
      return
    }

    // determine if zooming in or out
    let deltaY = 0
    if (event.deltaY) {
      deltaY = event.deltaY
    } else if (event.wheelDelta) {
      deltaY = -event.wheelDelta
    }

    // calculate zoom point
    const rect = img.getBoundingClientRect()
    let offsetX = event.pageX - rect.left - window.pageXOffset
    let offsetY = event.pageY - rect.top - window.pageYOffset
    offsetX /= scale
    offsetY /= scale
    const xs = (offsetX - translateX) / scale
    const ys = (offsetY - translateY) / scale

    // get scroll direction & set zoom level
    let newScale = deltaY <= 0 ? scale * 1.2 : scale / 1.2

    // reverse the offset amount with the new scale
    let newTranslateX = offsetX - xs * newScale
    let newTranslateY = offsetY - ys * newScale

    // cap zoom
    if (newScale < 1) {
      newScale = 1
      newTranslateX = 0
      newTranslateY = 0
    }

    // cap xy tranlation
    newTranslateX = Math.min(newTranslateX, 0)
    newTranslateY = Math.min(newTranslateY, 0)

    // update state
    setScale(newScale)
    setTranslateX(newTranslateX)
    setTranslateY(newTranslateY)

    // update non-state
    refState.x = newTranslateX
    refState.y = newTranslateY
    refState.scale = newScale
  }

  const handleMouseUp = (event) => {
    const { dragging } = refState
    if (dragging) {
      event.preventDefault()
      event.stopPropagation()

      refState.dragging = false
      setIsDragging(false)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }

  const handleMouseDown = (event) => {
    const { dragging } = refState
    const zoomedIn = scale !== 1
    if (!dragging && zoomedIn) {
      refState.previousEvent = { pageX: event.pageX, pageY: event.pageY }
      refState.dragging = true
      setIsDragging(true)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove)
    }
  }

  const handleMouseMove = (event) => {
    const { previousEvent, dragging, x, y, w, h } = refState
    if (dragging) {
      event.preventDefault()
      event.stopPropagation()

      refState.x = x + event.pageX - previousEvent.pageX
      refState.y = y + event.pageY - previousEvent.pageY

      // cap xy tranlation to original bounds
      const newWidth = w * scale
      const newHeight = h * scale
      const right = refState.x + newWidth
      const bottom = refState.y + newHeight
      if (right < w) {
        refState.x = w - newWidth
      } else {
        refState.x = Math.min(refState.x, 0)
      }

      if (bottom < h) {
        refState.y = h - newHeight
      } else {
        refState.y = Math.min(refState.y, 0)
      }

      setTranslateX(refState.x)
      setTranslateY(refState.y)

      refState.previousEvent = { pageX: event.pageX, pageY: event.pageY }
    }
  }

  const zoomedIn = scale !== 1
  const style = {
    originX: 0,
    originY: 0,
    translateX,
    translateY,
    scale,
  }

  if (isDragging) {
    style.cursor = 'grabbing'
  } else if (zoomedIn) {
    style.cursor = 'grab'
  }

  const otherProps = { ...other }
  if (zoomedIn) {
    otherProps.drag = undefined // Disable dragging when zoomed
  }

  return (
    <motion.div className={clsx(classes.container, styleName)} {...otherProps}>
      <motion.img
        ref={imageRef}
        className={classes.image}
        role="presentation"
        src={src}
        alt={title}
        width={width}
        height={height}
        title={title}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        style={style}
        draggable={zoomedIn}
      />
    </motion.div>
  )
}

ImageWithZoom.defaultProps = {
  zoom: 0.1,
  maxZoom: false,
  initialZoom: 1,
  initialX: 0,
  initialY: 0,
  title: '',
  styleName: null,
  enableZoom: false,
}

ImageWithZoom.propTypes = {
  // Required
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // Optional
  zoom: PropTypes.number,
  maxZoom: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  initialZoom: PropTypes.number,
  initialX: PropTypes.number,
  initialY: PropTypes.number,
  enableZoom: PropTypes.bool,
  title: PropTypes.string,
  styleName: PropTypes.string,
}

export default withStyles(styles)(ImageWithZoom)
