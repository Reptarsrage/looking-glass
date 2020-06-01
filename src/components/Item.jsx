import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { modalItemIdSelector } from '../selectors/modalSelectors';
import { itemByIdSelector } from '../selectors/itemSelectors';
import * as modalActions from '../actions/modalActions';
import Image from './Image';
import Video from './Video';

const styles = () => ({
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Item = ({ classes, itemId, style, item, modalOpen, modalBoundsUpdate, modalItemId, modalSetItem }) => {
  const itemRef = useRef(null);
  const [ignoreEffect, setIgnoreEffect] = useState(false);

  useEffect(() => {
    if (ignoreEffect) {
      setIgnoreEffect(false);
      return;
    }

    if (modalItemId === itemId) {
      itemRef.current.scrollIntoView();
      const bounds = itemRef.current.getBoundingClientRect();
      const initialBounds = {
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      };

      modalBoundsUpdate(initialBounds);
    }
  }, [modalItemId]);

  const handleClick = (event) => {
    event.preventDefault();

    const { currentTarget } = event;
    const bounds = currentTarget.getBoundingClientRect();
    const initialBounds = {
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    };

    setIgnoreEffect(true);
    modalBoundsUpdate(initialBounds);
    modalSetItem(itemId);
    modalOpen();
  };

  const renderImage = () => <Image src={item.url} title={item.title} width={item.width} height={item.height} />;

  const renderVideo = () => (
    <Video
      src={item.url}
      thumb={item.thumb}
      title={item.title}
      width={item.width}
      height={item.height}
      muted
      controls
      autoPlay
      loop
    />
  );

  return (
    <div
      ref={itemRef}
      className={classes.item}
      style={{ ...style, visibility: modalItemId === itemId ? 'hidden' : 'visible' }}
      role="button"
      onClick={handleClick}
      onKeyPress={() => {}}
      tabIndex="0"
    >
      {item.isVideo ? renderVideo() : renderImage()}
    </div>
  );
};

Item.defaultProps = {
  modalItemId: null,
  style: {},
};

Item.propTypes = {
  modalItemId: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    url: PropTypes.string,
    thumb: PropTypes.string,
  }).isRequired,
  style: PropTypes.object,
  modalOpen: PropTypes.func.isRequired,
  modalBoundsUpdate: PropTypes.func.isRequired,
  modalSetItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
  modalItemId: modalItemIdSelector,
});

const mapDispatchToProps = {
  modalOpen: modalActions.modalOpen,
  modalBoundsUpdate: modalActions.modalBoundsUpdate,
  modalSetItem: modalActions.modalSetItem,
};

function areEqual(nextProps, prevProps) {
  return (
    nextProps.style.width === prevProps.style.width &&
    nextProps.style.height === prevProps.style.height &&
    nextProps.style.top === prevProps.style.top &&
    nextProps.style.left === prevProps.style.left &&
    nextProps.itemId === prevProps.itemId &&
    nextProps.isModal === prevProps.isModal
  );
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(memo(Item, areEqual));
