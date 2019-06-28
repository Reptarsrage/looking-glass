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

import { imagesSelector, fetchingSelector, errorSelector, hasNextSelector } from '../selectors/gallerySelectors';
import { moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';
import * as galleryActions from '../actions/galleryActions';
import Masonry from '../components/Masonry';
import BackButton from '../components/BackButton';
import ModalItem from '../components/ModalItem';

const styles = () => ({
  floated: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 2,
  },
  dialog: {
    maxHeight: '100vh',
    overflow: 'auto',
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
      showBackButton: false,
    };

    this.fetchInitialImages = this.fetchInitialImages.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.loadMoreImages = this.loadMoreImages.bind(this);
    this.onScroll = this.onScroll.bind(this);
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

  onScroll() {
    const { showBackButton } = this.state;

    if (window.scrollY > 100 && !showBackButton) {
      this.setState({ showBackButton: true });
    } else if (window.scrollY <= 100 && showBackButton) {
      this.setState({ showBackButton: false });
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

  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  handleItemClick(id) {
    this.setState({ modalOpen: true, modalItemId: id });
  }

  render() {
    const { images, fetching, error, classes, moduleId, galleryId, location } = this.props;
    const { modalOpen, modalItemId, showBackButton } = this.state;

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
      />
    );

    return (
      <React.Fragment>
        <Typography variant="h1">Images</Typography>

        <div className={classes.floated}>{showBackButton ? <BackButton /> : null}</div>

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
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  images: imagesSelector(),
  hasNext: hasNextSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  moduleId: moduleIdSelector(),
  galleryId: galleryIdSelector(),
});

const mapDispatchToProps = {
  fetchImages: galleryActions.fetchImages,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Gallery);
