import React, { useEffect, useRef, useState, memo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import CollectionsIcon from '@material-ui/icons/Collections'
import { useHistory } from 'react-router'

import { modalItemIdSelector } from '../selectors/modalSelectors'
import { itemByIdSelector, itemGalleryUrlSelector } from '../selectors/itemSelectors'
import * as modalActions from '../actions/modalActions'
import Image from './Image'
import Video from './Video'

const styles = (theme) => ({
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
    justifyVontent: 'center',
    alignItems: 'center',
  },
})

const Item = ({
  classes,
  itemId,
  style,
  item,
  modalOpen,
  modalBoundsUpdate,
  modalItemId,
  modalSetItem,
  itemGalleryUrl,
}) => {
  const history = useHistory()
  const itemRef = useRef(null)
  const [ignoreEffect, setIgnoreEffect] = useState(false)

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

      modalBoundsUpdate(initialBounds)
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
    modalBoundsUpdate(initialBounds)
    modalSetItem(itemId)
    modalOpen()
  }

  const renderImage = () => <Image src={item.url} title={item.title} width={item.width} height={item.height} />

  const renderVideo = () => (
    <Video
      src={item.url}
      thumb={item.thumb}
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
  itemGalleryUrl: null,
  modalItemId: null,
  style: {},
}

Item.propTypes = {
  itemGalleryUrl: PropTypes.string,
  modalItemId: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isVideo: PropTypes.bool.isRequired,
    isGallery: PropTypes.bool.isRequired,
    url: PropTypes.string.isRequired,
    thumb: PropTypes.string,
  }).isRequired,
  style: PropTypes.object,
  modalOpen: PropTypes.func.isRequired,
  modalBoundsUpdate: PropTypes.func.isRequired,
  modalSetItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
  modalItemId: modalItemIdSelector,
  itemGalleryUrl: itemGalleryUrlSelector,
})

const mapDispatchToProps = {
  modalOpen: modalActions.modalOpen,
  modalBoundsUpdate: modalActions.modalBoundsUpdate,
  modalSetItem: modalActions.modalSetItem,
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(memo(Item, areEqual))
