import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ReactRouterPropTypes from 'react-router-prop-types';

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
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

class ListView extends Component {
  constructor(props) {
    super(props);

    this.width = 0;
    this.columnHeight = 0;
    this.columnWidth = 0; // keeps track of the column width calculated by the AutoSizer
    this.columnRefs = []; // holds references to the react-virtualized List in each column

    this.state = {
      gutterSize: 8, // size of margins/padding
      columnCount: 3, // total number of columns
      mainColumnIndex: 0, // this is the index of the column we use for infinite load
      fitToWindow: true,
    };

    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getItemHeight = this.getItemHeight.bind(this);
    this.getItemWidth = this.getItemWidth.bind(this);
  }

  loadMoreRows() {
    const { loadMore, loading, moduleId, galleryId } = this.props;
    if (!loading) {
      loadMore(moduleId, galleryId);
    }
  }

  isLoaded(index) {
    const { items } = this.props;
    return index < items.size;
  }

  getItemWidth(index) {
    const { items } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return items.get(index).get('width');
  }

  getItemHeight(index) {
    const { items } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return items.get(index).get('height');
  }

  renderRow(index) {
    const { classes } = this.props;

    if (!this.isLoaded(index)) {
      return null;
    }

    const { items, moduleId, onItemClick } = this.props;
    const item = items.get(index);

    return (
      <Box className={classes.masonryItemContainer}>
        <MasonryItem
          videoURL={item.get('videoURL')}
          imageURL={item.get('imageURL')}
          thumbURL={item.get('thumbURL')}
          isVideo={item.get('isVideo')}
          isGallery={item.get('isGallery')}
          title={item.get('title')}
          id={item.get('id')}
          galleryId={item.get('galleryId')}
          width={item.get('width')}
          height={item.get('height')}
          moduleId={moduleId}
          onClick={onItemClick}
        />
      </Box>
    );
  }

  render() {
    const { items, loading } = this.props;
    const { columnCount } = this.state;

    // TODO: allow transient errors
    //if (error) {
    //  return <AnErrorOccurred />;
    //}

    if (items.size === 0 && !loading) {
      return <NoResults />;
    }

    if (items.size === 0) {
      return <LoadingIndicator />;
    }

    return (
      <VirtualizedMasonry
        renderItem={this.renderRow}
        getHeightForItem={this.getItemHeight}
        getWidthForItem={this.getItemWidth}
        loadMore={this.loadMoreRows}
        isLoading={loading}
        length={items.size}
        overscan={500}
        loadMoreThreshhold={5000}
        columnCount={columnCount}
      />
    );
  }
}

ListView.propTypes = {
  classes: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  items: PropTypes.instanceOf(Immutable.List).isRequired,
  loading: PropTypes.bool.isRequired,
  moduleId: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ListView);
