import React, { Component } from 'react';
import Immutable from 'immutable';
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
import { Fab } from '@material-ui/core';
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
import rootStyles from '../index.css';

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
  static propTypes = {
    images: PropTypes.instanceOf(Immutable.List).isRequired,
    fetching: PropTypes.bool,
    fetchImages: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fetching: false,
  };

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
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ modalOpen: false, modalItemId: null });
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

    if (window.scrollY > 100 && !showOverlayButtons) {
      this.setState({ showOverlayButtons: true });
    } else if (window.scrollY <= 100 && showOverlayButtons) {
      this.setState({ showOverlayButtons: false });
    }
  };

  fetchInitialImages = () => {
    const { fetchImages, images, fetching, moduleId, galleryId, hasNext } = this.props;
    if (hasNext && images.size === 0 && !fetching) {
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
    const idx = images.findIndex(i => i.get('id') === modalItemId);
    return idx < images.size - 1;
  };

  modalHasPrev = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.get('id') === modalItemId);
    return idx > 0;
  };

  getlInitialBoundsForTarget = ({ target }) => target && target.getBoundingClientRect();

  handleModalNextImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.get('id') === modalItemId);

    if (idx < images.size - 1) {
      const modalItemId = images.get(idx + 1).get('id');

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId });
    }
  };

  handleModalPrevImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.get('id') === modalItemId);

    if (idx > 0) {
      const modalItemId = images.get(idx - 1).get('id');

      // TODO: Update modalInitialBounds
      this.setState({ modalItemId });
    }
  };

  handleModalClose = () => {
    this.setState({ modalIn: false });
  };

  handleItemClick = (event, modalItemId) => {
    const modalInitialBounds = this.getlInitialBoundsForTarget(event);
    document.body.classList.add(rootStyles.stopScroll);
    this.setState({ mountModal: true, modalIn: true, modalItemId, modalInitialBounds });
  };

  handleModalExited = () => {
    document.body.classList.remove(rootStyles.stopScroll);
    this.setState({ mountModal: false, modalItemId: null });
  };

  renderModal = () => {
    const { classes, images } = this.props;
    const { mountModal, modalIn, modalItemId, modalInitialBounds } = this.state;
    const modalItem = modalItemId && images.find(i => i.get('id') === modalItemId);

    if (!mountModal) {
      return null;
    }

    const modalContent = modalItem && (
      <ModalItem
        videoURL={modalItem.get('videoURL')}
        imageURL={modalItem.get('imageURL')}
        isVideo={modalItem.get('isVideo')}
        title={modalItem.get('title')}
        width={modalItem.get('width')}
        height={modalItem.get('height')}
        onClick={this.handleModalClose}
      />
    );

    return (
      <React.Fragment>
        <Fade in={modalIn}>
          <div className={classes.backdrop}></div>
        </Fade>
        <Zoom in={modalIn}>
          <Fab
            color="default"
            aria-label="Previous"
            className={clsx(classes.prev, classes.button)}
            onClick={this.handleModalPrevImage}
            style={{ display: this.modalHasPrev() ? 'inline-flex' : 'none' }}
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
            style={{ display: this.modalHasNext() ? 'inline-flex' : 'none' }}
          >
            <ChevronRightIcon />
          </Fab>
        </Zoom>
        <ImageFullscreenTransition in={modalIn} initialBounds={modalInitialBounds} onExited={this.handleModalExited}>
          <div className={classes.animationElement} onClick={this.handleModalClose}>
            {modalContent}
          </div>
        </ImageFullscreenTransition>
      </React.Fragment>
    );
  };

  render() {
    const { images, fetching, error, classes, moduleId, galleryId, location, module, searchQuery } = this.props;
    const { showOverlayButtons } = this.state;

    return (
      <React.Fragment>
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
              {module.get('title')}
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
              <Typography color="textPrimary">"{searchQuery}"</Typography>
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
      </React.Fragment>
    );
  }
}

Gallery.defaultProps = {
  error: null,
  searchQuery: null,
};

Gallery.propTypes = {
  classes: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  error: PropTypes.object,
  searchQuery: PropTypes.string,
  module: PropTypes.instanceOf(Immutable.Map).isRequired,
  images: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  images: imagesSelector(),
  hasNext: hasNextSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  moduleId: moduleIdSelector(),
  galleryId: galleryIdSelector(),
  module: moduleSelector(),
  searchQuery: searchQuerySelector(),
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
