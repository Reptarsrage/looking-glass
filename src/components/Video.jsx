import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { extname } from 'path';

const styles = () => ({
  video: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    marginBottom: '-4px',
  },
});

class Video extends React.PureComponent {
  render() {
    const { classes, src, title, to, width, height } = this.props;

    const Wrapper = to ? Link : React.Fragment;

    return (
      <Wrapper to={to}>
        <video className={classes.video} width={width} height={height} title={title} muted autoPlay loop>
          <source src={src} type={`video/${extname(src).slice(1)}`} />
        </video>
      </Wrapper>
    );
  }
}

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  title: PropTypes.string,
  to: PropTypes.string,
};

export default withStyles(styles)(Video);
