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

export default function Image({ sources, width, height, title, styleName, ...passThroughProps }) {
  const classes = useStyles()
  const imageRef = useRef(null)

  useEffect(() => {
    // const img = imageRef.current
    // if (!img.hasAttribute('src')) {
    //   img.setAttribute('src', src)
    // }
    // return () => {
    //   img.removeAttribute('src')
    // }
  }, [])

  return (
    <picture>
      {sources.map(({ url, width: minWidth }, idx) => (
        <source key={url} srcSet={url} media={`(min-width: ${idx === sources.length - 1 ? 0 : minWidth}px)`} />
      ))}

      <motion.img
        {...passThroughProps}
        ref={imageRef}
        src={sources[0].url}
        alt={title}
        width={width}
        height={height}
        className={clsx(classes.image, styleName)}
      />
    </picture>
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
