import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ReactRouterPropTypes from 'react-router-prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
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
  dialog: {
    maxHeight: '100vh',
    overflow: 'auto',
  },
  pointer: {
    cursor: 'pointer',
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
      modalOpen: false,
      modalItemId: null,
      showOverlayButtons: false,
    };

    this.fetchInitialImages = this.fetchInitialImages.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.loadMoreImages = this.loadMoreImages.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    this.fetchInitialImages();
    window.addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ modalOpen: false, modalItemId: null });
      this.fetchInitialImages();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  clearSearch() {
    const { clearSearch, moduleId, galleryId, searchQuery, fetchImages } = this.props;
    if (searchQuery !== null && searchQuery.length > 0) {
      clearSearch(moduleId, galleryId);
      fetchImages(moduleId, galleryId);
    }
  }

  onScroll() {
    const { showOverlayButtons } = this.state;

    if (window.scrollY > 100 && !showOverlayButtons) {
      this.setState({ showOverlayButtons: true });
    } else if (window.scrollY <= 100 && showOverlayButtons) {
      this.setState({ showOverlayButtons: false });
    }
  }

  fetchInitialImages() {
    const { fetchImages, images, fetching, moduleId, galleryId, hasNext } = this.props;
    if (hasNext && images.size === 0 && !fetching) {
      fetchImages(moduleId, galleryId);
    }
  }

  loadMoreImages() {
    const { fetchImages, fetching, moduleId, galleryId, hasNext } = this.props;
    if (hasNext && !fetching) {
      fetchImages(moduleId, galleryId);
    }
  }

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

  handleModalNextImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.get('id') === modalItemId);

    if (idx < images.size - 1) {
      const modalItemId = images.get(idx + 1).get('id');
      this.setState({ modalItemId });
    }
  };

  handleModalPrevImage = () => {
    const { images } = this.props;
    const { modalItemId } = this.state;
    const idx = images.findIndex(i => i.get('id') === modalItemId);

    if (idx > 0) {
      const modalItemId = images.get(idx - 1).get('id');
      this.setState({ modalItemId });
    }
  };

  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  handleItemClick(id) {
    this.setState({ modalOpen: true, modalItemId: id });
  }

  render() {
    const { images, fetching, error, classes, moduleId, galleryId, location, module, searchQuery } = this.props;
    const { modalOpen, modalItemId, showOverlayButtons } = this.state;

    const modalItem = modalItemId && images.find(i => i.get('id') === modalItemId);
    const modalContent = modalItem && (
      <ModalItem
        videoURL={modalItem.get('videoURL')}
        imageURL={modalItem.get('imageURL')}
        isVideo={modalItem.get('isVideo')}
        title={modalItem.get('title')}
        width={modalItem.get('width')}
        height={modalItem.get('height')}
        onClick={this.handleModalClose}
        nextImage={this.handleModalNextImage}
        prevImage={this.handleModalPrevImage}
        hasPrev={this.modalHasPrev}
        hasNext={this.modalHasNext}
      />
    );

    return (
      <React.Fragment>
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

        <Dialog className={classes.dialog} fullScreen={true} open={modalOpen} onClose={this.handleModalClose}>
          <DialogContent>{modalContent}</DialogContent>
        </Dialog>

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
};

Gallery.propTypes = {
  classes: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  error: PropTypes.object,
  searchQuery: PropTypes.string,
  module: PropTypes.object, // immutable
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
