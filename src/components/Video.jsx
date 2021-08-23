import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { makeStyles } from '@material-ui/styles'
import { extname } from 'path'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'

import { volumeSelector } from '../selectors/appSelectors'
import { setVolume } from '../actions/appActions'

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
  const volume = useSelector(volumeSelector)
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const initRef = useRef({ init: true })

  useEffect(() => {
    // set the initial volume
    const { current } = videoRef
    current.volume = volume
  }, [])

  const handleVolumechange = debounce((event) => {
    // ignore the event that is fired from useEffect
    // (the initial setting of the volume)
    if (initRef.current.init) {
      initRef.current.init = false
      return
    }

    const { target } = event
    dispatch(setVolume(target.muted ? 0 : target.volume))
  }, 200)

  const extractMimeType = (uri) => {
    let url = new URL(uri)

    const query = qs.parse(url.search.slice(1))
    if (query && query.uri) {
      url = new URL(query.uri)
    }

    return `video/${extname(url.pathname).slice(1).split('?')[0] || 'mp4'}`
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <motion.video
      {...passThroughProps}
      className={clsx(classes.video, styleName)}
      width={width}
      height={height}
      poster={poster}
      ref={videoRef}
      onVolumeChange={handleVolumechange}
    >
      {sources.map(({ url }) => (
        <source key={url} src={url} type={extractMimeType(url)} />
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
