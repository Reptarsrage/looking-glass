import React, { PureComponent, createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withResizeDetector } from 'react-resize-detector';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { compose } from 'redux';

import Virtualized from './Virtualized';

const styles = () => ({
  column: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  columnContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
  },
});

class VirtualizedMasonry extends PureComponent {
  constructor(props) {
    super(props);

    // initialize
    this.itemDimensionsMemoizer = _.memoize(this.getDimensionsForItem);
    const { columnCount, location } = props;
    const columnItems = [...Array(columnCount).keys()].map(id => ({ height: 0, id, items: [] }));
    this.state = {
      columnItems,
      height: 0,
      innerHeight: 0,
      scrollPosition: 0,
      scrollTop: 0,
      totalItems: 0,
      width: 0,
    };

    // create ref
    this.containerRef = createRef();

    // restore previous state
    const restoredState = this.restoreScrollPosition(location.pathname);
    if (restoredState) {
      this.state = { ...this.state, ...restoredState };

      // update positions
      const updatedState = this.recalculateColumnItems();
      if (updatedState) {
        this.setState({ ...updatedState });
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    // handle resize event from hoc
    if (props.width > 0 && props.width !== state.width) {
      const { innerHeight } = window;
      return {
        innerHeight,
        width: props.width,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount = () => {
    const { scrollPosition } = this.state;

    // restore scroll position
    window.requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);

      // add event listeners (after done scrolling)
      window.addEventListener('scroll', this.handleScroll);
    });
  };

  componentDidUpdate() {
    // update positions
    const updatedState = this.recalculateColumnItems();
    if (updatedState) {
      this.setState({ ...updatedState });
    }
  }

  componentWillUnmount = () => {
    // remove event listeners
    window.removeEventListener('scroll', this.handleScroll);

    // save state in session
    this.saveScrollPosition();
  };

  recalculateColumnItems() {
    const { columnCount, length } = this.props;
    let { columnItems, height, totalItems } = this.state;
    let requiresUpdate = false;

    // ensure each column has an entry
    if (columnItems.length !== columnCount) {
      columnItems = [...Array(columnCount).keys()].map(id => ({ height: 0, id, items: [] }));
      requiresUpdate = true;
      totalItems = 0;
    }

    // fill in column items with the missing indices
    if (totalItems !== length) {
      for (let i = totalItems; i < length; i += 1) {
        columnItems = columnItems.map(c => ({ ...c, items: [...c.items] })); // deep copy
        const minHeightColumn = columnItems.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
        minHeightColumn.items.push(i);
        minHeightColumn.height += this.getAdjustedHeightForItem(i);
      }

      const maxHeightColumn = columnItems.reduce((prev, curr) => (prev.height > curr.height ? prev : curr));
      ({ height } = maxHeightColumn);
      totalItems = length;
      requiresUpdate = true;
    }

    if (requiresUpdate) {
      return { columnItems, height, totalItems };
    }

    return null;
  }

  handleLoadMore = () => {
    const { isLoading, loadMore } = this.props;
    if (!isLoading) {
      loadMore();
    }
  };

  saveScrollPosition = () => {
    const { location } = this.props;
    const { columnItems, totalItems, ...rest } = this.state;

    sessionStorage.setItem(location.pathname, JSON.stringify(rest));
  };

  restoreScrollPosition = () => {
    const { location } = this.props;

    const value = sessionStorage.getItem(location.pathname);
    if (value !== null) {
      return JSON.parse(value);
    }

    return null;
  };

  getDimensionsForItem = itemId => {
    const { getHeightForItem, getWidthForItem } = this.props;
    return { height: getHeightForItem(itemId), width: getWidthForItem(itemId) };
  };

  getAdjustedHeightForItem = itemId => {
    const { columnCount, fitToWindow, gutter } = this.props;
    const { innerHeight, width } = this.state;

    // if unable to calculate height, return actual height
    if (width <= 0 || innerHeight <= 0) {
      const { height } = this.itemDimensionsMemoizer(itemId);
      return height;
    }

    const columnWidth = width / columnCount - 2 * gutter;
    const { height: itemHeight, width: itemWidth } = this.itemDimensionsMemoizer(itemId);
    const calculatedWidth = Math.min(itemWidth, columnWidth);
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth + 2 * gutter;

    if (fitToWindow) {
      return Math.min(calculatedHeight, innerHeight);
    }

    return calculatedHeight;
  };

  handleScroll = () => {
    const { loadMoreThreshold } = this.props;
    const { current } = this.containerRef;
    if (current) {
      const rect = current.getBoundingClientRect();
      if (rect) {
        // we've made it here, so dimensions are available
        // use them to set our current scroll position
        const scrollPosition = window.scrollY;
        const scrollTop = window.scrollY + rect.top;
        this.setState({ scrollPosition, scrollTop });

        // load more if over threshold
        if (Math.abs(scrollTop + rect.height - scrollPosition - window.innerHeight) <= loadMoreThreshold) {
          this.handleLoadMore();
        }
      }
    }
  };

  renderColumn = columnItem => {
    const { classes, columnCount, overscan, renderItem } = this.props;
    const { innerHeight, scrollPosition, scrollTop, width } = this.state;
    const { id, items } = columnItem;

    return (
      <div className={classes.column} key={id}>
        <Virtualized
          getHeightForItem={this.getAdjustedHeightForItem}
          items={items}
          length={items.length}
          renderItem={renderItem}
          innerHeight={innerHeight}
          overscan={overscan}
          scrollPosition={scrollPosition}
          scrollTop={scrollTop}
          width={width / columnCount}
        />
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    const { columnItems, height } = this.state;

    return (
      <div ref={this.containerRef} className={classes.columnContainer} style={{ minHeight: `${height}px` }}>
        {columnItems.map(this.renderColumn)}
      </div>
    );
  }
}

VirtualizedMasonry.defaultProps = {
  columnCount: 1,
  fitToWindow: false,
  gutter: 8,
  loadMoreThreshold: 1000,
  overscan: 0,
  width: 0,
};

VirtualizedMasonry.propTypes = {
  // required
  getHeightForItem: PropTypes.func.isRequired,
  getWidthForItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  length: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,

  // optional
  columnCount: PropTypes.number,
  fitToWindow: PropTypes.bool,
  gutter: PropTypes.number,
  loadMoreThreshold: PropTypes.number,
  overscan: PropTypes.number,

  // withRouter
  location: ReactRouterPropTypes.location.isRequired,

  // withResizeDetector
  width: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

export default compose(withResizeDetector, withStyles(styles), withRouter)(VirtualizedMasonry);
