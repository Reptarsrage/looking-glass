import { createElement, useState, useMemo, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { isValidElementType } from 'react-is'

const useStyles = makeStyles((theme) => ({
  scroll: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '4px',
    },
  },
  outerList: {
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    willChange: 'transform',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  listSectionInner: {
    position: 'relative',
    backgroundColor: 'inherit',
    padding: 0,
  },
}))

// this should be memoized
const getRangeToRender = (scrollOffset, itemSize, height, itemCount, scrollDirection) => {
  const fwdOverscan = scrollDirection > 0 ? 4 : 2
  const bkwdOverscan = scrollDirection < 0 ? 4 : 2

  const startIndex = Math.max(0, Math.min(itemCount - 1, Math.floor(scrollOffset / itemSize) - bkwdOverscan))
  const offset = startIndex * itemSize
  const numVisibleItems = Math.ceil((height + scrollOffset - offset) / itemSize)
  const endIndex = Math.max(
    0,
    Math.min(
      itemCount - 1,
      startIndex + numVisibleItems + fwdOverscan - 1 // -1 is because stop index is inclusive
    )
  )

  return [startIndex, endIndex]
}

export default function VirtualGroupedList({
  width,
  height,
  sectionCounts,
  itemSize,
  itemData,
  listComponent,
  headerComponent,
  itemComponent,
  active,
}) {
  const classes = useStyles()
  const [scrollOffset, setScrollOffset] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(0)
  const listRef = useRef(null)

  // scroll to active
  useEffect(() => {
    if (active < 0) {
      return
    }

    let sectionIdx = 0
    let counter = 0
    while (counter < active) {
      while (counter > sectionCounts[sectionIdx]) {
        sectionIdx += 1
        counter += 1 // section header
      }

      counter += 1 // section item
    }

    const bounds = listRef.current.getBoundingClientRect()
    if (listRef.current && listRef.current.scrollTop >= counter * itemSize) {
      // desired scroll above off screen
      listRef.current.scrollTo({ top: counter * itemSize, behavior: 'smooth' })
    } else if (listRef.current && listRef.current.scrollTop + bounds.height / 2 <= (counter + 1) * itemSize) {
      // desired scroll below off screen
      listRef.current.scrollTo({ top: (counter + 2) * itemSize - bounds.height / 2, behavior: 'smooth' })
    }
  }, [active])

  // keep track of scroll offset to render only the items on screen
  const onScroll = useCallback(
    (event) => {
      const { clientHeight, scrollHeight, scrollTop } = event.currentTarget
      const newScrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
      setScrollDirection(newScrollOffset > scrollOffset ? 1 : -1)
      setScrollOffset(newScrollOffset)
    },
    [scrollOffset]
  )

  // calculate range of visible items
  let totalItems = sectionCounts.reduce((acc, cur) => acc + cur + 1, 0)
  let toalItemIndex = 0 // used to calculate active item
  const [startIndex, stopIndex] = useMemo(
    () => getRangeToRender(scrollOffset, itemSize, height, totalItems, scrollDirection),
    [scrollOffset, itemSize, height, totalItems, scrollDirection]
  )

  // figure out which sections/items to render
  totalItems = 1 // +1 due to section header always being the first element
  const sections = []
  sectionCounts.forEach((sectionCount, sectionIndex) => {
    if (sectionCount <= 0) {
      return // don't render if section is empty
    }

    const items = []

    // add section header
    // if header is on screen (or sticky'd above)
    if (totalItems - 1 <= stopIndex) {
      items.push(
        createElement(headerComponent, {
          ...itemData,
          key: 'header',
          sectionIndex,
        })
      )
    }

    // add section items
    // rendered absolutely relative to the section
    for (let i = 0; i < sectionCount; i += 1) {
      const index = i + totalItems // convert index of item within section to overall index
      if (index >= startIndex && index <= stopIndex) {
        items.push(
          createElement(itemComponent, {
            ...itemData,
            key: i,
            itemIndex: i,
            active: active === toalItemIndex,
            sectionIndex,
            style: {
              position: 'absolute',
              left: 0,
              top: (i + 1) * itemSize, // make sure not to render the first item under the header
              height: itemSize,
              width: '100%',
            },
          })
        )
      }

      toalItemIndex += 1
    }

    // create section to wrap items
    // we always render all sections, even if they're off-screen
    // this can be optimized but I don't care right now
    sections.push(
      createElement(
        'li',
        {
          className: classes.listSection,
          key: sectionIndex,
          style: {
            height: (sectionCount + 1) * itemSize, // +1 for section header
          },
        },
        createElement(
          'ul',
          {
            className: classes.listSectionInner,
            style: {
              height: (sectionCount + 1) * itemSize, // +1 for section header
            },
          },
          items
        )
      )
    )

    totalItems += sectionCount + 1 // +1 for section header at the start of each section
  })

  // wrap all sections in an outer list
  return createElement(
    listComponent || 'ul',
    {
      onScroll,
      className: clsx(classes.outerList, classes.scroll),
      style: { width, height },
      subheader: createElement('li'),
      ref: listRef,
    },
    sections
  )
}

VirtualGroupedList.defaultProps = {
  itemData: {},
  active: -1,
}

const component = {
  isRequired: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(`Invalid prop 'component' supplied to 'Virtualized': the prop is not a valid React component`)
    }

    return undefined
  },
}

VirtualGroupedList.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sectionCounts: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  itemSize: PropTypes.number.isRequired,
  itemData: PropTypes.object,
  active: PropTypes.number,
  listComponent: component.isRequired,
  headerComponent: component.isRequired,
  itemComponent: component.isRequired,
}
