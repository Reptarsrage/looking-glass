import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import TuneIcon from '@material-ui/icons/Tune'
import Drawer from '@material-ui/core/Drawer'
import { debounce } from 'lodash'

import { moduleSupportsSortingSelector, moduleSupportsFilteringSelector } from 'selectors/moduleSelectors'
import { forceRenderItemsSelector } from 'selectors/modalSelectors'
import { isAuthenticatedSelector, authUrlSelector } from 'selectors/authSelectors'
import { galleryByIdSelector, itemsInGallerySelector } from 'selectors/gallerySelectors'
import { itemDimensionsSelector } from 'selectors/itemSelectors'
import { fetchGallery, filterChange, saveScrollPosition } from 'actions/galleryActions'
import Breadcrumbs from 'components/Breadcrumbs'
import SortMenu from 'components/SortMenu'
import Masonry from 'components/Masonry'
import FilterList from 'components/FilterList'
import SelectedFilters from 'components/SelectedFilters'
import Modal from 'components/Modal'
import LoadingIndicator from 'components/LoadingIndicator'
import SearchBar from 'components/SearchBar'
import EndOfScrollToast from 'components/EndOfScrollToast'
import titleBar from '../titleBar'

const useStyles = makeStyles((theme) => ({
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
}))

export default function Gallery({ moduleId, galleryId, overlayButtonThreshold }) {
  const classes = useStyles()
  const [showOverlayButtons, setShowOverlayButtons] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showEndOfScrollToast, setShowEndOfScrollToast] = useState(false)
  const gallery = useSelector((state) => galleryByIdSelector(state, { galleryId }))
  const items = useSelector((state) => itemsInGallerySelector(state, { galleryId }))
  const itemDimensionsSelectorFunc = useSelector((state) => (itemId) => itemDimensionsSelector(state, { itemId }))
  const forceRenderItems = useSelector(forceRenderItemsSelector)
  const supportsSorting = useSelector((state) => moduleSupportsSortingSelector(state, { moduleId }))
  const supportsFiltering = useSelector((state) => moduleSupportsFilteringSelector(state, { moduleId }))
  const isAuthenticated = useSelector((state) => isAuthenticatedSelector(state, { moduleId }))
  const authUrl = useSelector((state) => authUrlSelector(state, { moduleId }))
  const dispatch = useDispatch()

  const { hasNext, fetching, error, fetched, title, savedScrollPosition } = gallery

  useEffect(() => {
    // set event listeners
    window.addEventListener('containerScroll', handleScroll)

    // fetch images
    fetchInitialItems()

    // set window title
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
    dispatch(filterChange(galleryId, filterId))
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
    dispatch(saveScrollPosition(galleryId, scrollTop))

    // show end of the line toast
    if (scrollTop + clientHeight >= scrollHeight - 10 && !hasNext) {
      setShowEndOfScrollToast(true)
    }
  }

  const fetchInitialItems = () => {
    // abort if waiting for authentication
    if (!isAuthenticated) {
      return
    }

    // check if first page is available and not already fetched, and fetch it
    if (!fetching && !fetched && !error) {
      dispatch(fetchGallery(galleryId))
    }
  }

  const loadMoreItems = () => {
    // abort if waiting for authentication
    if (!isAuthenticated) {
      return
    }

    // check if next page is available, and fetch it
    if (hasNext && !fetching) {
      dispatch(fetchGallery(galleryId))
    }
  }

  // redirect to authenticate
  if (!isAuthenticated) {
    return <Redirect to={authUrl} />
  }

  // tODO: Implement Desktop/mobile menus as per the demo here https://material-ui.com/components/app-bar/
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
  overlayButtonThreshold: 25,
}

Gallery.propTypes = {
  // required
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // optional
  overlayButtonThreshold: PropTypes.number,
}
