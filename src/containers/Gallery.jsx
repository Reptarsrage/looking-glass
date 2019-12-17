import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { isAuthenticatedSelector, requiresAuthSelector, authUrlSelector } from '../selectors/authSelectors';
import { galleryByIdSelector, itemsInGallerySelector } from '../selectors/gallerySelectors';
import { itemWidthSelector, itemHeightSelector } from '../selectors/itemSelectors';
import * as moduleActions from '../actions/moduleActions';
import * as appActions from '../actions/appActions';
import Masonry from '../components/Masonry';
import BackButton from '../components/BackButton';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ModalItem from '../components/ModalItem';
import ImageFullscreenTransition from '../components/ImageFullscreenTransition';
import globalStyles from '../index.scss';
import {
  searchQuerySelector,
  searchGalleryIdSelector,
  searchGalleryUrlSelector,
  defaultGalleryUrlSelector,
} from '../selectors/moduleSelectors';

const styles = () => ({
  floatedBottomRight: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 3,
  },
  floatedTopLeft: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 3,
  },
  pointer: {
    cursor: 'pointer',
  },
  animationElement: {
    position: 'fixed',
    zIndex: 5,
  },
  full: {
    width: '100%',
    margin: 0,
    padding: 0,
    height: '100%',
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
    const { setCurrentGallery, moduleId, galleryId } = this.props;

    // set event listeners
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('keydown', this.handleKeyPress, false);

    // set current gallery and module
    setCurrentGallery(moduleId, galleryId);

    // fetch images
    this.fetchInitialItems();
  }

  componentDidUpdate(prevProps) {
    const { moduleId, galleryId, setCurrentGallery } = this.props;
    const { moduleId: prevModuleId, galleryId: prevGalleryId } = prevProps;

    if (moduleId !== prevModuleId || galleryId !== prevGalleryId) {
      // clear modal
      this.handleModalClose();

      // set current gallery and module
      setCurrentGallery(moduleId, galleryId);

      // fetch images
      this.fetchInitialItems();
    }
  }

  componentWillUnmount() {
    // remove event listeners from componentDidMount
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = event => {
    if (event.key === 'Escape') {
      this.handleModalClose();
    }
  };

  handleScroll = () => {
    const { showOverlayButtons } = this.state;

    if (window.scrollY > 25 && !showOverlayButtons) {
      this.setState({ showOverlayButtons: true });
    } else if (window.scrollY <= 25 && showOverlayButtons) {
      this.setState({ showOverlayButtons: false });
    }
  };

  fetchInitialItems = () => {
    const { fetchGallery, moduleId, galleryId, gallery, isAuthenticated, requiresAuth } = this.props;
    const { hasNext, fetching, success } = gallery;

    if (requiresAuth && !isAuthenticated) {
      return;
    }

    if (hasNext && !fetching && !success) {
      fetchGallery(moduleId, galleryId);
    }
  };

  loadMoreItems = () => {
    const { fetchGallery, moduleId, galleryId, gallery, isAuthenticated, requiresAuth } = this.props;
    const { hasNext, fetching } = gallery;

    if (requiresAuth && !isAuthenticated) {
      return;
    }

    if (hasNext && !fetching) {
      fetchGallery(moduleId, galleryId);
    }
  };

  modalHasNext = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    const idx = items.findIndex(id => id === modalItemId);
    return idx < items.length - 1;
  };

  modalHasPrev = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    return items.length > 0 && items[0] !== modalItemId; // not first item
  };

  getlInitialBoundsForTarget = ({ target }) => target && target.getBoundingClientRect();

  handleModalNextImage = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    const idx = items.findIndex(id => id === modalItemId);

    if (idx < items.length - 1) {
      const newModalItemId = items[idx + 1];

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalPrevImage = () => {
    const { items } = this.props;
    const { modalItemId } = this.state;
    const idx = items.findIndex(id => id === modalItemId);

    if (idx > 0) {
      const newModalItemId = items[idx - 1];

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalClose = () => {
    this.setState({ modalIn: false });
  };

  handleItemClick = (event, item) => {
    const { addGallery, moduleId } = this.props;
    const { isGallery, id, siteId } = item;

    if (isGallery) {
      addGallery(moduleId, id, siteId);
    } else {
      const modalInitialBounds = this.getlInitialBoundsForTarget(event);
      document.body.classList.add(globalStyles.stopScroll);
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
            <ModalItem itemId={modalItemId} onClick={this.handleModalClose} />
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
    const {
      items,
      classes,
      moduleId,
      galleryId,
      gallery,
      location,
      isAuthenticated,
      requiresAuth,
      authUrl,
      searchQuery,
      searchGalleryId,
      searchGalleryUrl,
      defaultGalleryUrl,
    } = this.props;
    const { fetching, error } = gallery;
    const { showOverlayButtons } = this.state;

    // redirect to authenticate
    if (requiresAuth && !isAuthenticated) {
      return <Redirect to={authUrl} />;
    }

    // redirect to search gallery
    if (searchQuery && galleryId !== searchGalleryId) {
      return <Redirect to={searchGalleryUrl} />;
    }

    // redirect from search to default gallery
    if (!searchQuery && galleryId === searchGalleryId) {
      return <Redirect to={defaultGalleryUrl} />;
    }

    // Sometimes react router renders things that aren't supposed to be
    if (!moduleId || !galleryId) {
      return null;
    }

    // TODO: Refactor Breadcrumbs
    return (
      <>
        {this.renderModal()}
        <Paper elevation={0} className={classes.paper}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link className={classes.pointer} component={RouterLink} color="inherit" to="/">
              Home
            </Link>
          </Breadcrumbs>
        </Paper>

        <br />

        <div className={classes.floatedTopLeft}>{showOverlayButtons ? <BackButton /> : null}</div>
        <div className={classes.floatedBottomRight}>{showOverlayButtons ? <ScrollToTopButton /> : null}</div>

        <Masonry
          key={`${moduleId}/${galleryId}`}
          location={location}
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
  searchQuery: null,
};

Gallery.propTypes = {
  classes: PropTypes.object.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  gallery: PropTypes.shape({
    hasNext: PropTypes.bool,
    fetching: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  fetchGallery: PropTypes.func.isRequired,
  itemHeightSelectorFunc: PropTypes.func.isRequired,
  itemWidthSelectorFunc: PropTypes.func.isRequired,
  addGallery: PropTypes.func.isRequired,
  setCurrentGallery: PropTypes.func.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  requiresAuth: PropTypes.bool.isRequired,
  authUrl: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  searchGalleryId: PropTypes.string.isRequired,
  searchGalleryUrl: PropTypes.string.isRequired,
  defaultGalleryUrl: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  gallery: galleryByIdSelector,
  items: itemsInGallerySelector,
  requiresAuth: requiresAuthSelector,
  authUrl: authUrlSelector,
  isAuthenticated: isAuthenticatedSelector,
  searchQuery: searchQuerySelector,
  searchGalleryId: searchGalleryIdSelector,
  searchGalleryUrl: searchGalleryUrlSelector,
  defaultGalleryUrl: defaultGalleryUrlSelector,
  itemHeightSelectorFunc: state => itemId => itemHeightSelector(state, { itemId }),
  itemWidthSelectorFunc: state => itemId => itemWidthSelector(state, { itemId }),
});

const mapDispatchToProps = {
  fetchGallery: moduleActions.fetchGallery,
  addGallery: moduleActions.addGallery,
  setCurrentGallery: appActions.setCurrentGallery,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Gallery);
