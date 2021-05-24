import React, { useState, useCallback } from 'react'
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

export default function Image({ sources, width, height, title, styleName, ...passThroughProps }) {
  const classes = useStyles()
  const [index, setIndex] = useState(0)

  const handleError = useCallback(() => {
    // move to next image, hopefully that one loads
    setIndex(Math.min(index + 1, sources.length - 1))
  }, [index])

  return (
    <motion.img
      {...passThroughProps}
      src={sources[index].url}
      alt={title}
      width={width}
      height={height}
      className={clsx(classes.image, styleName)}
      onError={handleError}
    />
  )
}

Image.defaultProps = {
  title: '',
  styleName: null,
}

Image.propTypes = {
  // required
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })
  ).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // optional
  title: PropTypes.string,
  styleName: PropTypes.string,
}
