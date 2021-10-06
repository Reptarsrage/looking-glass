import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { makeStyles } from '@mui/styles'
import { extname } from 'path'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { alpha } from '@mui/material/styles'

import { volumeSelector } from '../selectors/appSelectors'
import { setVolume } from '../actions/appActions'

const useStyles = makeStyles((theme) => ({
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
  progress: {
    backgroundColor: alpha(theme.palette.primary.main, 0.66),
    transition: 'width 500ms linear 0ms',
    position: 'absolute',
    height: theme.spacing(0.5),
    width: 0,
    bottom: 0,
    left: 0,
  },
}))

function Source({ uri }) {
  const mimeType = useMemo(() => {
    let url = new URL(uri)

    const query = qs.parse(url.search.slice(1))
    if (query && query.uri) {
      url = new URL(query.uri)
    }

    return `video/${extname(url.pathname).slice(1).split('?')[0] || 'mp4'}`
  }, [uri])

  return <source src={uri} type={mimeType} />
}

Source.propTypes = {
  uri: PropTypes.string.isRequired,
}

export default function Video({ sources, poster, width, height, title, styleName, controls, ...passThroughProps }) {
  const classes = useStyles()
  const volume = useSelector(volumeSelector)
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const initRef = useRef({ init: true })
  const [progress, setProgress] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false)

  useEffect(() => {
    // set the initial volume
    const { current } = videoRef
    current.volume = volume

    const intervalId = setInterval(handleTimeUpdate, 500)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setDisableTransition(newProgress < progress)
      setProgress(newProgress)
    }
  }

  const handleVolumechange = useCallback(
    debounce((event) => {
      // ignore the event that is fired from useEffect
      // (the initial setting of the volume)
      if (initRef.current.init) {
        initRef.current.init = false
        return
      }

      const { target } = event
      dispatch(setVolume(target.muted ? 0 : target.volume))
    }, 200),
    [initRef.current.init]
  )

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <motion.video
        {...passThroughProps}
        className={clsx(classes.video, styleName)}
        width={width}
        height={height}
        poster={poster}
        controls={controls}
        ref={videoRef}
        onVolumeChange={handleVolumechange}
        onTimeUpdate={handleTimeUpdate}
      >
        {sources.map(({ url }) => (
          <Source key={url} uri={url} />
        ))}
      </motion.video>
      {!controls && (
        <div
          className={classes.progress}
          style={{ width: `${progress}%`, transition: disableTransition ? 'none' : undefined }}
        />
      )}
    </>
  )
}

Video.defaultProps = {
  title: '',
  poster: null,
  styleName: null,
  controls: true,
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
  controls: PropTypes.bool,
}
