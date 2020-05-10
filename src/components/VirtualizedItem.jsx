import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = () => ({
  item: {
    display: 'flex',
    position: 'absolute',
  },
});

const VirtualizedItem = (props) => {
  const { classes, width, itemHeight, itemTop, renderItem } = props;

  if (calculateVisible(props)) {
    return (
      <div className={classes.item} style={{ width: `${width}px`, height: `${itemHeight}px`, top: `${itemTop}px` }}>
        {renderItem()}
      </div>
    );
  }

  return null;
};

VirtualizedItem.defaultProps = {
  innerHeight: 0,
  overscan: 0,
  scrollPosition: 0,
  scrollTop: 0,
  width: 0,
  itemTop: 0,
  itemHeight: 0,
};

VirtualizedItem.propTypes = {
  // required
  renderItem: PropTypes.func.isRequired,

  // optional
  itemTop: PropTypes.number,
  itemHeight: PropTypes.number,
  width: PropTypes.number,
  /* eslint-disable react/no-unused-prop-types */
  innerHeight: PropTypes.number,
  overscan: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  /* eslint-enable react/no-unused-prop-types */

  // from withStyles
  classes: PropTypes.object.isRequired,
};

const calculateVisible = ({ itemTop, itemHeight, scrollPosition, innerHeight, scrollTop, overscan }) => {
  const itemBottom = itemTop + itemHeight;
  const windowBottom = scrollPosition + innerHeight - scrollTop + overscan;
  const windowTop = scrollPosition - scrollTop - overscan;
  return (
    (itemTop >= windowTop && itemTop <= windowBottom) || // top of item is on screen
    (itemBottom >= windowTop && itemBottom <= windowBottom) || // bottom of item is on screen
    (itemTop <= windowTop && itemBottom >= windowBottom) // item is larger than screen, middle is on screen
  );
};

const compareProps = (prevProps, nextProps) => {
  return (
    prevProps.itemTop === nextProps.itemTop &&
    prevProps.itemHeight === nextProps.itemHeight &&
    prevProps.width === nextProps.width &&
    calculateVisible(prevProps) === calculateVisible(nextProps)
  );
};

export default memo(withStyles(styles)(VirtualizedItem), compareProps);
