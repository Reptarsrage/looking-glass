import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import { modalOpenSelector } from 'selectors/modalSelectors'
import progressTracker from 'services/progressTracker'

const useStyles = makeStyles((theme) => ({
  bar: {
    position: 'fixed',
    top: '64px', // titleBar height
    left: '0px',
    height: '2px',
    opacity: '1',
    width: '100%',
    transition: 'width 100ms linear, opacity 400ms linear',
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer - 1,
    pointerEvents: 'none',
  },
  failed: {
    backgroundColor: theme.palette.error.main,
  },
}))

export default function Progress() {
  const classes = useStyles()
  const [inProgress, setInProgress] = useState(false)
  const [error, setError] = useState(false)
  const [progress, setProgress] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const modalOpen = useSelector(modalOpenSelector)

  useEffect(() => {
    progressTracker.onStart(() => {
      const duration = progressTracker.estimateDuration()
      const step = 1000 / Math.floor(duration)

      setError(false)
      setProgress(0)
      setInProgress(true)
      setIntervalId(
        setInterval(() => {
          setProgress((p) => Math.max(0, Math.min(100, p + step)))
        }, 100)
      )
    })

    progressTracker.onDone(() => {
      setInProgress(false)
      clearInterval(intervalId)
    })

    progressTracker.onError(() => {
      setError(true)
    })

    progressTracker.onInc((num) => {
      setProgress(num * 100)
    })

    return () => {
      progressTracker.removeEventListeners()
    }
  }, [])

  return (
    <div
      className={clsx(classes.bar, error ? classes.failed : undefined)}
      style={{
        opacity: inProgress ? '1' : '0',
        width: `${progress}%`,
        top: modalOpen ? '30px' : '64px',
      }}
    />
  )
}
