import React, { memo, useRef } from 'react'
import PropTypes from 'prop-types'
import moize from 'moize'
import { isValidElementType } from 'react-is'

import withScroll from 'hocs/WithScroll'
import withResize from 'hocs/WithResize'
import Virtualized from './Virtualized'
import Item from './Item'

/**
 * calculates the width available to a column in the masonry.
 */
export const calculateColumnWidth = ({ columnCount, containerWidth, gutter, scrollBarSize }) =>
  (containerWidth - scrollBarSize - (columnCount + 1) * gutter) / columnCount

/**
 * memoization cache busting equality comparer for getAdjustedItemDimensions.
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
 * calculates the dimensions for a column items.
 *
 * @param {*} id Item ID
 * @param {*} columnCount Number of columns
 * @param {*} containerWidth Width of the masonry
 * @param {*} gutter Size of gutter
 * @param {*} getItemDimensions Function to retrieve item dimensions
 * @param {*} scrollBarSize Width of the scroll bar
 * @param {*} memoCalculateColumnWidth Memoized function
 */
export const getAdjustedItemDimensions = ({
  id,
  columnCount,
  containerWidth,
  gutter,
  getItemDimensions,
  scrollBarSize,
  memoCalculateColumnWidth,
}) => {
  // calculate column width
  const columnWidth = memoCalculateColumnWidth({ columnCount, containerWidth, gutter, scrollBarSize })

  // lookup item dimensions (non-adjusted)
  const { width: itemWidth, height: itemHeight } = getItemDimensions(id)

  // adjust item dimensions to fit the column
  const calculatedWidth = Math.min(itemWidth, columnWidth)
  const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth
  const calculatedLeft = (columnWidth - calculatedWidth) / 2.0
  return { height: calculatedHeight, width: calculatedWidth, left: calculatedLeft, id }
}

/**
 * memoization cache busting equality comparer for setColumnItems.
 *
 * @param {*} next Next parameters
 * @param {*} prev Previous parameters
 */
const setColumnItemsEqual = (next, prev) =>
  arraysEqual(next.items, prev.items) &&
  next.width === prev.width &&
  next.gutter === prev.gutter &&
  next.columnCount === prev.columnCount &&
  next.columnItemsCount === prev.columnItemsCount &&
  next.scrollBarSize === prev.scrollBarSize

/**
 * in charge of placing items into columns
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
 * @param {function} memoGetAdjustedItemDimensions Memoized version
 * @param {function} memoCalculateColumnWidth Memoized version
 */
export const setColumnItems = ({
  columns,
  itemColumnLookup,
  columnItemsCount,
  items,
  width,
  gutter,
  columnCount,
  scrollBarSize,
  getItemDimensions,
  memoGetAdjustedItemDimensions,
  memoCalculateColumnWidth,
}) => {
  // check if column count changed
  const columnCountChanged = columns.length !== columnCount

  // check if items has changed (besides growing, which is ok)
  const columnItemsMismatch =
    items.length <= columnItemsCount || items.slice(0, columnItemsCount + 1).some((id) => !(id in itemColumnLookup))

  // reset columns if necessary
  let newColumnItemsCount = columnItemsCount
  if (columnCountChanged || columnItemsMismatch) {
    newColumnItemsCount = 0

    // clear lookup table
    Object.keys(itemColumnLookup).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(itemColumnLookup, key)) {
        delete itemColumnLookup[key]
      }
    })

    // clear columns
    while (columns.length > 0) {
      columns.pop()
    }
  }

  // initialize columns
  while (columns.length < columnCount) {
    columns.push({ adjustedHeight: gutter, id: columns.length })
  }

  // fill in column items
  // make sure to try and balance column heights in a deterministic way
  // so items don't jump around on the screen after a resize event
  for (let i = newColumnItemsCount; i < items.length; i += 1) {
    // get item height
    const itemId = items[i]
    const adjustedDims = memoGetAdjustedItemDimensions({
      id: itemId,
      columnCount,
      containerWidth: width,
      gutter,
      getItemDimensions,
      scrollBarSize,
      memoCalculateColumnWidth,
    })

    // find shortest column
    const minHeightColumn = columns.reduce((prev, curr) => (prev.adjustedHeight <= curr.adjustedHeight ? prev : curr))

    // assign the item to the column
    itemColumnLookup[itemId] = minHeightColumn.id
    minHeightColumn.adjustedHeight += adjustedDims.height + gutter

    newColumnItemsCount = i
  }

  return newColumnItemsCount
}

/**
 * memoization cache busting equality comparer for adjustColumnItems.
 *
 * @param {*} next Next parameters
 * @param {*} prev Previous parameters
 */
