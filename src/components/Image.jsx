import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
}))

export default function Image({ src, width, height, title, styleName, ...passThroughProps }) {
  const classes = useStyles()
  const imageRef = useRef(null)

  useEffect(() => {
    const img = imageRef.current
    if (!img.hasAttribute('src')) {
      img.setAttribute('src', src)
    }

    return () => {
      img.removeAttribute('src')
    }
  }, [])

  return (
    <motion.img
      {...passThroughProps}
      ref={imageRef}
      className={clsx(classes.image, styleName)}
      src={src}
      alt={title}
      width={width}
      height={height}
      title={title}
    />
  )
}

Image.defaultProps = {
  title: '',
  styleName: null,
}

Image.propTypes = {
  // required
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // optional
  title: PropTypes.string,
  styleName: PropTypes.string,
}
