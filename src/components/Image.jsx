import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = () => ({
  image: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    marginBottom: '-4px',
  },
});

class Image extends React.PureComponent {
  render() {
    const { classes, src, width, height, title, to } = this.props;

    const Wrapper = to ? Link : React.Fragment;
    const props = to ? { to } : {};

    return (
      <Wrapper {...props}>
        <img className={classes.image} src={src} alt={title} width={width} height={height} title={title} />
      </Wrapper>
    );
  }
}

Image.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  to: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(Image);