const adjustColumnItemsEqual = (next, prev) =>
  arraysEqual(next.items, prev.items) &&
  next.width === prev.width &&
  next.gutter === prev.gutter &&
  next.columnCount === prev.columnCount &&
  next.scrollBarSize === prev.scrollBarSize

/**
 * in charge of keeping column heights up to date
 *
 * @param {Map[]} columns Array of columns
 * @param {Map} itemColumnLookup Map of item IDs to column IDs
 * @param {string[]} items An array of item IDs to put in the masonry
 * @param {number} width Width of the masonry
 * @param {number} gutter Size of space between masonry items
 * @param {number} columnCount Number of columns
 * @param {number} scrollBarSize Width of scroll bar
 * @param {function} getItemDimensions Function to retrieve item dimensions
 * @param {function} memoGetAdjustedItemDimensions Memoized version
 * @param {function} memoCalculateColumnWidth Memoized version
 */
export const adjustColumnItems = ({
  columns,
  itemColumnLookup,
  items,
  width,
  gutter,
  columnCount,
  scrollBarSize,
  getItemDimensions,
  memoGetAdjustedItemDimensions,
  memoCalculateColumnWidth,
}) => {
  // check if we should clear cache due to layout changes
  const cacheKeys = memoGetAdjustedItemDimensions.keys()
  if (cacheKeys.length > 0 && cacheKeys[0].length > 0) {
    const previousParameters = cacheKeys[0][0]
    if (
      width !== previousParameters.containerWidth ||
      gutter !== previousParameters.gutter ||
      scrollBarSize !== previousParameters.scrollBarSize
    ) {
      memoGetAdjustedItemDimensions.clear() // clear cache
    }
  }

  let minHeight = 0
  columns.forEach((column) => {
    const { id: columnId } = column
    const columnItems = items.filter((itemId) => itemColumnLookup[itemId] === columnId)

    const adjustedHeight = columnItems.reduce(
      (sum, itemId) =>
        sum +
        memoGetAdjustedItemDimensions({
          id: itemId,
          columnCount,
          containerWidth: width,
          gutter,
          getItemDimensions,
          scrollBarSize,
          memoCalculateColumnWidth,
        }).height +
        gutter,
      gutter
    )

    column.adjustedHeight = adjustedHeight
    minHeight = Math.max(adjustedHeight, minHeight)
  })

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
  // persist some data
  const savedRef = useRef({
    itemColumnLookup: {},
    columns: [],
    columnItemsCount: 0,
    memoAdjustColumnItems: moize(adjustColumnItems, { maxSize: 1, equals: adjustColumnItemsEqual }),
    memoSetColumnItems: moize(setColumnItems, { maxSize: 1, equals: setColumnItemsEqual }),
    memoCalculateColumnWidth: moize(calculateColumnWidth, { maxSize: 1 }),
    memoGetAdjustedItemDimensions: moize(getAdjustedItemDimensions, {
      equals: getAdjustedItemDimensionsEqual,
      maxSize: 1000,
    }),
  })

  const {
    itemColumnLookup,
    columns,
    columnItemsCount,
    memoAdjustColumnItems,
    memoSetColumnItems,
    memoCalculateColumnWidth,
    memoGetAdjustedItemDimensions,
  } = savedRef.current

  // build columns
  savedRef.current.columnItemsCount = memoSetColumnItems({
    columns,
    itemColumnLookup,
    columnItemsCount,
    items,
    width,
    gutter,
    columnCount,
    scrollBarSize,
    getItemDimensions,
    memoGetAdjustedItemDimensions,
    memoCalculateColumnWidth,
  })

  // adjust column heights
  const actualMinHeight = memoAdjustColumnItems({
    columns,
    itemColumnLookup,
    items,
    width,
    gutter,
    columnCount,
    scrollBarSize,
    memoCalculateColumnWidth,
    memoGetAdjustedItemDimensions,
    getItemDimensions,
  })

  const columnWidth = memoCalculateColumnWidth({ columnCount, containerWidth: width, gutter, scrollBarSize })
  return (
    <div style={{ minHeight: `${actualMinHeight}px` }}>
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
              memoGetAdjustedItemDimensions({
                id,
                columnCount,
                containerWidth: width,
                gutter,
                getItemDimensions,
                scrollBarSize,
                memoCalculateColumnWidth,
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
 * compares two arrays for equality.
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
 * used by React.memo to determine if a render is necessary.
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

export const JustMasonry = memo(Masonry, propsEqual)
export default withResize(withScroll(JustMasonry))
