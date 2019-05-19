import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { imagesSelector, fetchingSelector, errorSelector } from '../selectors/gallerySelectors';
import * as galleryActions from '../actions/galleryActions';
import Masonry from '../components/Masonry';

const styles = () => ({
  floated: {
    position: 'fixed',
    top: '10px',
    right: '10px',
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

  componentDidMount() {
    const { fetchImages, images, fetching, match } = this.props;
    const { moduleId } = match.params;
    if (images.size === 0 && !fetching) {
      fetchImages(moduleId);
    }
  }

  render() {
    const { images, fetching, fetchImages, error, classes, match } = this.props;
    const { moduleId } = match.params;
    return (
      <React.Fragment>
        <Typography variant="h1">Images</Typography>

        <div className={classes.floated}>
          <Button variant="contained" color="primary" component={Link} to="/">
            Home
          </Button>
        </div>

        <Masonry moduleId={moduleId} items={images} loading={fetching} error={error !== null} loadMore={fetchImages} />
      </React.Fragment>
    );
  }
}

Gallery.defaultProps = {
  error: null,
};

Gallery.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ moduleId: PropTypes.string.isRequired }).isRequired }).isRequired,
  error: PropTypes.object,
};

const mapStateToProps = (_, ownProps) => {
  const { moduleId } = ownProps.match.params;
  return createStructuredSelector({
    images: imagesSelector(moduleId),
    fetching: fetchingSelector(moduleId),
    error: errorSelector(moduleId),
  });
};

const mapDispatchToProps = {
  fetchImages: galleryActions.fetchImages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Gallery));
