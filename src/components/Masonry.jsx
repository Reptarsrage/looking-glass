import React, { useState, memo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import moize from 'moize'
import { isValidElementType } from 'react-is'

import Virtualized from './Virtualized'
import withScroll from '../hocs/WithScroll'
import withResize from '../hocs/WithResize'
import Item from './Item'

/**
 * Memoized function for calculating the width available to a column in the masonry.
 */
const calculateColumnWidth = moize(
  ({ columnCount, containerWidth, gutter, scrollBarSize }) =>
    (containerWidth - scrollBarSize - (columnCount + 1) * gutter) / columnCount,
  { maxSize: 1 }
)

/**
 * Memoization cache busting equality comparer.
 *
 * @param {*} next Next parameters
 * @param {*} prev Previous parameters
 */
const getAdjustedItemDimensionsEqual = (next, prev) =>
  next.id === prev.id &&
  next.columnCount === prev.columnCount &&
  next.containerWidth === prev.containerWidth &&
  next.gutter === prev.gutter &&
  next.scrollBarSize === prev.scrollBarSize

/**
 * Memoized function for calculating the dimensions for a column items.
 *
 * @param {*} id Item ID
 * @param {*} columnCount Number of columns
 * @param {*} containerWidth Width of the masonry
 * @param {*} gutter Size of gutter
 * @param {*} getItemDimensions Function to retrieve item dimensions
 * @param {*} scrollBarSize Width of the scroll bar
 */
const getAdjustedItemDimensions = moize(
  ({ id, columnCount, containerWidth, gutter, getItemDimensions, scrollBarSize }) => {
    // calculate column width
    const columnWidth = calculateColumnWidth({ columnCount, containerWidth, gutter, scrollBarSize })

    // lookup item dimensions (non-adjusted)
    const { width: itemWidth, height: itemHeight } = getItemDimensions(id)

    // adjust item dimensions to fit the column
    const calculatedWidth = Math.min(itemWidth, columnWidth)
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth
    const calculatedLeft = (columnWidth - calculatedWidth) / 2.0
    return { height: calculatedHeight, width: calculatedWidth, left: calculatedLeft, id }
  },
  {
    equals: getAdjustedItemDimensionsEqual, // custom equality function
    maxSize: 1000, // 1K total items in cache
    maxAge: 1000 * 60 * 5, // five minutes
  }
)

/**
 * In charge of placing items into columns
 *
 * @param {Map[]} columns Array of columns
 * @param {Map} itemColumnLookup Map of item IDs to column IDs
 * @param {number} columnItemsCount Total number of items in the masonry
 * @param {string[]} items An array of item IDs to put in the masonry
 * @param {number} width Width of the masonry
 * @param {number} gutter Size of space between masonry items
 * @param {number} columnCount Number of columns
 * @param {number} scrollBarSize Width of scroll bar
 * @param {function} getItemDimensions Function to retrieve item dimensions
 */
const setColumnItems = (
  columns,
  itemColumnLookup,
  columnItemsCount,
  items,
  width,
  gutter,
  columnCount,
  scrollBarSize,
  getItemDimensions
) => {
  // Check if column count changed
  const columnCountChanged = columns.length !== columnCount

  // Check if items has changed (besides growing, which is ok)
  const columnItemsMismatch =
    items.length <= columnItemsCount || items.slice(0, columnItemsCount + 1).some((id) => !(id in itemColumnLookup))

  // Reset columns if necessary
  let newColumnItemsCount = columnItemsCount
  if (columnCountChanged || columnItemsMismatch) {
    newColumnItemsCount = 0
    while (columns.length > 0) {
      delete itemColumnLookup[columns.pop()]
    }
  }

  // Initialize columns
  while (columns.length < columnCount) {
    columns.push({ height: 0, id: columns.length })
  }

  // Fill in column items
  // Make sure to try and balance column heights in a deterministic way
  // so items don't jump around on the screen after a resize event
  for (let i = newColumnItemsCount; i < items.length; i += 1) {
    // Get item height
    const itemId = items[i]
    const { height } = getAdjustedItemDimensions({
      id: itemId,
      columnCount,
      containerWidth: width,
      gutter,
      getItemDimensions,
      scrollBarSize,
    })

    // Find shortest column
    const minHeightColumn = columns.reduce((prev, curr) => (prev.height <= curr.height ? prev : curr))

    // Assign the item to the column
    itemColumnLookup[itemId] = minHeightColumn.id
    minHeightColumn.height += height

    newColumnItemsCount = i
  }

  const maxHeightColumn = columns.reduce((prev, curr) => (prev.height >= curr.height ? prev : curr))
  const minHeight = maxHeightColumn.height
  return [newColumnItemsCount, minHeight]
}

/**
 * In charge of keeping column heights up to date
 *
 * @param {Map[]} columns Array of columns
 * @param {Map} itemColumnLookup Map of item IDs to column IDs
 * @param {number} columnItemsCount Total number of items in the masonry
 * @param {string[]} items An array of item IDs to put in the masonry
 * @param {number} width Width of the masonry
 * @param {number} gutter Size of space between masonry items
 * @param {number} columnCount Number of columns
 * @param {number} scrollBarSize Width of scroll bar
 * @param {function} getItemDimensions Function to retrieve item dimensions
 */
const adjustColumnItems = (
  columns,
  itemColumnLookup,
  items,
  width,
  gutter,
  columnCount,
  scrollBarSize,
  getItemDimensions
) => {
  let minHeight = 0
  for (const column of columns) {
    const { id: columnId } = column
    const columnItems = items.filter((itemId) => itemColumnLookup[itemId] === columnId)
    const height = columnItems.reduce(
      (sum, itemId) =>
        sum +
        getAdjustedItemDimensions({
          id: itemId,
          columnCount,
          containerWidth: width,
          gutter,
          getItemDimensions,
          scrollBarSize,
        }).height,
      0
    )

    column.height = height
    minHeight = Math.max(height, minHeight)
  }

  return minHeight
}

const Masonry = ({
  items,
  columnCount,
  getItemDimensions,
  width,
  height,
  scrollTop,
  gutter,
  scrollDirection,
  forceRenderItems,
  scrollBarSize,
  ChildComponent,
}) => {
  const [minHeight, setMinHeight] = useState(height + scrollTop)
  const [columnItemsCount, setColumnItemsCount] = useState(0)

  // Persist some data
  const savedRef = useRef({
    itemColumnLookup: {},
    columns: [],
  })

  const { itemColumnLookup, columns } = savedRef.current

  // When items or columns change
  useEffect(() => {
    // recalculate the column items
    const [newColumnItemsCount, newMinHeight] = setColumnItems(
      columns,
      itemColumnLookup,
      columnItemsCount,
      items,
      width,
      gutter,
      columnCount,
      scrollBarSize,
      getItemDimensions
    )

    setMinHeight(newMinHeight)
    setColumnItemsCount(newColumnItemsCount)
  }, [items, columnCount])

  // When sizes change
  useEffect(() => {
    // Check if we should clear cache due to layout changes
    const cacheKeys = getAdjustedItemDimensions.keys()
    if (cacheKeys.length > 0 && cacheKeys[0].length > 0) {
      const previousParameters = cacheKeys[0][0]
      if (
        width !== previousParameters.containerWidth ||
        gutter !== previousParameters.gutter ||
        scrollBarSize !== previousParameters.scrollBarSize
      ) {
        getAdjustedItemDimensions.clear() // clear cache
      }
    }

    // Adjust column heights
    setMinHeight(
      adjustColumnItems(columns, itemColumnLookup, items, width, gutter, columnCount, scrollBarSize, getItemDimensions)
    )
  }, [width, gutter, scrollBarSize])

  const columnWidth = calculateColumnWidth({ columnCount, containerWidth: width, gutter, scrollBarSize })
  return (
    <div style={{ minHeight: `${minHeight}px` }}>
      {columns.map((column, index) => {
        const columnId = column.id
        const columnItems = items.filter((itemId) => itemColumnLookup[itemId] === columnId)
        const forceRenderColumnItems = forceRenderItems.filter((itemId) => itemColumnLookup[itemId] === columnId)
        const left = columnWidth * index + gutter * (index + 1)

        return (
          <Virtualized
            key={columnId}
            width={columnWidth}
            height={height}
            left={left}
            getAdjustedDimensionsForItem={(id) =>
              getAdjustedItemDimensions({
                id,
                columnCount,
                containerWidth: width,
                gutter,
                getItemDimensions,
                scrollBarSize,
              })
            }
            items={columnItems}
            scrollTop={scrollTop}
            scrollDirection={scrollDirection}
            gutter={gutter}
            columnNumber={index}
            forceRenderItems={forceRenderColumnItems}
            ChildComponent={ChildComponent}
          />
        )
      })}
    </div>
  )
}

Masonry.defaultProps = {
  scrollTop: 0,
  scrollBarSize: 10,
  gutter: 8,
  columnCount: 3,
  scrollDirection: 0,
  forceRenderItems: [],
  ChildComponent: Item,
}

Masonry.propTypes = {
  // required
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  getItemDimensions: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // optional
  columnCount: PropTypes.number,
  scrollTop: PropTypes.number,
  gutter: PropTypes.number,
  scrollBarSize: PropTypes.number,
  scrollDirection: PropTypes.number,
  forceRenderItems: PropTypes.arrayOf(PropTypes.string),
  ChildComponent: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(`Invalid prop 'component' supplied to 'Virtualized': the prop is not a valid React component`)
    }

    return undefined
  },
}

/**
 * Compares two arrays for equality.
 *
 * @param {string[]} a Array one
 * @param {string[]} b Array two
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

/**
 * Used by React.memo to determine if a render is necessary.
 *
 * @param {*} nextProps Incoming props
 * @param {*} prevProps Current props
 */
function propsEqual(nextProps, prevProps) {
  return (
    nextProps.scrollTop === prevProps.scrollTop &&
    nextProps.width === prevProps.width &&
    nextProps.height === prevProps.height &&
    nextProps.columnCount === prevProps.columnCount &&
    nextProps.gutter === prevProps.gutter &&
    nextProps.scrollBarSize === prevProps.scrollBarSize &&
    arraysEqual(nextProps.items, prevProps.items) &&
    arraysEqual(nextProps.forceRenderItems, prevProps.forceRenderItems)
  )
}

export default withResize(withScroll(memo(Masonry, propsEqual)))
