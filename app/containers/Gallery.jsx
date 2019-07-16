import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ReactRouterPropTypes from 'react-router-prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/fab';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

import {
  imagesSelector,
  fetchingSelector,
  errorSelector,
  hasNextSelector,
  searchQuerySelector,
} from '../selectors/gallerySelectors';
import { moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';
import { moduleSelector } from '../selectors/moduleSelectors';
import * as galleryActions from '../actions/galleryActions';
import * as appActions from '../actions/appActions';
import Masonry from '../components/Masonry';
import BackButton from '../components/BackButton';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ModalItem from '../components/ModalItem';
import ImageFullscreenTransition from '../components/ImageFullscreenTransition';
import globalStyles from '../index.css';

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
    this.fetchInitialImages();
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    if (location.pathname !== prevLocation.pathname) {
      this.setState({ modalIn: false, modalItemId: null });
      this.fetchInitialImages();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = event => {
    if (event.key === 'Escape') {
      this.handleModalClose();
    }
  };

  clearSearch = () => {
    const { clearSearch, moduleId, galleryId, searchQuery, fetchImages } = this.props;
    if (searchQuery !== null && searchQuery.length > 0) {
      clearSearch(moduleId, galleryId);
      fetchImages(moduleId, galleryId);
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

  fetchInitialImages = () => {
    const { fetchImages, images, fetching, moduleId, galleryId, hasNext } = this.props;
    if (hasNext && images.length === 0 && !fetching) {
      fetchImages(moduleId, galleryId);
    }
  };

  loadMoreImages = () => {
    const { fetchImages, fetching, moduleId, galleryId, hasNext } = this.props;
    if (hasNext && !fetching) {
      fetchImages(moduleId, galleryId);
    }
  };

  modalHasNext = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.id === modalItemId);
    return idx < images.length - 1;
  };

  modalHasPrev = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.id === modalItemId);
    return idx > 0;
  };

  getlInitialBoundsForTarget = ({ target }) => target && target.getBoundingClientRect();

  handleModalNextImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.id === modalItemId);

    if (idx < images.length - 1) {
      const newModalItemId = images[idx + 1].id;

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalPrevImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.id === modalItemId);

    if (idx > 0) {
      const newModalItemId = images[idx - 1].id;

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId: newModalItemId });
    }
  };

  handleModalClose = () => {
    this.setState({ modalIn: false });
  };

  handleItemClick = (event, modalItemId) => {
    const modalInitialBounds = this.getlInitialBoundsForTarget(event);
    document.body.classList.add(globalStyles.stopScroll);
    this.setState({ mountModal: true, modalIn: true, modalItemId, modalInitialBounds });
  };

  handleModalExited = () => {
    document.body.classList.remove(globalStyles.stopScroll);
    this.setState({ mountModal: false, modalItemId: null });
  };

  renderModal = () => {
    const { classes, images } = this.props;
    const { mountModal, modalIn, modalItemId, modalInitialBounds } = this.state;
    const modalItem = modalItemId && images.find(i => i.id === modalItemId);
    const hasPrev = this.modalHasPrev();
    const hasNext = this.modalHasNext();

    if (!mountModal) {
      return null;
    }

    const modalContent = modalItem && (
      <ModalItem
        videoURL={modalItem.videoURL}
        imageURL={modalItem.imageURL}
        isVideo={modalItem.isVideo}
        title={modalItem.title}
        width={modalItem.width}
        height={modalItem.height}
        onClick={this.handleModalClose}
      />
    );

    return (
      <Fragment>
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
            {modalContent}
          </div>
        </ImageFullscreenTransition>
      </Fragment>
    );
  };

  render() {
    const { images, fetching, error, classes, moduleId, galleryId, location, module, searchQuery } = this.props;
    const { showOverlayButtons } = this.state;

    // Sometimes react router renders things that aren't supposed to be
    if (!moduleId || !galleryId) {
      return null;
    }

    return (
      <Fragment>
        {this.renderModal()}
        <Paper elevation={0} className={classes.paper}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link className={classes.pointer} component={RouterLink} color="inherit" to="/">
              Home
            </Link>
            <Link
              className={classes.pointer}
              component={RouterLink}
              color="inherit"
              to={`/gallery/${moduleId}/default`}
              onClick={this.clearSearch}
            >
              {module.title}
            </Link>
            {galleryId !== 'default' ? (
              <Link
                className={classes.pointer}
                component={RouterLink}
                color="inherit"
                to={`/gallery/${moduleId}/${galleryId}`}
                onClick={this.clearSearch}
              >
                {galleryId}
              </Link>
            ) : null}
            {searchQuery !== null && searchQuery.length > 0 ? (
              <Typography color="textPrimary">&quot;{searchQuery}&quot;</Typography>
            ) : null}
          </Breadcrumbs>
        </Paper>

        <br />

        <div className={classes.floatedTopLeft}>{showOverlayButtons ? <BackButton /> : null}</div>
        <div className={classes.floatedBottomRight}>{showOverlayButtons ? <ScrollToTopButton /> : null}</div>

        <Masonry
          key={`${moduleId}_${galleryId}`}
          location={location}
          moduleId={moduleId}
          galleryId={galleryId}
          items={images}
          loading={fetching}
          error={error !== null}
          loadMore={this.loadMoreImages}
          onItemClick={this.handleItemClick}
        />
      </Fragment>
    );
  }
}

Gallery.defaultProps = {
  error: null,
  searchQuery: null,
  moduleId: null,
  galleryId: null,
};

Gallery.propTypes = {
  classes: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  moduleId: PropTypes.string,
  galleryId: PropTypes.string,
  error: PropTypes.object,
  searchQuery: PropTypes.string,
  module: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchImages: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  images: imagesSelector,
  hasNext: hasNextSelector,
  fetching: fetchingSelector,
  error: errorSelector,
  moduleId: moduleIdSelector,
  galleryId: galleryIdSelector,
  module: moduleSelector,
  searchQuery: searchQuerySelector,
});

const mapDispatchToProps = {
  fetchImages: galleryActions.fetchImages,
  clearSearch: appActions.clearSearch,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Gallery);
