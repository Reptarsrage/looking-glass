import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';

import {
  modalItemIdSelector,
  modalNextSelector,
  modalPrevSelector,
  modalOpenSelector,
  modalBoundsSelector,
} from '../selectors/modalSelectors';
import * as modalActions from '../actions/modalActions';
import SlideShow from './SlideShow';

const styles = (theme) => ({
  modal: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 2,
    background: 'transparent',
  },
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
    top: '16px',
    right: '16px',
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 3,
  },
});

const Modal = ({ classes, modalOpen, modalBounds, modalClear, modalClose }) => {
  const handleAnimationComplete = () => {
    if (!modalOpen) {
      modalClear();
    }
  };

  const close = () => {
    modalClose();
  };

  let initial = false;
  if (modalBounds) {
    const { top, left, width, height } = modalBounds;
    initial = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  return (
    <>
      <Fade in={modalOpen}>
        <div className={classes.backdrop} />
      </Fade>

      <Zoom in={modalOpen}>
        <Fab color="default" aria-label="Close" className={classes.button} onClick={close}>
          <CloseIcon />
        </Fab>
      </Zoom>

      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {modalOpen && (
          <motion.div
            initial={initial}
            animate={{ top: 0, left: 0, width: '100%', height: '100%' }}
            exit={initial}
            transition={{ duration: 0.2 }}
            className={classes.modal}
          >
            <SlideShow />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

Modal.defaultProps = {
  modalBounds: null,
};

Modal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  modalBounds: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  modalClear: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modalItemId: modalItemIdSelector,
  modalNext: modalNextSelector,
  modalPrev: modalPrevSelector,
  modalOpen: modalOpenSelector,
  modalBounds: modalBoundsSelector,
});

const mapDispatchToProps = {
  modalClear: modalActions.modalClear,
  modalClose: modalActions.modalClose,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Modal);
