import React, { memo } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const VirtualizedItem = (props) => {
  const { width, height, top, renderItem, itemId, left } = props;
  const visible = calculateVisible(props);

  return renderItem({ itemId, width, height, top, visible, left });
};

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
  renderItem: PropTypes.func.isRequired,
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  // optional
  top: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  left: PropTypes.number,

  /* eslint-disable react/no-unused-prop-types */
  innerHeight: PropTypes.number,
  overscan: PropTypes.number,
  scrollPosition: PropTypes.number,
  scrollTop: PropTypes.number,
  /* eslint-enable react/no-unused-prop-types */
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

const compareProps = (prevProps, nextProps) => {
  return (
    prevProps.top === nextProps.top &&
    prevProps.height === nextProps.height &&
    prevProps.width === nextProps.width &&
    calculateVisible(prevProps) === calculateVisible(nextProps)
  );
};

export default memo(VirtualizedItem, compareProps);
