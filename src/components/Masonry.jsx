import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import ErrorToast from './ErrorToast';
import LoadingIndicator from './LoadingIndicator';
import MasonryItem from './MasonryItem';
import NoResults from './NoResults';
import VirtualizedMasonry from './VirtualizedMasonry';

const styles = (theme) => ({
  container: {
    alignItems: 'stretch',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-evenly',
    padding: theme.spacing(1),
  },
  masonryItemContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'center',
  },
});

class Masonry extends Component {
  constructor() {
    super();

    this.state = {
      message: null,
      open: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // TODO: Find a way to update based on multiple errors
    if (props.error && !state.message) {
      return {
        message: `Error communicating with server`,
        open: true,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  loadMore = () => {
    const { galleryId, loading, loadMore, moduleId } = this.props;
    if (!loading) {
      loadMore(moduleId, galleryId);
    }
  };

  isLoaded = (index) => {
    const { items } = this.props;
    return index < items.length;
  };

  getItemWidth = (index) => {
    const { getItemWidth, items } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return getItemWidth(items[index]);
  };

  getItemHeight = (index) => {
    const { getItemHeight, items } = this.props;
    if (!this.isLoaded(index)) {
      return 0;
    }

    return getItemHeight(items[index]);
  };

  renderItem = (index) => {
    const { classes, galleryId, gutter, items, moduleId, onItemClick } = this.props;

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
    const { columnCount, gutter, items, loading, moduleId, galleryId } = this.props;
    const { message, open } = this.state;

    if (items.length === 0 && loading) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <ErrorToast message={message} onClose={this.handleClose} open={open} />
        {items.length === 0 ? (
          <NoResults />
        ) : (
          <VirtualizedMasonry
            columnCount={columnCount}
            getHeightForItem={this.getItemHeight}
            getWidthForItem={this.getItemWidth}
            gutter={gutter}
            isLoading={loading}
            length={items.length}
            loadMore={this.loadMore}
            loadMoreThreshold={5000}
            overscan={500}
            renderItem={this.renderItem}
            pathKey={`${moduleId}/${galleryId}`}
          />
        )}
      </>
    );
  }
}

Masonry.defaultProps = {
  columnCount: 3,
  gutter: 8,
};

Masonry.propTypes = {
  // required
  error: PropTypes.bool.isRequired,
  galleryId: PropTypes.string.isRequired,
  getItemHeight: PropTypes.func.isRequired,
  getItemWidth: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,

  // optional
  columnCount: PropTypes.number,
  gutter: PropTypes.number,

  // withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Masonry);
