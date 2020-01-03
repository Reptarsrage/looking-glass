import React, { PureComponent } from 'react';
import { compose } from 'redux';
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
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  paper: {
    padding: 0,
    maxHeight: '100vh',
    display: 'inline-flex',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
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
    const { width, height, title, url } = item;

    return <Image src={url} title={title} width={width} height={height} />;
  };

  renderVideo = () => {
    const { item } = this.props;
    const { width, height, title, url } = item;

    return <Video src={url} title={title} width={width} height={height} autoPlay controls />;
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
    url: PropTypes.string,
    thumb: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(ModalItem);
