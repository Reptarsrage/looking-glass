import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Backdrop from '@material-ui/core/Backdrop';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import clsx from 'clsx';
import { useHistory } from 'react-router';

import {
  modalItemIdSelector,
  modalNextSelector,
  modalPrevSelector,
  modalOpenSelector,
  modalBoundsSelector,
  modalItemSelector,
  modalItemHasFiltersSelector,
} from '../selectors/modalSelectors';
import { defaultGalleryIdSelector } from '../selectors/moduleSelectors';
import * as modalActions from '../actions/modalActions';
import * as galleryActions from '../actions/galleryActions';
import SlideShow from './SlideShow';
import FilterValue from './FilterValue';

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
  menuButton: {
    top: '116px',
  },
  caption: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: '100px',
    background: 'linear-gradient(#000, transparent)',
    zIndex: theme.zIndex.drawer + 4,
    padding: theme.spacing(1),
  },
});

const Modal = ({
  classes,
  modalOpen,
  modalBounds,
  modalClear,
  modalClose,
  modalItem,
  filterChange,
  moduleId,
  defaultGalleryId,
  modalItemHasFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(true);
  const history = useHistory();

  const handleAnimationComplete = () => {
    if (!modalOpen) {
      modalClear();
    }
  };

  const close = () => {
    modalClose();
  };

  const drawerOpen = () => {
    setOpen(true);
  };

  const drawerClose = (filterId) => {
    setOpen(false);

    // TODO: Something better than this
    if (filterId) {
      modalClose();
      filterChange(defaultGalleryId, filterId);
      history.push(`/gallery/${moduleId}/${defaultGalleryId}`);
    }
  };

  const onAnimationStart = () => {
    setAnimating(true);
  };

  const onAnimationComplete = () => {
    setAnimating(false);
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
        <div className={classes.caption}>
          <Typography variant="h4">{modalItem.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {modalItem.description}
          </Typography>
        </div>
      </Fade>

      <Backdrop className={classes.backdrop} open={modalOpen} />

      <Zoom in={modalOpen}>
        <Fab color="default" aria-label="Close" className={classes.button} onClick={close}>
          <CloseIcon />
        </Fab>
      </Zoom>

      {modalItemHasFilters && (
        <Zoom in={modalOpen}>
          <Fab color="default" className={clsx(classes.button, classes.menuButton)} onClick={drawerOpen}>
            <MenuIcon />
          </Fab>
        </Zoom>
      )}

      <Drawer anchor="right" open={open} onClose={() => drawerClose()}>
        {modalItemHasFilters && (
          <List>
            {modalItem.filters.map((filterId) => (
              <FilterValue key={filterId} filterId={filterId} onClick={drawerClose} />
            ))}
          </List>
        )}
      </Drawer>

      {modalItem && modalItem.id && (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
          {modalOpen && (
            <motion.div
              initial={initial}
              animate={{ top: 0, left: 0, width: '100%', height: '100%' }}
              exit={initial}
              transition={{ duration: 0.2 }}
              onAnimationStart={onAnimationStart}
              onAnimationComplete={onAnimationComplete}
              className={classes.modal}
            >
              <SlideShow animating={animating} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

Modal.defaultProps = {
  modalBounds: null,
};

Modal.propTypes = {
  moduleId: PropTypes.string.isRequired,
  modalItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    galleryId: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  modalOpen: PropTypes.bool.isRequired,
  modalBounds: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  modalItemHasFilters: PropTypes.bool.isRequired,
  defaultGalleryId: PropTypes.string.isRequired,
  modalClear: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  filterChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modalItem: modalItemSelector,
  modalItemId: modalItemIdSelector,
  modalNext: modalNextSelector,
  modalPrev: modalPrevSelector,
  modalOpen: modalOpenSelector,
  modalBounds: modalBoundsSelector,
  defaultGalleryId: defaultGalleryIdSelector,
  modalItemHasFilters: modalItemHasFiltersSelector,
});

const mapDispatchToProps = {
  modalClear: modalActions.modalClear,
  modalClose: modalActions.modalClose,
  filterChange: galleryActions.filterChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Modal);
