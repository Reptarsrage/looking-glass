import React, { Component, createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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

class VirtualizedMasonry extends Component {
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      columnItems: [],
      scrollPosition: 0,
      scrollTop: 0,
      totalItems: 0,
    };

    // create ref
    this.containerRef = createRef();

    // update positions
    const { columnCount, items, getHeightForItem } = props;
    const updatedState = this.calculateColumnItems({ columnCount, items, getHeightForItem });
    if (updatedState) {
      this.state = { ...this.state, ...updatedState };
    }
  }

  componentDidMount = () => {
    // add event listeners (after done scrolling)
    window.addEventListener('containerScroll', this.handleScroll);
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { columnCount, loadMoreThreshold, overscan, gutter, width } = this.props;
    const { scrollPosition, scrollTop, totalItems } = this.state;

    return (
      nextState.scrollPosition !== scrollPosition ||
      nextState.scrollTop !== scrollTop ||
      nextState.totalItems !== totalItems ||
      nextProps.columnCount !== columnCount ||
      nextProps.loadMoreThreshold !== loadMoreThreshold ||
      nextProps.overscan !== overscan ||
      nextProps.gutter !== gutter ||
      nextProps.width !== width
    );
  }

  componentDidUpdate() {
    const { columnCount, items, getHeightForItem } = this.props;

    // update positions
    const updatedState = this.calculateColumnItems({ columnCount, items, getHeightForItem });
    if (updatedState) {
      this.setState({ ...updatedState });
    }
  }

  componentWillUnmount = () => {
    // remove event listeners
    window.removeEventListener('containerScroll', this.handleScroll);
  };

  calculateColumnItems({ columnCount, items, getHeightForItem }) {
    let { columnItems, totalItems } = this.state;
    let requiresUpdate = false;

    // ensure each column has an entry
    if (columnItems.length !== columnCount) {
      columnItems = [...Array(columnCount).keys()].map((id) => ({ height: 0, id, items: [] }));
      requiresUpdate = true;
      totalItems = 0;
    }

    // fill in column items with the missing indices
    if (totalItems !== items.length) {
      for (let i = totalItems; i < items.length; i += 1) {
        const itemId = items[i];
        columnItems = columnItems.map((c) => ({ ...c, items: [...c.items] })); // deep copy
        const minHeightColumn = columnItems.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
        minHeightColumn.items.push(itemId);
        minHeightColumn.height += getHeightForItem(itemId);
      }

      totalItems = items.length;
      requiresUpdate = true;
    }

    if (requiresUpdate) {
      return { columnItems, totalItems };
    }

    return null;
  }

  getAdjustedDimensionsForItem = (itemId) => {
    const { columnCount, gutter, width, getHeightForItem, getWidthForItem } = this.props;

    const columnWidth = width / columnCount - gutter;
    const itemHeight = getHeightForItem(itemId);
    const itemWidth = getWidthForItem(itemId);
    const calculatedWidth = Math.min(itemWidth, columnWidth);
    const calculatedHeight = (itemHeight / itemWidth) * calculatedWidth;
    const calculatedLeft = (columnWidth - calculatedWidth) / 2.0;

    return { height: calculatedHeight, width: calculatedWidth, left: calculatedLeft };
  };

  handleScroll = (event) => {
    const { loadMoreThreshold, loadMore } = this.props;
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
          loadMore();
        }
      }
    }
  };

  renderColumn = (columnItem) => {
    const { columnCount, overscan, width } = this.props;
    const { scrollPosition, scrollTop } = this.state;
    const { innerHeight } = window;
    const { id, items } = columnItem;

    // Don't start rendering columns until width is established
    if (width <= 0) {
      return null;
    }

    return (
      <Virtualized
        key={id}
        getDimensionsForItem={this.getAdjustedDimensionsForItem}
        items={items}
        length={items.length}
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
    const { columnItems } = this.state;

    return (
      <div ref={this.containerRef} className={classes.columnContainer}>
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
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  getHeightForItem: PropTypes.func.isRequired,
  getWidthForItem: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,

  // optional
  columnCount: PropTypes.number,
  loadMoreThreshold: PropTypes.number,
  overscan: PropTypes.number,
  gutter: PropTypes.number,
  width: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VirtualizedMasonry);
