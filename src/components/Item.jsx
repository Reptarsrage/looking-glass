import React, { useEffect, useRef, useState, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import CollectionsIcon from '@material-ui/icons/Collections'
import { useHistory } from 'react-router-dom'

import { modalItemIdSelector } from 'selectors/modalSelectors'
import { itemByIdSelector, itemGalleryUrlSelector, itemUrlsSelector } from 'selectors/itemSelectors'
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
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
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
  const itemRef = useRef(null)
  const [ignoreEffect, setIgnoreEffect] = useState(false)
  const item = useSelector((state) => itemByIdSelector(state, { itemId }))
  const sources = useSelector((state) => itemUrlsSelector(state, { itemId }))
  const modalItemId = useSelector(modalItemIdSelector)
  const itemGalleryUrl = useSelector((state) => itemGalleryUrlSelector(state, { itemId }))
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

    if (item.isGallery) {
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

  const renderImage = () => <Image sources={sources} title={item.title} width={item.width} height={item.height} />

  const renderVideo = () => (
    <Video
      sources={sources}
      poster={item.poster}
      title={item.title}
      width={item.width}
      height={item.height}
      muted
      controls={false}
      autoPlay
      loop
    />
  )

  return (
    <div
      ref={itemRef}
      className={classes.item}
      style={{ ...style, visibility: modalItemId === itemId ? 'hidden' : 'visible' }}
      role="button"
      onClick={handleClick}
      onKeyPress={() => {}}
      tabIndex="0"
    >
      {item.isGallery ? (
        <div className={classes.icon}>
          <CollectionsIcon />
        </div>
      ) : null}
      {item.isVideo ? renderVideo() : renderImage()}
    </div>
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
