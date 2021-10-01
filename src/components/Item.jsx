import React, { useEffect, useState, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import Tooltip from '@mui/material/Tooltip'
import CollectionsIcon from '@mui/icons-material/Collections'
import Paper from '@mui/material/Paper'
import { useHistory } from 'react-router-dom'

import { modalItemIdSelector } from 'selectors/modalSelectors'
import {
  itemGalleryUrlSelector,
  itemUrlsSelector,
  itemIsGallerySelector,
  itemPosterSelector,
  itemWidthSelector,
  itemHeightSelector,
  itemIsVideoSelector,
  itemNameSelector,
} from 'selectors/itemSelectors'

import { modalOpen, modalBoundsUpdate, modalSetItem } from 'actions/modalActions'
import Image from './Image'
import Video from './Video'

const useStyles = makeStyles((theme) => ({
  item: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    minHeight: '40px',
  },
  icon: {
    padding: theme.spacing(1),
    background: 'rgba(0, 0, 0, 0.32)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

function Item({ itemId, style }) {
  const classes = useStyles()
  const history = useHistory()
  const [itemEl, setItemEl] = useState(null)
  const [cornerEl, setCornerEl] = useState(null)
  const [ignoreEffect, setIgnoreEffect] = useState(false)
  const sources = useSelector((state) => itemUrlsSelector(state, { itemId }))
  const modalItemId = useSelector(modalItemIdSelector)
  const itemGalleryUrl = useSelector((state) => itemGalleryUrlSelector(state, { itemId }))
  const isGallery = useSelector((state) => itemIsGallerySelector(state, { itemId }))
  const isVideo = useSelector((state) => itemIsVideoSelector(state, { itemId }))
  const poster = useSelector((state) => itemPosterSelector(state, { itemId }))
  const width = useSelector((state) => itemWidthSelector(state, { itemId }))
  const height = useSelector((state) => itemHeightSelector(state, { itemId }))
  const name = useSelector((state) => itemNameSelector(state, { itemId }))
  const dispatch = useDispatch()

  useEffect(() => {
    if (ignoreEffect) {
      setIgnoreEffect(false)
      return
    }

    if (modalItemId === itemId) {
      itemRef.current.scrollIntoView()
      const bounds = itemRef.current.getBoundingClientRect()
      const initialBounds = {
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      }

      dispatch(modalBoundsUpdate(initialBounds))
    }
  }, [modalItemId])

  const handleClick = (event) => {
    event.preventDefault()

    if (isGallery) {
      history.push(itemGalleryUrl)
      return
    }

    const { currentTarget } = event
    const bounds = currentTarget.getBoundingClientRect()
    const initialBounds = {
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    }

    setIgnoreEffect(true)
    dispatch(modalBoundsUpdate(initialBounds))
    dispatch(modalSetItem(itemId))
    dispatch(modalOpen())
  }

  const renderImage = () => <Image sources={sources} title={name} width={width} height={height} />

  const renderVideo = () => (
    <Video sources={sources} poster={poster} width={width} height={height} muted controls={false} autoPlay loop />
  )

  const cornerRef = useCallback((node) => {
    if (node !== null) {
      setCornerEl(node)
    }
  }, [])

  const itemRef = useCallback((node) => {
    if (node !== null) {
      setItemEl(node)
    }
  }, [])

  return (
    <Tooltip
      title={name}
      placement="left"
      PopperProps={{
        anchorEl: cornerEl,
        container: itemEl,
      }}
    >
      <Paper
        ref={itemRef}
        className={classes.item}
        style={{ ...style, visibility: modalItemId === itemId ? 'hidden' : 'visible' }}
        role="button"
        onClick={handleClick}
        onKeyPress={() => {}}
        tabIndex="0"
      >
        <div ref={cornerRef} className={classes.corner}>
          {isGallery ? (
            <div className={classes.icon}>
              <CollectionsIcon />
            </div>
          ) : null}
        </div>
        {isVideo ? renderVideo() : renderImage()}
      </Paper>
    </Tooltip>
  )
}

Item.defaultProps = {
  style: {},
}

Item.propTypes = {
  // required
  itemId: PropTypes.string.isRequired,

  // optional
  style: PropTypes.object,
}

function areEqual(nextProps, prevProps) {
  const isModal = (p) => p.itemId === p.modalItemId

  return (
    nextProps.style.top === prevProps.style.top &&
    isModal(nextProps) === isModal(prevProps) &&
    nextProps.style.width === prevProps.style.width &&
    nextProps.style.height === prevProps.style.height &&
    nextProps.style.left === prevProps.style.left &&
    nextProps.itemId === prevProps.itemId
  )
}

export default memo(Item, areEqual)
