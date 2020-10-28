import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const styles = () => ({
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
})

const Image = ({ classes, src, width, height, title, styleName, ...other }) => {
  const imageRef = useRef(null)

  useEffect(() => {
    if (!imageRef.current.hasAttribute('src')) {
      imageRef.current.setAttribute('src', src)
    }

    return () => {
      imageRef.current.removeAttribute('src')
    }
  }, [])

  return (
    <motion.img
      ref={imageRef}
      className={clsx(classes.image, styleName)}
      src={src}
      alt={title}
      width={width}
      height={height}
      title={title}
      {...other}
    />
  )
}

Image.defaultProps = {
  title: '',
  styleName: null,
}

Image.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  styleName: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default withStyles(styles)(Image)
