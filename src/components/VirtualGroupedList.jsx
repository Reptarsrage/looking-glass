import { createElement, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { isValidElementType } from 'react-is'

const useStyles = makeStyles((theme) => ({
  scroll: {
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
  outerList: {
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    willChange: 'transform',
    backgroundColor: theme.palette.background.paper,
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
}) {
  const classes = useStyles()
  const [scrollOffset, setScrollOffset] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(0)

  // keep track of scroll offset to render only the items on screen
  const onScroll = (event) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget
    const newScrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
    setScrollDirection(newScrollOffset > scrollOffset ? 1 : -1)
    setScrollOffset(newScrollOffset)
  }

  // calculate range of visible items
  let totalItems = sectionCounts.reduce((acc, cur) => acc + cur + 1, 0)
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
        createElement('ul', {
          children: items,
          className: classes.listSectionInner,
          style: {
            height: (sectionCount + 1) * itemSize, // +1 for section header
          },
        })
      )
    )

    totalItems += sectionCount + 1 // +1 for section header at the start of each section
  })

  // wrap all sections in an outer list
  return createElement(listComponent || 'ul', {
    onScroll,
    children: sections,
    className: clsx(classes.outerList, classes.scroll),
    style: { width, height },
    subheader: createElement('li'),
  })
}

VirtualGroupedList.defaultProps = {
  itemData: {},
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
  listComponent: component.isRequired,
  headerComponent: component.isRequired,
  itemComponent: component.isRequired,
}
