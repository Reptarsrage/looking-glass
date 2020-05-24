import React, { useRef, memo, useState, useEffect, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { animateScroll } from 'react-scroll';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import * as moduleActions from '../actions/moduleActions';
import { galleryIdSelector } from '../selectors/appSelectors';
import { savedScrollPositionSelector, savedScrollTopSelector } from '../selectors/gallerySelectors';
import Virtualized from './Virtualized';

const styles = () => ({
  columnContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  },
});

const VirtualizedMasonry = ({
  columnCount,
  items,
  getHeightForItem,
  width,
  loadMoreThreshold,
  loadMore,
  getWidthForItem,
  gutter,
  classes,
  overscan,
  galleryId,
  savedScrollPosition,
  savedScrollTop,
  saveScrollPosition,
}) => {
  const calculateColumnItems = () => {
    // Ensure each column has an entry
    const colItems = [...Array(columnCount).keys()].map((id) => ({ height: 0, id, items: [] }));

    // Fill in column items
    // Make sure to try and balance column heights in a deterministic way
    for (let i = 0; i < items.length; i += 1) {
      const itemId = items[i];
      const minHeightColumn = colItems.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
      minHeightColumn.items.push(itemId);
      minHeightColumn.height += getHeightForItem(itemId);
    }

    return colItems;
  };

  const getAdjustedDimensionsForItem = (itemId) => {
    const columnWidth = width / columnCount - gutter;
    const itemHeight = getHeightForItem(itemId);
    const itemWidth = getWidthForItem(itemId);
    const calculatedWidth = Math.min(itemWidth, columnWidth);
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth;
    const calculatedLeft = (columnWidth - calculatedWidth) / 2.0;

    return { height: calculatedHeight, width: calculatedWidth, left: calculatedLeft };
  };

  const handleScroll = (event) => {
    const { current } = containerRef;
    const scrollY = event.detail;

    if (current) {
      const rect = current.getBoundingClientRect();
      if (rect) {
        // we've made it here, so dimensions are available
        // use them to set our current scroll position
        const scrollPosition = scrollY;
        const scrollTop = scrollY + rect.top;
        setScrollPosition(scrollPosition);
        setScrollTop(scrollTop);

        // load more if over threshold
        if (Math.abs(scrollTop + rect.height - scrollPosition - window.innerHeight) <= loadMoreThreshold) {
          loadMore();
        }
      }
    }
  };

  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  // const [prevWidth, setPrevWidth] = useState(width);
  const columnItems = useMemo(calculateColumnItems, [columnCount, items.length, galleryId]);

  useEffect(() => {
    window.addEventListener('containerScroll', handleScroll);

    return () => {
      window.removeEventListener('containerScroll', handleScroll);
    };
  });

  useEffect(() => {
    saveScrollPosition(galleryId, scrollPosition, scrollTop);
  }, [scrollPosition, scrollTop]);

  useEffect(() => {
    setScrollPosition(savedScrollPosition);
    setScrollTop(savedScrollTop);
    animateScroll.scrollTo(savedScrollPosition, {
      duration: 0,
      delay: 0,
      containerId: 'scroll-container',
    });
  }, [galleryId]);

  // TODO: Fix this
  // useEffect(() => {
  //   // maintain relative scroll pos when resizing
  //   if (prevWidth !== width) {
  //     const { current } = containerRef;
  //     if (current) {
  //       const rect = current.getBoundingClientRect();
  //       if (rect) {
  //         const whRatio = rect.height / rect.width;
  //         const dHeight = (width * whRatio) / (prevWidth * whRatio);
  //         animateScroll.scrollTo(scrollPosition * dHeight, {
  //           duration: 0,
  //           delay: 0,
  //           containerId: 'scroll-container',
  //         });
  //       }
  //     }

  //     setPrevWidth(width);
  //   }
  // }, [width]);

  const renderColumn = (columnItem) => {
    const { innerHeight } = window;
    const { id, items: colItems } = columnItem;

    // Don't start rendering columns until width is established
    if (width <= 0) {
      return null;
    }

    return (
      <Virtualized
        key={id}
        getDimensionsForItem={getAdjustedDimensionsForItem}
        items={colItems}
        length={colItems.length}
        innerHeight={innerHeight}
        overscan={overscan}
        scrollPosition={scrollPosition}
        scrollTop={scrollTop}
        width={width / columnCount}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={classes.columnContainer}
      style={{ minHeight: `${savedScrollPosition + window.innerHeight}px` }}
    >
      {columnItems.map(renderColumn)}
    </div>
  );
};

VirtualizedMasonry.defaultProps = {
  columnCount: 1,
  loadMoreThreshold: 1000,
  overscan: 0,
  width: 0,
  gutter: 8,
};

VirtualizedMasonry.propTypes = {
  // required
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  getHeightForItem: PropTypes.func.isRequired,
  getWidthForItem: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,

  // selectors
  galleryId: PropTypes.string.isRequired,
  savedScrollPosition: PropTypes.number.isRequired,
  savedScrollTop: PropTypes.number.isRequired,

  // actions
  saveScrollPosition: PropTypes.func.isRequired,

  // optional
  columnCount: PropTypes.number,
  loadMoreThreshold: PropTypes.number,
  overscan: PropTypes.number,
  gutter: PropTypes.number,
  width: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const propsAreEqual = (prevProps, nextProps) =>
  nextProps.galleryId === prevProps.galleryId &&
  nextProps.items.length === prevProps.items.length &&
  nextProps.width === prevProps.width &&
  nextProps.loadMore === prevProps.loadMore &&
  nextProps.columnCount === prevProps.columnCount &&
  nextProps.loadMoreThreshold === prevProps.loadMoreThreshold &&
  nextProps.overscan === prevProps.overscan &&
  nextProps.gutter === prevProps.gutter;

const mapStateToProps = createStructuredSelector({
  galleryId: galleryIdSelector,
  savedScrollPosition: savedScrollPositionSelector,
  savedScrollTop: savedScrollTopSelector,
});

const mapDispatchToProps = {
  saveScrollPosition: moduleActions.saveScrollPosition,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(memo(VirtualizedMasonry, propsAreEqual));
