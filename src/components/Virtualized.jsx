import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Positioner from './positioner';

const styles = () => ({
  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
  },
  item: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
  },
  itemInner: {
    display: 'flex',
    flex: '1 1 auto',
    position: 'relative',
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
    this.positioner.updatePositions(items.map(id => ({ height: this.getHeightForItemMemoizer(id), id })));
    return this.positioner.getTotalHeight();
  };

  renderItem = i => {
    const { classes, innerHeight, overscan, renderItem, scrollPosition, scrollTop } = this.props;

    const itemTop = this.positioner.getPositionForItem(i);
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
    const { classes, items } = this.props;
    const { totalHeight } = this.state;

    return (
      <div className={classes.container} style={{ minHeight: `${totalHeight}px` }}>
        {items.map(this.renderItem)}
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
