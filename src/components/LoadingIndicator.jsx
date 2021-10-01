import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  wrapper: {
    margin: '0',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100px',
    minHeight: '100px',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
}))

export default function LoadingIndicator({ className, size }) {
  const classes = useStyles()

  return (
    <div className={className || classes.wrapper}>
      <CircularProgress size={size} />
    </div>
  )
}

LoadingIndicator.defaultProps = {
  size: 100,
  className: null,
}

LoadingIndicator.propTypes = {
  // optional
  size: PropTypes.number,
  className: PropTypes.string,
}
