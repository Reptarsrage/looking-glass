import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Positioner from './positioner';
import VirtualizedItem from './VirtualizedItem';

const styles = () => ({
  container: {
    flex: '1 1 auto',
    position: 'relative',
  },
});

class Virtualized extends Component {
  constructor(props) {
    super(props);

    this.positioner = new Positioner();
    this.getDimensionsForItemMemoizer = _.memoize(props.getDimensionsForItem);

    this.state = {
      totalHeight: this.calculateTotalHeight(0),
    };
  }

  shouldComponentUpdate(nextProps) {
    const { length, overscan, scrollPosition, scrollTop, width } = this.props;

    return (
      nextProps.length !== length ||
      nextProps.overscan !== overscan ||
      nextProps.scrollPosition !== scrollPosition ||
      nextProps.scrollTop !== scrollTop ||
      nextProps.width !== width
    );
  }

  componentDidUpdate(prevProps) {
    const { width: prevWidth, length: prevLength } = prevProps;
    const { width, length } = this.props;
    let from = prevLength;

    // If width changed, clear cache and force re-calculate ALL heights
    if (width !== prevWidth) {
      this.getDimensionsForItemMemoizer.cache = new _.memoize.Cache();
      from = 0;
    }

    // If items length changed, or resized, calculate heights
    if (width !== prevWidth || length !== prevLength) {
      const totalHeight = this.calculateTotalHeight(from);
      this.setState({ totalHeight });
    }
  }

  calculateTotalHeight = (from) => {
    const { items, gutter } = this.props;

    const offset = from === 0 ? 0 : undefined;
    const itemsToUpdate = items.slice(from).map((id) => ({ height: this.getDimensionsForItemMemoizer(id).height, id }));
    this.positioner.updatePositions(itemsToUpdate, offset, gutter);
    return this.positioner.getTotalHeight();
  };

  render() {
    const {
      classes,
      items,
      innerHeight,
      overscan,
      renderItem,
      scrollPosition,
      scrollTop,
      width: columnWidth,
    } = this.props;
    const { totalHeight } = this.state;

    return (
      <div className={classes.container} style={{ minHeight: `${totalHeight}px` }}>
        {items.map((itemId) => {
          const { height, width } = this.getDimensionsForItemMemoizer(itemId);
          const left = (columnWidth - width) / 2.0;

          return (
            <VirtualizedItem
              key={itemId}
              renderItem={renderItem}
              itemId={itemId}
              innerHeight={innerHeight}
              overscan={overscan}
              scrollPosition={scrollPosition}
              scrollTop={scrollTop}
              width={width}
              top={this.positioner.getPositionForItem(itemId)}
              height={height}
              left={left}
            />
          );
        })}
      </div>
    );
  }
}

Virtualized.defaultProps = {
  gutter: 8,
  innerHeight: 0,
  overscan: 0,
  scrollPosition: 0,
  scrollTop: 0,
  width: 0,
};

Virtualized.propTypes = {
  // required
  getDimensionsForItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  length: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,

  // optional
  innerHeight: PropTypes.number,
  overscan: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  width: PropTypes.number,
  gutter: PropTypes.number,

  // from withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Virtualized);
