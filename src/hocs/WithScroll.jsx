import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d5d5d5',
      borderRadius: '4px',
    },
  },
}))

const withScroll = (WrappedComponent) => {
  const WithScroll = ({ initialScrollTop, width, height, onScroll, ...passThroughProps }) => {
    const classes = useStyles()
    const scrollContainerRef = useRef(null)
    const [scrollTop, setScrollTop] = useState(initialScrollTop || 0)
    const [scrollDirection, setScrollDirection] = useState(1)

    const handleScroll = (event) => {
      const { clientHeight, scrollTop: targetScrollTop, scrollHeight: targetScrollHeight } = event.currentTarget
      if (targetScrollTop === scrollTop) {
        return
      }

      const newScrollTop = Math.max(0, Math.min(targetScrollTop, targetScrollHeight - clientHeight))

      setScrollTop(newScrollTop)
      setScrollDirection(scrollTop < targetScrollTop ? 1 : -1)

      // callback
      if (onScroll) {
        onScroll({ currentTarget: event.currentTarget })
      }
    }

    useEffect(() => {
      // scroll to initial position on mount
      const outerElt = scrollContainerRef.current
      if (typeof initialScrollTop === 'number') {
        outerElt.scrollTop = initialScrollTop
      }
    }, [initialScrollTop])

    return (
      <div
        ref={scrollContainerRef}
        className={classes.container}
        style={{ width: `${width}px`, height: `${height}px` }}
        onScroll={handleScroll}
      >
        <WrappedComponent
          {...passThroughProps}
          scrollDirection={scrollDirection}
          scrollTop={scrollTop}
          width={width}
          height={height}
        />
      </div>
    )
  }

  WithScroll.propTypes = {
    // required
    initialScrollTop: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
  }

  return WithScroll
}

export default withScroll
