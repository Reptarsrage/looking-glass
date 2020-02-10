import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import { animateScroll } from 'react-scroll';

const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

class ScrollToTopButton extends PureComponent {
  scrollToTop = () => {
    animateScroll.scrollToTop({
      duration: 400,
      delay: 0,
      smooth: 'easeInCubic',
      containerId: 'scroll-container',
    });
  };

  render() {
    const { color, classes } = this.props;

    return (
      <Fab color={color} aria-label="Back" className={classes.fab} onClick={this.scrollToTop}>
        <ArrowUpwardIcon />
      </Fab>
    );
  }
}

ScrollToTopButton.defaultProps = {
  color: 'default',
};

ScrollToTopButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
};

export default compose(withStyles(styles))(ScrollToTopButton);
