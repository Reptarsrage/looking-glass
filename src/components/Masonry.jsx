import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

import ErrorToast from './ErrorToast';
import LoadingIndicator from './LoadingIndicator';
import NoResults from './NoResults';
import VirtualizedMasonry from './VirtualizedMasonry';

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
    // maybe notistack
    if (props.error && !state.message) {
      return {
        message: `Error communicating with server`,
        open: true,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  handleToastClosed = () => {
    this.setState({ open: false });
  };

  render() {
    const { columnCount, items, loading, gutter, getItemHeight, getItemWidth, loadMore } = this.props;
    const { message, open } = this.state;

    if (items.length === 0 && loading) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <ErrorToast message={message} onClose={this.handleToastClosed} open={open} />
        {items.length === 0 ? (
          <NoResults />
        ) : (
          <ReactResizeDetector handleWidth refreshMode="debounce" refreshRate={200}>
            {({ width }) => (
              <VirtualizedMasonry
                items={items}
                getHeightForItem={getItemHeight}
                getWidthForItem={getItemWidth}
                loadMore={loadMore}
                columnCount={columnCount}
                loadMoreThreshold={5000}
                overscan={500}
                gutter={gutter}
                width={width}
              />
            )}
          </ReactResizeDetector>
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
  getItemHeight: PropTypes.func.isRequired,
  getItemWidth: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,

  // optional
  columnCount: PropTypes.number,
  gutter: PropTypes.number,
};

export default Masonry;
