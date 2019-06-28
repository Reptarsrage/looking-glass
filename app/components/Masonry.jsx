import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InfiniteLoader, List } from 'react-virtualized';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import NoResults from './NoResults';
import LoadingIndicator from './LoadingIndicator';
import WindowScroller from './WindowScroller';
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

    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
    this.onResize = this.onResize.bind(this);
    this.setColumnListRef = this.setColumnListRef.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  isRowLoaded = ({ index }) => {
    const { columnCount, mainColumnIndex } = this.state;
    const originalIndex = index * columnCount + mainColumnIndex;
    return this.isLoaded(originalIndex);
  };

  loadMoreRows() {
    const { loadMore, loading, moduleId, galleryId } = this.props;
    if (!loading) {
      loadMore(moduleId, galleryId);
    }
    return new Promise(resolve => resolve());
  }

  isLoaded(index) {
    const { items } = this.props;
    return index < items.size;
  }

  setColumnListRef(ref, columnNumber, callback) {
    this.columnRefs[columnNumber] = ref;
    if (callback) {
      callback(ref);
    }
  }

  onResize() {
    this.width = (window && window.innerWidth) || 0;
    this.columnHeight = (window && window.innerHeight) || 0;
    this.columnRefs.forEach(ref => ref.recomputeRowHeights());
  }

  getRowHeight({ index, columnNumber }) {
    const { columnCount } = this.state;
    const originalIndex = index * columnCount + columnNumber;
    if (!this.isLoaded(originalIndex)) {
      return 0;
    }

    const { items } = this.props;
    const { fitToWindow } = this.state;
    const item = items.get(originalIndex);
    const calculatedWidth = Math.min(item.get('width'), this.columnWidth);
    const calculatedHeight = Math.floor((item.get('height') / item.get('width')) * calculatedWidth);
    if (fitToWindow && window && window.innerHeight) {
      return Math.min(calculatedHeight, window.innerHeight);
    }

    return calculatedHeight;
  }

  renderRow({ index, key, style, columnNumber }) {
    const { columnCount } = this.state;
    const { classes } = this.props;
    const originalIndex = index * columnCount + columnNumber;

    if (!this.isLoaded(originalIndex)) {
      return <div className={classes.masonryItemContainer} key={key} style={{ ...style }} />;
    }

    const { items, moduleId, onItemClick } = this.props;
    const item = items.get(originalIndex);

    return (
      <div className={classes.masonryItemContainer} key={key} style={{ ...style }}>
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
      </div>
    );
  }

  renderColumn({ width, isScrolling, scrollTop, height, columnNumber, registerChild, onRowsRendered }) {
    const { items } = this.props;
    const { gutterSize, columnCount, mainColumnIndex } = this.state;

    this.columnWidth = Math.floor(width / columnCount - gutterSize);
    const columnItems = items.filter((_, index) => index % columnCount === columnNumber);

    return (
      <List
        autoHeight
        ref={ref =>
          this.setColumnListRef(ref, columnNumber, columnNumber === mainColumnIndex ? registerChild : () => {})
        }
        onRowsRendered={onRowsRendered}
        overscanRowCount={1}
        isScrolling={isScrolling}
        scrollTop={scrollTop}
        height={height}
        width={this.columnWidth}
        rowCount={columnItems.size}
        rowHeight={props => this.getRowHeight({ ...props, columnNumber })}
        rowRenderer={props => this.renderRow({ ...props, columnNumber })}
      />
    );
  }

  render() {
    const { items, loading, classes } = this.props;
    const { columnCount, gutterSize } = this.state;

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
      <InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.loadMoreRows} rowCount={1000} threshold={20}>
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop, width }) => (
              <div className={classes.container} style={{ width: `${width - 2 * gutterSize - 1}px` }}>
                {[...Array(columnCount).keys()].map(columnNumber => (
                  <div key={columnNumber} className={classes.column}>
                    {this.renderColumn({
                      width,
                      isScrolling,
                      scrollTop,
                      height,
                      columnNumber,
                      onRowsRendered,
                      registerChild,
                    })}
                  </div>
                ))}
              </div>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  }
}

ListView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  items: PropTypes.instanceOf(Immutable.List).isRequired,
  loading: PropTypes.bool.isRequired,
  moduleId: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ListView);
