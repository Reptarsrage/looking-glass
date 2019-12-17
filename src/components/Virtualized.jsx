import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import Positioner from './positioner';

const styles = () => ({
  item: {
    position: 'absolute',
    width: '100%',
  },
  itemInner: {
    position: 'relative',
    height: '100%',
  },
  container: {
    flex: '1',
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
    justifyContent: 'center',
  },
});

class Virtualized extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      minHeight: 0,
    };

    this.positioner = new Positioner();
    this.getHeightForItemMemoizer = _.memoize(props.getHeightForItem);
    this.update();
  }

  componentDidUpdate(prevProps) {
    const { length: prevLength, width: prevWidth } = prevProps;
    const { length, width } = this.props;
    if (length !== prevLength || width !== prevWidth) {
      this.update();
      const minHeight = this.positioner.getTotalHeight();
      this.setState({ minHeight });
    }
  }

  update = () => {
    const { items } = this.props;
    this.getHeightForItemMemoizer.cache = new _.memoize.Cache();
    this.positioner.updatePositions(items.map(id => ({ id, height: this.getHeightForItemMemoizer(id) })));
  };

  renderItem = i => {
    const { renderItem, overscan, innerHeight, scrollTop, scrollPosition, classes } = this.props;

    const itemTop = this.positioner.getHeightForItem(i);
    const itemHeight = this.getHeightForItemMemoizer(i);
    const itemBottom = itemTop + itemHeight;
    const windowBottom = scrollPosition + innerHeight - scrollTop + overscan;
    const windowTop = scrollPosition - scrollTop - overscan;

    if (
      (itemTop >= windowTop && itemTop <= windowBottom) || // top of item is on screen
      (itemBottom >= windowTop && itemBottom <= windowBottom) || // bottom of item is on screen
      (itemTop <= windowTop && itemBottom >= windowBottom) // item is larger than screen, middle is on screen
    ) {
      return (
        <div className={classes.item} key={i} style={{ height: `${itemHeight}px`, top: `${itemTop}px` }}>
          <div className={classes.itemInner}>{renderItem(i)}</div>
        </div>
      );
    }

    return null;
  };

  render() {
    const { items, classes } = this.props;
    const { minHeight } = this.state;

    return (
      <div className={classes.container} style={{ minHeight: `${minHeight}px` }}>
        {items.map(this.renderItem)}
      </div>
    );
  }
}

Virtualized.defaultProps = {
  overscan: 0,
  width: 0,
  scrollPosition: 0,
  scrollTop: 0,
  innerHeight: 0,
};

Virtualized.propTypes = {
  renderItem: PropTypes.func.isRequired,
  getHeightForItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  length: PropTypes.number.isRequired,
  overscan: PropTypes.number,
  width: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  innerHeight: PropTypes.number,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Virtualized);
