import React, { memo } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import MasonryItem from './MasonryItem';

const VirtualizedItem = ({ width, height, top, itemId, left, innerHeight, overscan, scrollPosition, scrollTop }) => (
  <MasonryItem
    itemId={itemId}
    visible={calculateVisible({ top, height, scrollPosition, innerHeight, scrollTop, overscan })}
    left={left}
    top={top}
    width={width}
    height={height}
    scrollTop={scrollTop}
  />
);

VirtualizedItem.defaultProps = {
  innerHeight: 0,
  overscan: 0,
  scrollPosition: 0,
  scrollTop: 0,
  width: 0,
  top: 0,
  height: 0,
  left: 0,
};

VirtualizedItem.propTypes = {
  // required
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  // optional
  height: PropTypes.number,
  innerHeight: PropTypes.number,
  left: PropTypes.number,
  overscan: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number,
};

const calculateVisible = ({ top, height, scrollPosition, innerHeight, scrollTop, overscan }) => {
  const itemBottom = top + height;
  const windowBottom = scrollPosition + innerHeight - scrollTop + overscan;
  const windowTop = scrollPosition - scrollTop - overscan;

  return (
    (top >= windowTop && top <= windowBottom) || // top of item is on screen
    (itemBottom >= windowTop && itemBottom <= windowBottom) || // bottom of item is on screen
    (top <= windowTop && itemBottom >= windowBottom) // item is larger than screen, middle is on screen
  );
};

const compareProps = (prevProps, nextProps) =>
  prevProps.top === nextProps.top &&
  prevProps.height === nextProps.height &&
  prevProps.width === nextProps.width &&
  calculateVisible(prevProps) === calculateVisible(nextProps);

export default memo(VirtualizedItem, compareProps);
