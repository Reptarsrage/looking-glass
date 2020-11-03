import React, { useState, useEffect } from 'react'
import { Redirect } from '@reach/router'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import TuneIcon from '@material-ui/icons/Tune'
import Drawer from '@material-ui/core/Drawer'
import { debounce } from 'lodash'

import { supportsSortingSelector, supportsFilteringSelector } from '../selectors/moduleSelectors'
import { forceRenderItemsSelector } from '../selectors/modalSelectors'
import { isAuthenticatedSelector, requiresAuthSelector, authUrlSelector } from '../selectors/authSelectors'
import { galleryByIdSelector, itemsInGallerySelector } from '../selectors/gallerySelectors'
import { itemDimensionsSelector } from '../selectors/itemSelectors'
import * as galleryActions from '../actions/galleryActions'
import Breadcrumbs from '../components/Breadcrumbs'
import SortMenu from '../components/SortMenu'
import Masonry from '../components/Masonry'
import FilterList from '../components/FilterList'
import SelectedFilters from '../components/SelectedFilters'
import Modal from '../components/Modal'
import LoadingIndicator from '../components/LoadingIndicator'
import SearchBar from '../components/SearchBar'
import EndOfScrollToast from '../components/EndOfScrollToast'
import titleBar from '../titleBar'

const styles = (theme) => ({
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
})

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
  itemDimensionsSelectorFunc,
  forceRenderItems,
  saveScrollPosition,
  supportsFiltering,
  supportsSorting,
}) => {
  const [showOverlayButtons, setShowOverlayButtons] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showEndOfScrollToast, setShowEndOfScrollToast] = useState(false)
  const { hasNext, fetching, error, fetched, title, savedScrollPosition } = gallery

  useEffect(() => {
    // set event listeners
    window.addEventListener('containerScroll', handleScroll)

    // fetch images
    fetchInitialItems()

    // Set window title
    titleBar.updateTitle(`'The Looking-Glass' - ${title}`)

    return () => {
      // remove event listeners from componentDidMount
      window.removeEventListener('containerScroll', handleScroll)
    }
  })

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleFilterClick = (filterId) => {
    setDrawerOpen(false)
    filterChange(galleryId, filterId)
  }

  const handleOpenDrawerClick = () => {
    setDrawerOpen(true)
  }

  const handleScroll = (event) => {
    const { clientHeight, scrollTop, scrollHeight } = event.currentTarget

    if (scrollTop >= overlayButtonThreshold && !showOverlayButtons) {
      setShowOverlayButtons(true)
    } else if (scrollTop < overlayButtonThreshold && showOverlayButtons) {
      setShowOverlayButtons(false)
    }

    const value = scrollHeight - scrollTop - clientHeight
    const threshold = Math.max(scrollHeight * 0.1, 1000)
    if (value < threshold) {
      loadMoreItems()
    }

    // save position for later
    saveScrollPosition(galleryId, scrollTop)

    // Show end of the line toast
    if (scrollTop + clientHeight >= scrollHeight - 10 && !hasNext) {
      setShowEndOfScrollToast(true)
    }
  }

  const fetchInitialItems = () => {
    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return
    }

    // Check if first page is available and not already fetched, and fetch it
    if (!fetching && !fetched && !error) {
      fetchGallery(galleryId)
    }
  }

  const loadMoreItems = () => {
    // Abort if waiting for authentication
    if (requiresAuth && !isAuthenticated) {
      return
    }

    // Check if next page is available, and fetch it
    if (hasNext && !fetching) {
      fetchGallery(galleryId)
    }
  }

  // Redirect to authenticate
  if (requiresAuth && !isAuthenticated) {
    return <Redirect to={authUrl} />
  }

  // TODO: Implement Desktop/mobile menus as per the demo here https://material-ui.com/components/app-bar/
  return (
    <>
      <Drawer classes={{ paper: classes.drawer }} anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <FilterList moduleId={moduleId} onClick={handleFilterClick} />
      </Drawer>

      <Toolbar variant="dense">
        <Breadcrumbs galleryId={galleryId} />
      </Toolbar>

      <Toolbar variant="dense">
        <SearchBar moduleId={moduleId} galleryId={galleryId} />
        <div className={classes.grow} />
        {supportsSorting && <SortMenu moduleId={moduleId} galleryId={galleryId} />}
        {supportsFiltering && (
          <Button onClick={handleOpenDrawerClick}>
            <TuneIcon className={classes.extendedIcon} />
            <Typography color="textSecondary">Filter</Typography>
          </Button>
        )}
      </Toolbar>

      <SelectedFilters galleryId={galleryId} />

      <Modal moduleId={moduleId} />

      <EndOfScrollToast open={showEndOfScrollToast} onClose={() => setShowEndOfScrollToast(false)} />

      {fetching && !fetched && <LoadingIndicator />}

      {fetched && (
        <Masonry
          key={galleryId}
          items={items}
          length={items.length}
          columnCount={3}
          getItemDimensions={itemDimensionsSelectorFunc}
          initialScrollTop={savedScrollPosition}
          gutter={8}
          onScroll={debounce(handleScroll, 200)}
          forceRenderItems={forceRenderItems}
        />
      )}
    </>
  )
}

Gallery.defaultProps = {
  authUrl: null,
  overlayButtonThreshold: 25,
}

Gallery.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // optional
  overlayButtonThreshold: PropTypes.number,

  // selectors
  gallery: PropTypes.shape({
    hasNext: PropTypes.bool.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    error: PropTypes.object,
    title: PropTypes.string.isRequired,
    savedScrollPosition: PropTypes.number.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemDimensionsSelectorFunc: PropTypes.func.isRequired,
  requiresAuth: PropTypes.bool.isRequired,
  authUrl: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  supportsSorting: PropTypes.bool.isRequired,
  supportsFiltering: PropTypes.bool.isRequired,
  forceRenderItems: PropTypes.arrayOf(PropTypes.string).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // actions
  fetchGallery: PropTypes.func.isRequired,
  filterChange: PropTypes.func.isRequired,
  saveScrollPosition: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  gallery: galleryByIdSelector,
  items: itemsInGallerySelector,
  requiresAuth: requiresAuthSelector,
  authUrl: authUrlSelector,
  isAuthenticated: isAuthenticatedSelector,
  itemDimensionsSelectorFunc: (state) => (itemId) => itemDimensionsSelector(state, { itemId }),
  forceRenderItems: forceRenderItemsSelector,
  supportsSorting: supportsSortingSelector,
  supportsFiltering: supportsFilteringSelector,
})

const mapDispatchToProps = {
  fetchGallery: galleryActions.fetchGallery,
  filterChange: galleryActions.filterChange,
  saveScrollPosition: galleryActions.saveScrollPosition,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Gallery)
