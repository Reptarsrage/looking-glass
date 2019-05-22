import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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
  },
  paper: {
    width: 'fit-content',
    height: 'fit-content',
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
      <div className={classes.container} onClick={clickHandler}>
        <Paper className={classes.paper} onClick={clickHandler}>
          <Elt src={src} title={title} width={width} height={height} autopilot={false} />
        </Paper>
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
