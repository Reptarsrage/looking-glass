import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { extname } from 'path'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
}))

export default function Video({ src, thumb, width, height, title, styleName, ...passThroughProps }) {
  const classes = useStyles()
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video.querySelector('source').hasAttribute('src')) {
      video.pause()
      video.querySelector('source').setAttribute('src', src)
      video.load()
    }

    return () => {
      // based on https://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element/40419032
      video.pause()
      video.querySelector('source').removeAttribute('src')
      video.load()
    }
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <motion.video
      ref={videoRef}
      className={clsx(classes.video, styleName)}
      width={width}
      height={height}
      title={title}
      poster={thumb}
      {...passThroughProps}
    >
      <source src={src} type={`video/${extname(src).slice(1).split('?')[0] || 'mp4'}`} />
    </motion.video>
  )
}

Video.defaultProps = {
  title: '',
  thumb: null,
  styleName: null,
}

Video.propTypes = {
  // required
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // optional
  thumb: PropTypes.string,
  title: PropTypes.string,
  styleName: PropTypes.string,
}
