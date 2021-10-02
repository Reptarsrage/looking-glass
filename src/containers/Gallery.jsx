import React, { useState, useEffect, useCallback } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import TuneIcon from '@mui/icons-material/Tune'
import Drawer from '@mui/material/Drawer'
import debounce from 'lodash/debounce'

import { moduleSupportsSortingSelector, moduleSupportsFilteringSelector } from 'selectors/moduleSelectors'
import { isAuthenticatedSelector, authUrlSelector } from 'selectors/authSelectors'
import {
  gallerySavedScrollPositionSelector,
  galleryHasNextSelector,
  galleryItemsSelector,
  galleryFetchingSelector,
  galleryFetchedSelector,
  galleryErrorSelector,
  galleryPageSelector,
} from 'selectors/gallerySelectors'
import { itemDimensionsSelector } from 'selectors/itemSelectors'
import {
  forceRenderItemsSelector,
  modalNextSelector,
  modalOpenSelector,
  drawerOpenSelector,
} from 'selectors/modalSelectors'
import { fetchGallery, filterAdded, saveScrollPosition } from 'actions/galleryActions'
import { setDrawerOpen } from 'actions/modalActions'
import Breadcrumbs from 'components/Breadcrumbs'
import SortMenu from 'components/SortMenu'
import Masonry from 'components/Masonry'
import FilterList from 'components/FilterList'
import SelectedFilters from 'components/SelectedFilters'
import Modal from 'components/Modal'
import LoadingIndicator from 'components/LoadingIndicator'
import Toast from 'components/Toast'
import NoResults from 'components/NoResults'
import useQuery from '../hooks/useQuery'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: '1',
  },
  drawer: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    minWidth: '360px',
    height: 'calc(100% - 30px)',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  masonryContainer: {
    flex: '1 1 auto',
  },
}))

export default function Gallery({ overlayButtonThreshold }) {
  const classes = useStyles()
  const query = useQuery()
  const history = useHistory()
  const params = useParams()

  const { galleryId, moduleId } = params
  const { filters, search, sort } = query

  const [showOverlayButtons, setShowOverlayButtons] = useState(false)
  const [showEndOfScrollToast, setShowEndOfScrollToast] = useState(false)
  const items = useSelector((state) => galleryItemsSelector(state, { galleryId }))
  const itemDimensionsSelectorFunc = useSelector((state) => (itemId) => itemDimensionsSelector(state, { itemId }))
  const forceRenderItems = useSelector(forceRenderItemsSelector)
  const supportsSorting = useSelector((state) => moduleSupportsSortingSelector(state, { moduleId }))
  const supportsFiltering = useSelector((state) => moduleSupportsFilteringSelector(state, { moduleId }))
  const isAuthenticated = useSelector((state) => isAuthenticatedSelector(state, { moduleId }))
  const authUrl = useSelector((state) => authUrlSelector(state, { moduleId, galleryId }))
  const hasNext = useSelector((state) => galleryHasNextSelector(state, { galleryId }))
  const page = useSelector((state) => galleryPageSelector(state, { galleryId }))
  const fetching = useSelector((state) => galleryFetchingSelector(state, { galleryId }))
  const fetched = useSelector((state) => galleryFetchedSelector(state, { galleryId }))
  const error = useSelector((state) => galleryErrorSelector(state, { galleryId }))
  const savedScrollPosition = useSelector((state) => gallerySavedScrollPositionSelector(state, { galleryId }))
  const modalNext = useSelector(modalNextSelector)
  const modalOpen = useSelector(modalOpenSelector)
  const drawerOpen = useSelector(drawerOpenSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    // set event listeners
    window.addEventListener('containerScroll', handleScroll)

    return () => {
      // remove event listeners from componentDidMount
      window.removeEventListener('containerScroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // fetch images
    fetchInitialItems()
  }, [query, params])

  useEffect(() => {
    // show end of the line toast
    if (!hasNext && !modalNext && modalOpen) {
      setShowEndOfScrollToast(true)
    }
  }, [modalOpen, modalNext, modalOpen])

  const handleDrawerClose = useCallback(() => {
    dispatch(setDrawerOpen(false))
  }, [])

  const handleFilterClick = useCallback(
    (filterId) => {
      dispatch(setDrawerOpen(false))
      dispatch(filterAdded(galleryId, filterId, history))
    },
    [galleryId]
  )

  const handleOpenDrawerClick = useCallback(() => {
    dispatch(setDrawerOpen(true))
  }, [])

  const handleScroll = useCallback(
    (event) => {
      const { clientHeight, scrollTop, scrollHeight } = event.currentTarget

      if (scrollTop >= overlayButtonThreshold && !showOverlayButtons) {
        setShowOverlayButtons(true)
      } else if (scrollTop < overlayButtonThreshold && showOverlayButtons) {
        setShowOverlayButtons(false)
      }

      // load next page as soon as user has scrolled to
      // the last loaded page
      // this works seamlessly assuming pages are tall enough
      // to take up at least the whole screen
      const currentScroll = scrollTop + clientHeight
      const threshold = ((page - 1) / page) * scrollHeight
      if (currentScroll >= threshold) {
        loadMoreItems()
      }

      // save position for later
      dispatch(saveScrollPosition(galleryId, scrollTop))

      // show end of the line toast
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10
      if (scrolledToBottom && !hasNext && !modalOpen) {
        setShowEndOfScrollToast(true)
      }
    },
    [galleryId, page, hasNext, modalOpen, overlayButtonThreshold, showOverlayButtons]
  )

  const fetchInitialItems = () => {
    // abort if waiting for authentication
    if (!isAuthenticated) {
      return
    }

    // check if first page is available and not already fetched, and fetch it
    if (!fetched && !fetching) {
      dispatch(fetchGallery(galleryId, filters, sort, search))
    }
  }

  const loadMoreItems = () => {
    // abort if waiting for authentication
    if (!isAuthenticated) {
      return
    }

    // check if next page is available, and fetch it
    if (hasNext && !fetching) {
      dispatch(fetchGallery(galleryId, filters, sort, search))
    }
  }

  // redirect to authenticate
  if (!isAuthenticated) {
    return <Redirect to={authUrl} />
  }

  if (fetched && !fetching && !error && items.length === 0) {
    return <NoResults />
  }

  // TODO: Implement Desktop/mobile menus as per the demo here https://material-ui.com/components/app-bar/
  return (
    <>
      <Drawer classes={{ paper: classes.drawer }} anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <FilterList moduleId={moduleId} onClick={handleFilterClick} />
      </Drawer>

      <Toolbar variant="dense">
        <Breadcrumbs galleryId={galleryId} />
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

      <Toast
        open={showEndOfScrollToast}
        severity="info"
        message="You've reached the end!"
        onClose={() => setShowEndOfScrollToast(false)}
      />

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
  // optional
  overlayButtonThreshold: PropTypes.number,
}
