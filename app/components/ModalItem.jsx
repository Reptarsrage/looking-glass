import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { itemByIdSelector } from '../selectors/itemSelectors';
import Image from './Image';
import Video from './Video';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  paper: {
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class ModalItem extends PureComponent {
  handleClick = () => {
    const { onClick, itemId } = this.props;
    if (onClick) {
      onClick(itemId);
    }
  };

  renderImage = () => {
    const { item } = this.props;
    const { width, height, title, imageURL } = item;

    return <Image src={imageURL} title={title} width={width} height={height} />;
  };

  renderVideo = () => {
    const { item } = this.props;
    const { width, height, title, videoURL } = item;

    return <Video src={videoURL} title={title} width={width} height={height} autoPlay controls />;
  };

  render() {
    const { classes, item } = this.props;
    const { isVideo } = item;

    return (
      <div className={classes.container}>
        <Paper className={classes.paper} onClick={this.handleClick}>
          {isVideo ? this.renderVideo() : this.renderImage()}
        </Paper>
      </div>
    );
  }
}

ModalItem.defaultProps = {
  onClick: null,
};

ModalItem.propTypes = {
  classes: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    imageURL: PropTypes.string,
    thumbURL: PropTypes.string,
    videoURL: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(ModalItem);
