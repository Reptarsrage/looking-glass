import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

import ErrorToast from './ErrorToast';
import LoadingIndicator from './LoadingIndicator';
import NoResults from './NoResults';
import VirtualizedMasonry from './VirtualizedMasonry';

const Masonry = ({ error, columnCount, items, loading, gutter, getItemHeight, getItemWidth, loadMore }) => {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error && !message) {
      setMessage('Error communicating with server');
      setOpen(true);
    }
  });

  const handleToastClosed = () => {
    setOpen(false);
  };

  if (items.length === 0 && loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <ErrorToast message={message} onClose={handleToastClosed} open={open} />
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
};

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
