import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import NoResults from './NoResults';
import LoadingIndicator from './LoadingIndicator';
import VirtualizedMasonry from './VirtualizedMasonry';
import MasonryItem from './MasonryItem';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    padding: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flex: '1 1 auto',
  },
  masonryItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

class Masonry extends Component {
  constructor(props) {
    super(props);

    this.width = 0;
    this.columnHeight = 0;
    this.columnWidth = 0; // keeps track of the column width calculated by the AutoSizer
    this.columnRefs = []; // holds references to the react-virtualized List in each column

    this.state = {
      columnCount: 3, // total number of columns
    };
  }

  loadMoreRows = () => {
    const { loadMore, loading, moduleId, galleryId } = this.props;
    if (!loading) {
      loadMore(moduleId, galleryId);
    }
  };

  isLoaded = index => {
    const { items } = this.props;
    return index < items.length;
  };

  getItemWidth = index => {
    const { widths } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return widths[index]; // TODO: How to get this with normalized data?
  };

  getItemHeight = index => {
    const { heights } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return heights[index];
  };

  renderRow = index => {
    const { items, classes, moduleId, galleryId, onItemClick, gutter } = this.props;

    if (!this.isLoaded(index)) {
      return null;
    }

    return (
      <Box className={classes.masonryItemContainer} style={{ padding: `${gutter}px` }}>
        <MasonryItem
          moduleId={moduleId}
          galleryId={galleryId}
          itemId={items[index]}
          onClick={onItemClick}
          gutter={gutter}
        />
      </Box>
    );
  };

  render() {
    const { items, loading, error, gutter } = this.props;
    const { columnCount } = this.state;

    // TODO: allow transient errors
    if (error) {
      console.warn('Encountered an error', error);
    }

    if (items.length === 0 && !loading) {
      return <NoResults />;
    }

    if (items.length === 0) {
      return <LoadingIndicator />;
    }

    return (
      <VirtualizedMasonry
        renderItem={this.renderRow}
        getHeightForItem={this.getItemHeight}
        getWidthForItem={this.getItemWidth}
        loadMore={this.loadMoreRows}
        isLoading={loading}
        length={items.length}
        overscan={500}
        loadMoreThreshhold={5000}
        columnCount={columnCount}
        gutter={gutter}
      />
    );
  }
}

Masonry.defaultProps = {
  gutter: 8,
};

Masonry.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  heights: PropTypes.arrayOf(PropTypes.number).isRequired,
  widths: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool.isRequired,
  moduleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  galleryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  error: PropTypes.bool.isRequired,
  gutter: PropTypes.number,
  loadMore: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Masonry);
