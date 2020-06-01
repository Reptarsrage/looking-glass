import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import TuneIcon from '@material-ui/icons/Tune';
import Drawer from '@material-ui/core/Drawer';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';

import { productName } from '../../package.json';
import { forceRenderItemsSelector } from '../selectors/modalSelectors';
import { isAuthenticatedSelector, requiresAuthSelector, authUrlSelector } from '../selectors/authSelectors';
import { galleryByIdSelector, itemsInGallerySelector } from '../selectors/gallerySelectors';
import { itemWidthSelector, itemHeightSelector } from '../selectors/itemSelectors';
import * as moduleActions from '../actions/moduleActions';
import Breadcrumbs from '../components/Breadcrumbs';
import SortMenu from '../components/SortMenu';
import Masonry from '../components/Masonry';
import ScrollToTopButton from '../components/ScrollToTopButton';
import FilterList from '../components/FilterList';
import SelectedFilters from '../components/SelectedFilters';
import Modal from '../components/Modal';

const styles = (theme) => ({
  floatedBottomRight: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: theme.zIndex.drawer - 1,
  },
  grow: {
    flexGrow: '1',
  },
  drawer: {
    minWidth: '360px',
    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d5d5d5',
      borderRadius: '2px',
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  masonryContainer: {
    flex: '1 1 auto',
  },
});

const Gallery = ({
  items,
  classes,
  moduleId,
  galleryId,
  gallery,
  isAuthenticated,
  requiresAuth,
  authUrl,
  filterChange,
  overlayButtonThreshold,
  fetchGallery,
  itemWidthSelectorFunc,
  itemHeightSelectorFunc,
  forceRenderItems,
}) => {
  const [showOverlayButtons, setShowOverlayButtons] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // set event listeners
    window.addEventListener('containerScroll', handleScroll);

    // fetch images
    fetchInitialItems();

    return () => {
      // remove event listeners from componentDidMount
      window.removeEventListener('containerScroll', handleScroll);
    };
  });

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleFilterClick = (filterId) => {
    setDrawerOpen(false);
    filterChange(moduleId, galleryId, filterId);
  };

  const handleOpenDrawerClick = () => {
    setDrawerOpen(true);
  };

  const handleScroll = (event) => {
    const { clientHeight, scrollTop, scrollHeight } = event.currentTarget;

    if (scrollTop >= overlayButtonThreshold && !showOverlayButtons) {
      setShowOverlayButtons(true);
    } else if (scrollTop < overlayButtonThreshold && showOverlayButtons) {
      setShowOverlayButtons(false);
    }

    if (scrollHeight - scrollTop - clientHeight < clientHeight) {
      loadMoreItems();
    }
  };

  const fetchInitialItems = () => {
    const { fetching, success } = gallery;

    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return;
    }

    // Check if first page is available and not already fetched, and fetch it
    if (!fetching && !success) {
      fetchGallery(moduleId, galleryId);
    }
  };

  const loadMoreItems = () => {
    const { hasNext, fetching } = gallery;

    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return;
    }

    // Check if next page is available, and fetch it
    if (hasNext && !fetching) {
      fetchGallery(moduleId, galleryId);
    }
  };

  const getItemHeight = (itemId) => {
    return itemHeightSelectorFunc(itemId);
  };

  const getItemWidth = (itemId) => {
    return itemWidthSelectorFunc(itemId);
  };

  // Redirect to authenticate
  if (requiresAuth && !isAuthenticated) {
    return <Redirect to={authUrl} />;
  }

  // TODO: Implement Desktop/mobile menus as per the demo here https://material-ui.com/components/app-bar/
  const { title } = gallery;
  return (
    <>
      <Helmet>
        <title>{`${productName} - ${title}`}</title>
      </Helmet>

      <Drawer classes={{ paper: classes.drawer }} anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <FilterList moduleId={moduleId} onClick={handleFilterClick} />
      </Drawer>

      <Toolbar variant="dense">
        <Breadcrumbs />
        <div className={classes.grow} />
        <SortMenu moduleId={moduleId} galleryId={galleryId} />
        <Button onClick={handleOpenDrawerClick}>
          <TuneIcon className={classes.extendedIcon} />
          <Typography color="textSecondary">Filter</Typography>
        </Button>
      </Toolbar>

      <SelectedFilters moduleId={moduleId} galleryId={galleryId} />

      <div className={classes.floatedBottomRight}>{showOverlayButtons ? <ScrollToTopButton /> : null}</div>

      <Modal />

      <Masonry
        items={items}
        length={items.length}
        columnCount={3}
        getItemDimensions={(id) => ({ width: getItemWidth(id), height: getItemHeight(id) })}
        initialScrollTop={0}
        gutter={8}
        onScroll={debounce(handleScroll, 200)}
        forceRenderItems={forceRenderItems}
      />
    </>
  );
};

Gallery.defaultProps = {
  authUrl: null,
  overlayButtonThreshold: 25,
};

Gallery.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // optional
  overlayButtonThreshold: PropTypes.number,

  // selectors
  gallery: PropTypes.shape({
    hasNext: PropTypes.bool,
    fetching: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.object,
    title: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemHeightSelectorFunc: PropTypes.func.isRequired,
  itemWidthSelectorFunc: PropTypes.func.isRequired,
  requiresAuth: PropTypes.bool.isRequired,
  authUrl: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  forceRenderItems: PropTypes.arrayOf(PropTypes.string).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // actions
  fetchGallery: PropTypes.func.isRequired,
  filterChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  gallery: galleryByIdSelector,
  items: itemsInGallerySelector,
  requiresAuth: requiresAuthSelector,
  authUrl: authUrlSelector,
  isAuthenticated: isAuthenticatedSelector,
  itemHeightSelectorFunc: (state) => (itemId) => itemHeightSelector(state, { itemId }),
  itemWidthSelectorFunc: (state) => (itemId) => itemWidthSelector(state, { itemId }),
  forceRenderItems: forceRenderItemsSelector,
});

const mapDispatchToProps = {
  fetchGallery: moduleActions.fetchGallery,
  filterChange: moduleActions.filterChange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Gallery);
