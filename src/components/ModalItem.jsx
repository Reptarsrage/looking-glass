import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '@material-ui/icons';
import { Fab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Image from './Image';
import Video from './Video';

const styles = () => ({
  container: {
    marginTop: '2rem',
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'calc(100vh - 4rem)',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
});

class ModalItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }

  render() {
    const { classes, width, height, title, videoURL, imageURL, isVideo } = this.props;

    const Elt = isVideo ? Video : Image;
    const src = isVideo ? videoURL : imageURL;
    const clickHandler = this.handleClick;

    return (
      <div onClick={clickHandler} className={classes.container}>
        <Fab aria-label="Close" className={classes.fab} onClick={this.handleClick}>
          <Close />
        </Fab>
        <Elt src={src} title={title} width={width} height={height} />
      </div>
    );
  }
}

ModalItem.defaultProps = {
  videoURL: '',
  imageURL: '',
  title: '',
  onClick: null,
};

ModalItem.propTypes = {
  classes: PropTypes.object.isRequired,
  videoURL: PropTypes.string,
  imageURL: PropTypes.string,
  isVideo: PropTypes.bool.isRequired,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(ModalItem);
