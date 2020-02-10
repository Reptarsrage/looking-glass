import React, { Component } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';

import * as naviagationActions from '../actions/navigationActions';
import { isAuthenticatedSelector, requiresAuthSelector, authUrlSelector } from '../selectors/authSelectors';
import { galleryByIdSelector, itemsInGallerySelector } from '../selectors/gallerySelectors';
import { itemWidthSelector, itemHeightSelector } from '../selectors/itemSelectors';
import * as moduleActions from '../actions/moduleActions';
import Breadcrumbs from '../components/Breadcrumbs';
import SortMenu from '../components/SortMenu';
import Masonry from '../components/Masonry';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ModalItem from '../components/ModalItem';
import ImageFullscreenTransition from '../components/ImageFullscreenTransition';
import globalStyles from '../index.scss';

const styles = () => ({
  floatedBottomRight: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 3,
  },
  pointer: {
    cursor: 'pointer',
  },
  animationElement: {
    position: 'fixed',
    zIndex: 5,
    display: 'flex',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 4,
    background: 'rgba(0,0,0,1)',
  },
  button: {
    top: '50%',
    position: 'fixed',
    transform: 'translate(0, -50%)',
    zIndex: 6,
  },
  prev: {
    left: '0.5rem',
  },
  next: {
    right: '0.5rem',
  },
  grow: {
    flexGrow: 1,
  },
});

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mountModal: false,
      modalIn: true,
      modalItemId: null,
      modalInitialBounds: null,
      showOverlayButtons: false,
    };
  }

  componentDidMount() {
    // set event listeners
    window.addEventListener('continerScroll', this.handleScroll);
    document.addEventListener('keydown', this.handleKeyPress, false);

    // fetch images
    this.fetchInitialItems();
  }

  componentDidUpdate(prevProps) {
    const { moduleId, galleryId } = this.props;
    const { moduleId: prevModuleId, galleryId: prevGalleryId } = prevProps;

    if (moduleId !== prevModuleId || galleryId !== prevGalleryId) {
      // clear modal
      this.handleModalClose();

      // fetch images
      this.fetchInitialItems();
    }
  }

  componentWillUnmount() {
    // remove event listeners from componentDidMount
    window.removeEventListener('continerScroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = event => {
    // TODO: Handle arrow key presses
    if (event.key === 'Escape') {
      this.handleModalClose();
    }
  };

  handleScroll = event => {
    const { overlayButtonThreshold } = this.props;
    const { showOverlayButtons } = this.state;
    const scrollY = event.detail;
    if (scrollY >= overlayButtonThreshold && !showOverlayButtons) {
      this.setState({ showOverlayButtons: true });
    } else if (scrollY < overlayButtonThreshold && showOverlayButtons) {
      this.setState({ showOverlayButtons: false });
    }
  };

  fetchInitialItems = () => {
    const { fetchGallery, moduleId, galleryId, gallery, isAuthenticated, requiresAuth } = this.props;
    const { hasNext, fetching, success } = gallery;

    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return;
    }

    // Check if first page is available and not already fetched, and fetch it
    if (hasNext && !fetching && !success) {
      fetchGallery(moduleId, galleryId);
    }
  };

  loadMoreItems = () => {
    const { fetchGallery, moduleId, galleryId, gallery, isAuthenticated, requiresAuth } = this.props;
    const { hasNext, fetching } = gallery;

    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return;
    }

    // Check if next page is available, and fetch it
    if (hasNext && !fetching) {
      fetchGallery(moduleId, galleryId);
    }
  };

  modalHasNext = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    return items.length > 0 && items[items.length - 1] !== modalItemId; // not last item
  };

  modalHasPrev = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    return items.length > 0 && items[0] !== modalItemId; // not first item
  };

  getInitialBoundsForTarget = ({ target }) => target && target.getBoundingClientRect();

  handleModalNextImage = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;

    if (this.modalHasNext()) {
      // TODO: Update modalInitialBounds
      const idx = items.findIndex(id => id === modalItemId);
      const newModalItemId = items[idx + 1];
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalPrevImage = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;

    if (this.modalHasPrev()) {
      // TODO: Update modalInitialBounds
      const idx = items.findIndex(id => id === modalItemId);
      const newModalItemId = items[idx - 1];
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalClose = () => this.setState({ modalIn: false });

  handleItemClick = (event, item) => {
    const { navigateToGallery, moduleId } = this.props;
    const { isGallery, id, title } = item;

    if (isGallery) {
      navigateToGallery(moduleId, id, title);
    } else {
      document.body.classList.add(globalStyles.stopScroll);
      const modalInitialBounds = this.getInitialBoundsForTarget(event);
      this.setState({ mountModal: true, modalIn: true, modalItemId: id, modalInitialBounds });
    }
  };

  handleModalExited = () => {
    document.body.classList.remove(globalStyles.stopScroll);
    this.setState({ mountModal: false, modalItemId: null });
  };

  renderModal = () => {
    const { classes } = this.props;
    const { mountModal, modalIn, modalItemId, modalInitialBounds } = this.state;
    const hasPrev = this.modalHasPrev();
    const hasNext = this.modalHasNext();

    if (!mountModal) {
      return null;
    }

    return (
      <>
        <Fade in={modalIn}>
          <div className={classes.backdrop} />
        </Fade>
        <Zoom in={modalIn}>
          <Fab
            color="default"
            aria-label="Previous"
            className={clsx(classes.prev, classes.button)}
            onClick={this.handleModalPrevImage}
            style={{ display: hasPrev ? 'inline-flex' : 'none' }}
          >
            <ChevronLeftIcon />
          </Fab>
        </Zoom>
        <Zoom in={modalIn}>
          <Fab
            color="default"
            aria-label="Next"
            className={clsx(classes.next, classes.button)}
            onClick={this.handleModalNextImage}
            style={{ display: hasNext ? 'inline-flex' : 'none' }}
          >
            <ChevronRightIcon />
          </Fab>
        </Zoom>
        <ImageFullscreenTransition in={modalIn} initialBounds={modalInitialBounds} onExited={this.handleModalExited}>
          <div
            className={classes.animationElement}
            onClick={this.handleModalClose}
            tabIndex="0"
            role="button"
            aria-pressed="false"
            onKeyDown={this.handleKeyPress}
          >
            <ModalItem itemId={modalItemId} onClick={this.handleModalClose} open={modalIn} />
          </div>
        </ImageFullscreenTransition>
      </>
    );
  };

  getItemHeight = itemId => {
    const { itemHeightSelectorFunc } = this.props;
    return itemHeightSelectorFunc(itemId);
  };

  getItemWidth = itemId => {
    const { itemWidthSelectorFunc } = this.props;
    return itemWidthSelectorFunc(itemId);
  };

  render() {
    const { items, classes, moduleId, galleryId, gallery, isAuthenticated, requiresAuth, authUrl } = this.props;
    const { fetching, error } = gallery;
    const { showOverlayButtons } = this.state;

    // Sometimes react router renders things that aren't supposed to be
    if (!moduleId || !galleryId) {
      return null;
    }

    // Redirect to authenticate
    if (requiresAuth && !isAuthenticated) {
      return <Redirect to={authUrl} />;
    }

    // TODO: Implement Desktop/mobile menus as per the demo here https://material-ui.com/components/app-bar/
    return (
      <>
        {this.renderModal()}

        <Toolbar variant="dense">
          <Breadcrumbs />
          <div className={classes.grow} />
          <SortMenu moduleId={moduleId} galleryId={galleryId} />
        </Toolbar>

        <div className={classes.floatedBottomRight}>{showOverlayButtons ? <ScrollToTopButton /> : null}</div>

        <Masonry
          key={`${moduleId}/${galleryId}`}
          moduleId={moduleId}
          galleryId={galleryId}
          items={items}
          getItemHeight={this.getItemHeight}
          getItemWidth={this.getItemWidth}
          loading={fetching}
          error={error !== null}
          loadMore={this.loadMoreItems}
          onItemClick={this.handleItemClick}
        />
      </>
    );
  }
}

Gallery.defaultProps = {
  authUrl: null,
  overlayButtonThreshold: 25,
};

Gallery.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // optional
  overlayButtonThreshold: PropTypes.number,

  // selectors
  gallery: PropTypes.shape({
    hasNext: PropTypes.bool,
    fetching: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemHeightSelectorFunc: PropTypes.func.isRequired,
  itemWidthSelectorFunc: PropTypes.func.isRequired,
  requiresAuth: PropTypes.bool.isRequired,
  authUrl: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // actions
  fetchGallery: PropTypes.func.isRequired,
  navigateToGallery: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  gallery: galleryByIdSelector,
  items: itemsInGallerySelector,
  requiresAuth: requiresAuthSelector,
  authUrl: authUrlSelector,
  isAuthenticated: isAuthenticatedSelector,
  itemHeightSelectorFunc: state => itemId => itemHeightSelector(state, { itemId }),
  itemWidthSelectorFunc: state => itemId => itemWidthSelector(state, { itemId }),
});

const mapDispatchToProps = {
  fetchGallery: moduleActions.fetchGallery,
  navigateToGallery: naviagationActions.navigateToGallery,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Gallery);
