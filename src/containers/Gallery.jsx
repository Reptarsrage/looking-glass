import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { imagesSelector, fetchingSelector, errorSelector } from '../selectors/gallerySelectors';
import { moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';
import * as galleryActions from '../actions/galleryActions';
import Masonry from '../components/Masonry';
import BackButton from '../components/BackButton';

const styles = () => ({
  floated: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 2,
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

    this.fetchInitialImages = this.fetchInitialImages.bind(this);
  }

  componentDidMount() {
    this.fetchInitialImages();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.fetchInitialImages();
    }
  }

  fetchInitialImages() {
    const { fetchImages, images, fetching, moduleId, galleryId } = this.props;
    if (images.size === 0 && !fetching) {
      fetchImages(moduleId, galleryId);
    }
  }

  render() {
    const { images, fetching, fetchImages, error, classes, moduleId, galleryId, location } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h1">Images</Typography>

        <div className={classes.floated}>
          <BackButton />
        </div>

        <Masonry
          key={`${moduleId}_${galleryId}`}
          location={location}
          moduleId={moduleId}
          galleryId={galleryId}
          items={images}
          loading={fetching}
          error={error !== null}
          loadMore={fetchImages}
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
  location: PropTypes.object.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  images: imagesSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  moduleId: moduleIdSelector(),
  galleryId: galleryIdSelector(),
});

const mapDispatchToProps = {
  fetchImages: galleryActions.fetchImages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Gallery));
