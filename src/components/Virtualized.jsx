import React, { memo, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import VirtualizedItem from './VirtualizedItem';

const styles = () => ({
  container: {
    flex: '1 1 auto',
    position: 'relative',
  },
});

const Virtualized = ({
  classes,
  items,
  innerHeight,
  overscan,
  scrollPosition,
  scrollTop,
  gutter,
  width,
  length,
  getDimensionsForItem,
}) => {
  const computeDimensions = () => {
    const lookup = {};
    let total = 0;
    items.forEach((id) => {
      const dims = getDimensionsForItem(id);
      lookup[id] = { ...dims, top: total };
      total += dims.height + gutter;
    });

    return [lookup, total];
  };

  const [itemDimensions, totalHeight] = useMemo(computeDimensions, [width, length]);
  return (
    <div className={classes.container} style={{ minHeight: `${totalHeight}px` }}>
      {items.map((itemId) => (
        <VirtualizedItem
          key={itemId}
          itemId={itemId}
          innerHeight={innerHeight}
          overscan={overscan}
          scrollPosition={scrollPosition}
          scrollTop={scrollTop}
          width={itemDimensions[itemId].width}
          top={itemDimensions[itemId].top}
          height={itemDimensions[itemId].height}
          left={itemDimensions[itemId].left}
        />
      ))}
    </div>
  );
};

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
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  length: PropTypes.number.isRequired,

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

const propsAreEqual = (prevProps, nextProps) =>
  nextProps.scrollPosition === prevProps.scrollPosition &&
  nextProps.scrollTop === prevProps.scrollTop &&
  nextProps.length === prevProps.length &&
  nextProps.overscan === prevProps.overscan &&
  nextProps.width === prevProps.width;

export default withStyles(styles)(memo(Virtualized, propsAreEqual));
