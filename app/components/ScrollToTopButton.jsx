import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Fab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { raf } from 'react-virtualized/dist/es/utils/animationFrame';

const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

export class ScrollToTopButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    raf(() => {
      window.scrollTo(0, 0);
    });
  }

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
