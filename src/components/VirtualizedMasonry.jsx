import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import Virtualized from './Virtualized';

const styles = () => ({
  column: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  columnContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
    justifyContent: 'center',
  },
});

class VirtualizedMasonry extends PureComponent {
  constructor(props) {
    super(props);

    const { columnCount } = props;
    this.containerRef = createRef();
    this.state = {
      width: 0,
      height: 0,
      scrollPosition: 0,
      scrollTop: 0,
      innerHeight: 0,
      totalItems: 0,
      columnItems: [...Array(columnCount)].map(() => ({ items: [], height: 0 })), // columnItems include a list of indexes of items in each column, and a total column size
    };

    this.itemDimensionsMemoizer = _.memoize(this.getDimensionsForItem);
  }

  componentDidMount = () => {
    const { location } = this.props;
    this.recalculateColumnItems();
    this.restoreScrollPosition(location.pathname);
    window.addEventListener('scroll', this.handleScroll);
  };

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    this.recalculateColumnItems();
    if (location.pathname !== prevLocation.pathname) {
      this.restoreScrollPosition(location.pathname);
    }
  }

  componentWillUnmount = () => {
    const { location } = this.props;

    this.saveScrollPosition(location.pathname);
    window.removeEventListener('scroll', this.handleScroll);
  };

  recalculateColumnItems() {
    const { columnCount, length } = this.props;
    let { columnItems, totalItems } = this.state;
    let requiresUpdate = false;

    // ensure each column has an entry
    if (columnItems.length !== columnCount) {
      columnItems = [];
      for (let i = 0; i < columnCount; i += 1) {
        columnItems.push({ items: [], height: 0 });
      }

      requiresUpdate = true;
    }

    // fill in column items with the missing indices
    if (totalItems !== length) {
      for (let i = totalItems; i < length; i += 1) {
        const minHeightColumn = columnItems.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
        minHeightColumn.items.push(i);
        minHeightColumn.height += this.getAdjustedHeightForItem(i);
      }

      totalItems = length;
      requiresUpdate = true;
    }

    if (requiresUpdate) {
      this.setState({ columnItems, totalItems });
    }
  }

  handleLoadMore = () => {
    const { loadMore, isLoading } = this.props;

    if (!isLoading) {
      loadMore();
    }
  };

  saveScrollPosition = pathname => {
    const value = JSON.stringify({ ...this.state });
    sessionStorage.setItem(pathname, value);
  };

  restoreScrollPosition = pathname => {
    const value = sessionStorage.getItem(pathname);

    if (value !== null) {
      const newState = JSON.parse(value);

      if (newState.scrollPosition > 0) {
        this.setState({ ...newState });
        window.requestAnimationFrame(() => {
          window.scrollTo(0, newState.scrollPosition);
        });
      }
    }
  };

  getDimensionsForItem = i => {
    const { getWidthForItem, getHeightForItem } = this.props;

    this.timesAskedForDims += 1;
    return { width: getWidthForItem(i), height: getHeightForItem(i) };
  };

  getAdjustedHeightForItem = i => {
    this.calculations += 1;
    const { columnCount, fitToWindow, gutter } = this.props;
    const { width, innerHeight } = this.state;

    if (width <= 0 || innerHeight <= 0) {
      const { height } = this.itemDimensionsMemoizer(i);
      return height;
    }

    const columnWidth = width / columnCount - 2 * gutter;
    const { width: itemWidth, height: itemHeight } = this.itemDimensionsMemoizer(i);
    const calculatedWidth = Math.min(itemWidth, columnWidth);
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth + 2 * gutter;

    if (fitToWindow) {
      return Math.min(calculatedHeight, innerHeight);
    }

    return calculatedHeight;
  };

  handleScroll = () => {
    const { loadMoreThreshhold } = this.props;
    const { current } = this.containerRef;
    if (current === undefined) {
      return;
    }

    const rect = current.getBoundingClientRect();
    if (rect) {
      const scrollPosition = window.scrollY;
      const scrollTop = window.scrollY + rect.top;
      this.setState({ scrollPosition, scrollTop });
      if (Math.abs(scrollTop + rect.height - scrollPosition - window.innerHeight) <= loadMoreThreshhold) {
        this.handleLoadMore();
      }
    }
  };

  handleResize = () => {
    const { current } = this.containerRef;
    if (current === undefined) {
      return;
    }

    const width = current.clientWidth;
    const height = current.clientHeight;
    const { innerHeight } = window;

    this.handleScroll();
    this.setState({ width, height, innerHeight });
  };

  renderColumn = columnNumber => {
    const { length, overscan, renderItem, columnCount, classes } = this.props;
    const { width, height, scrollPosition, scrollTop, innerHeight, columnItems } = this.state;
    const { items } = columnItems[columnNumber];

    return (
      <div className={classes.column} key={columnNumber}>
        <Virtualized
          items={items}
          length={length}
          overscan={overscan}
          getHeightForItem={this.getAdjustedHeightForItem}
          renderItem={renderItem}
          width={width / columnCount}
          height={height}
          scrollPosition={scrollPosition}
          scrollTop={scrollTop}
          innerHeight={innerHeight}
        />
      </div>
    );
  };

  render() {
    const { columnCount, classes } = this.props;

    return (
      <div ref={this.containerRef} className={classes.columnContainer}>
        <ReactResizeDetector handleWidth onResize={this.handleResize} />
        {[...Array(columnCount).keys()].map(this.renderColumn)}
      </div>
    );
  }
}

VirtualizedMasonry.defaultProps = {
  overscan: 0,
  loadMoreThreshhold: 1000,
  columnCount: 1,
  fitToWindow: false,
  gutter: 8,
};

VirtualizedMasonry.propTypes = {
  renderItem: PropTypes.func.isRequired,
  getHeightForItem: PropTypes.func.isRequired,
  getWidthForItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
  overscan: PropTypes.number,
  loadMoreThreshhold: PropTypes.number,
  columnCount: PropTypes.number,
  fitToWindow: PropTypes.bool,
  gutter: PropTypes.number,
};

export default compose(withStyles(styles), withRouter)(VirtualizedMasonry);
