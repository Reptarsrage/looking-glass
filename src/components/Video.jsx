import React from 'react'
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

export default function Video({ sources, poster, width, height, title, styleName, ...passThroughProps }) {
  const classes = useStyles()

  const handleLoadStart = (event) => {
    const volume = sessionStorage.getItem('volume')
    const { target } = event

    if (volume !== null) {
      target.volume = volume
    }
  }

  const handleVolumechange = (event) => {
    const { target } = event
    sessionStorage.setItem('volume', target.volume)
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <motion.video
      {...passThroughProps}
      className={clsx(classes.video, styleName)}
      width={width}
      height={height}
      title={title}
      poster={poster}
      onLoadStart={handleLoadStart}
      onVolumeChange={handleVolumechange}
    >
      {sources.map(({ url }) => (
        <source key={url} src={url} type={`video/${extname(url).slice(1).split('?')[0] || 'mp4'}`} />
      ))}
    </motion.video>
  )
}

Video.defaultProps = {
  title: '',
  poster: null,
  styleName: null,
}

Video.propTypes = {
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
  poster: PropTypes.string,
  title: PropTypes.string,
  styleName: PropTypes.string,
}
