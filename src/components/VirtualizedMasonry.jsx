import React, { PureComponent, createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { animateScroll } from 'react-scroll';

import Virtualized from './Virtualized';

const styles = () => ({
  columnContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    position: 'relative',
  },
});

class VirtualizedMasonry extends PureComponent {
  constructor(props) {
    super(props);

    // initialize
    this.itemDimensionsMemoizer = _.memoize(this.getDimensionsForItem);
    const { columnCount, pathKey } = props;
    const columnItems = [...Array(columnCount).keys()].map((id) => ({ height: 0, id, items: [] }));
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
    const restoredState = this.restoreScrollPosition(pathKey);
    if (restoredState) {
      this.state = { ...this.state, ...restoredState };

      // update positions
      const updatedState = this.recalculateColumnItems();
      if (updatedState) {
        this.state = { ...this.state, ...updatedState };
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    // handle resize events
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
    animateScroll.scrollTo(scrollPosition, {
      duration: 0,
      delay: 0,
      containerId: 'scroll-container',
    });

    // add event listeners (after done scrolling)
    window.addEventListener('continerScroll', this.handleScroll);
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
    window.removeEventListener('continerScroll', this.handleScroll);

    // save state in session
    this.saveScrollPosition();
  };

  recalculateColumnItems() {
    const { columnCount, length } = this.props;
    let { columnItems, height, totalItems } = this.state;
    let requiresUpdate = false;

    // ensure each column has an entry
    if (columnItems.length !== columnCount) {
      columnItems = [...Array(columnCount).keys()].map((id) => ({ height: 0, id, items: [] }));
      requiresUpdate = true;
      totalItems = 0;
    }

    // fill in column items with the missing indices
    if (totalItems !== length) {
      for (let i = totalItems; i < length; i += 1) {
        columnItems = columnItems.map((c) => ({ ...c, items: [...c.items] })); // deep copy
        const minHeightColumn = columnItems.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
        minHeightColumn.items.push(i);
        minHeightColumn.height += this.getAdjustedDimensionsForItem(i).height;
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
    const { pathKey } = this.props;
    const { columnItems, totalItems, ...rest } = this.state;

    sessionStorage.setItem(pathKey, JSON.stringify(rest));
  };

  restoreScrollPosition = () => {
    const { pathKey } = this.props;

    const value = sessionStorage.getItem(pathKey);
    if (value !== null) {
      return JSON.parse(value);
    }

    return null;
  };

  getDimensionsForItem = (itemId) => {
    const { getHeightForItem, getWidthForItem } = this.props;
    return { height: getHeightForItem(itemId), width: getWidthForItem(itemId) };
  };

  getAdjustedDimensionsForItem = (itemId) => {
    const { columnCount, gutter } = this.props;
    const { innerHeight, width } = this.state;

    // if unable to calculate dimensions, return actual dimensions
    if (width <= 0 || innerHeight <= 0) {
      return this.itemDimensionsMemoizer(itemId);
    }

    const columnWidth = width / columnCount - gutter;
    const { height: itemHeight, width: itemWidth } = this.itemDimensionsMemoizer(itemId);
    const calculatedWidth = Math.min(itemWidth, columnWidth);
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth;

    return { height: calculatedHeight, width: calculatedWidth };
  };

  handleScroll = (event) => {
    const { loadMoreThreshold } = this.props;
    const { current } = this.containerRef;
    const scrollY = event.detail;

    if (current) {
      const rect = current.getBoundingClientRect();
      if (rect) {
        // we've made it here, so dimensions are available
        // use them to set our current scroll position
        const scrollPosition = scrollY;
        const scrollTop = scrollY + rect.top;
        this.setState({ scrollPosition, scrollTop });

        // load more if over threshold
        if (Math.abs(scrollTop + rect.height - scrollPosition - window.innerHeight) <= loadMoreThreshold) {
          this.handleLoadMore();
        }
      }
    }
  };

  renderColumn = (columnItem) => {
    const { columnCount, overscan, renderItem } = this.props;
    const { innerHeight, scrollPosition, scrollTop, width } = this.state;
    const { id, items } = columnItem;

    return (
      <Virtualized
        key={id}
        getDimensionsForItem={this.getAdjustedDimensionsForItem}
        items={items}
        length={items.length}
        renderItem={renderItem}
        innerHeight={innerHeight}
        overscan={overscan}
        scrollPosition={scrollPosition}
        scrollTop={scrollTop}
        width={width / columnCount}
      />
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
  loadMoreThreshold: 1000,
  overscan: 0,
  width: 0,
  gutter: 8,
};

VirtualizedMasonry.propTypes = {
  // required
  getHeightForItem: PropTypes.func.isRequired,
  getWidthForItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  length: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  pathKey: PropTypes.string.isRequired,

  // optional
  columnCount: PropTypes.number,
  loadMoreThreshold: PropTypes.number,
  overscan: PropTypes.number,
  width: PropTypes.number,
  gutter: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VirtualizedMasonry);
