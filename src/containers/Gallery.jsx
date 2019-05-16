import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { imagesSelector, fetchingSelector, errorSelector } from '../selectors/gallerySelectors';
import * as galleryActions from '../actions/galleryActions';
import WithErrors from '../hocs/WithErrors';
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
    const { fetchImages, images, fetching } = this.props;
    if (images.size === 0 && !fetching) {
      fetchImages();
    }
  }

  render() {
    const { images, fetching, fetchImages, error, classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h1">Images</Typography>

        <div className={classes.floated}>
          <Button variant="contained" color="primary" component={Link} to="/about">
            About
          </Button>
        </div>

        <Masonry items={images} loading={fetching} error={error !== null} loadMore={fetchImages} />
      </React.Fragment>
    );
  }
}

Gallery.defaultProps = {
  error: null,
};

Gallery.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
};

const mapStateToProps = createStructuredSelector({
  images: imagesSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
});

const mapDispatchToProps = {
  fetchImages: galleryActions.fetchImages,
};

export default compose(
  WithErrors,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withStyles(styles)(Gallery));
