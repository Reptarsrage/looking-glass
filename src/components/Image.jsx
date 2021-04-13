import React from 'react'
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

  return (
    <motion.img
      {...passThroughProps}
      src={sources[0].url}
      alt={title}
      width={width}
      height={height}
      className={clsx(classes.image, styleName)}
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
