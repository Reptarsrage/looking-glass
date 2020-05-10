import React, { PureComponent } from 'react';
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
  item: {
    display: 'flex',
    position: 'absolute',
  },
});

class Virtualized extends PureComponent {
  constructor(props) {
    super(props);

    this.positioner = new Positioner();
    this.getHeightForItemMemoizer = _.memoize(props.getHeightForItem);

    this.state = {
      totalHeight: this.update(),
    };
  }

  componentDidUpdate(prevProps) {
    const { length: prevLength, width: prevWidth } = prevProps;
    const { length, width } = this.props;
    if (length !== prevLength || width !== prevWidth) {
      const totalHeight = this.update();
      this.setState({ totalHeight });
    }
  }

  update = () => {
    const { items } = this.props;
    this.getHeightForItemMemoizer.cache = new _.memoize.Cache();
    this.positioner.updatePositions(items.map((id) => ({ height: this.getHeightForItemMemoizer(id), id })));
    return this.positioner.getTotalHeight();
  };

  render() {
    const { classes, items, innerHeight, overscan, renderItem, scrollPosition, scrollTop, width } = this.props;
    const { totalHeight } = this.state;

    return (
      <div className={classes.container} style={{ minHeight: `${totalHeight}px` }}>
        {items.map((itemId) => (
          <VirtualizedItem
            key={itemId}
            innerHeight={innerHeight}
            overscan={overscan}
            renderItem={() => renderItem(itemId)}
            scrollPosition={scrollPosition}
            scrollTop={scrollTop}
            width={width}
            itemTop={this.positioner.getPositionForItem(itemId)}
            itemHeight={this.getHeightForItemMemoizer(itemId)}
          />
        ))}
      </div>
    );
  }
}

Virtualized.defaultProps = {
  innerHeight: 0,
  overscan: 0,
  scrollPosition: 0,
  scrollTop: 0,
  width: 0,
};

Virtualized.propTypes = {
  // required
  getHeightForItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  length: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,

  // optional
  innerHeight: PropTypes.number,
  overscan: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  width: PropTypes.number,

  // from withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Virtualized);
