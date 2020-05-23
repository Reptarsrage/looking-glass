import React from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import * as appActions from '../actions/appActions';
import { fullScreenInSelector } from '../selectors/appSelectors';
import { fullScreenItemSelector, prevItemSelector, nextItemSelector } from '../selectors/itemSelectors';

const styles = (theme) => ({
  backdrop: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 1,
    background: 'rgba(0,0,0,1)',
  },
  button: {
    top: '50%',
    position: 'fixed',
    transform: 'translate(0, -50%)',
    zIndex: theme.zIndex.drawer + 3,
  },
  prev: {
    left: '0.5rem',
  },
  next: {
    right: '0.5rem',
  },
});

const FullScreenItemControls = ({ classes, item, fullScreenIn, prevItemId, nextItemId, fullScreenItemChange }) => {
  if (!item) {
    return null;
  }

  const handleSwitchToItem = (itemId) => {
    fullScreenItemChange(itemId);
  };

  return (
    <>
      <Fade in={fullScreenIn}>
        <div className={classes.backdrop} />
      </Fade>
      <Zoom in={fullScreenIn}>
        <Fab
          color="default"
          aria-label="Previous"
          className={clsx(classes.prev, classes.button)}
          onClick={() => handleSwitchToItem(prevItemId)}
          style={{ display: prevItemId ? 'inline-flex' : 'none' }}
        >
          <ChevronLeftIcon />
        </Fab>
      </Zoom>
      <Zoom in={fullScreenIn}>
        <Fab
          color="default"
          aria-label="Next"
          className={clsx(classes.next, classes.button)}
          onClick={() => handleSwitchToItem(nextItemId)}
          style={{ display: nextItemId ? 'inline-flex' : 'none' }}
        >
          <ChevronRightIcon />
        </Fab>
      </Zoom>
    </>
  );
};

FullScreenItemControls.defaultProps = {
  item: null,
  prevItemId: null,
  nextItemId: null,
};

FullScreenItemControls.propTypes = {
  // withStyles
  classes: PropTypes.object.isRequired,

  // selectors
  fullScreenIn: PropTypes.bool.isRequired,
  prevItemId: PropTypes.string,
  nextItemId: PropTypes.string,
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),

  // actions
  fullScreenItemChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  prevItemId: prevItemSelector,
  nextItemId: nextItemSelector,
  item: fullScreenItemSelector,
  fullScreenIn: fullScreenInSelector,
});

const mapDispatchToProps = {
  fullScreenItemChange: appActions.fullScreenItemChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(FullScreenItemControls);
