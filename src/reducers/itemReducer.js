import produce from 'immer';

import { generateItemId } from './constants';
import { FETCH_GALLERY_SUCCESS, CLEAR_GALLERY, ITEM_FULL_SCREEN } from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialItemState = {
  id: null,
  siteId: null,
  galleryId: null,
  title: null,
  description: null,
  width: 0,
  height: 0,
  isVideo: false,
  isGallery: false,
  url: null,
  thumb: null,
  isFullScreen: false,
};

const addItem = (draft, galleryId, item) => {
  // quick sanity check
  if (!item.width || !item.height || !item.url) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid item', item);
    }

    return;
  }

  // generate ids
  const itemId = generateItemId(galleryId, item.id);

  // if item does not exist
  if (!(itemId in draft.byId)) {
    // add item
    draft.allIds.push(itemId);
    draft.byId[itemId] = {
      ...item,
      siteId: item.id,
      id: itemId,
      galleryId,
    };
  }
};

const itemReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case CLEAR_GALLERY: {
        const galleryId = meta;

        // remove items
        const galleryItemsToRemove = state.allIds.filter((id) => state.byId[id].galleryId === galleryId);
        draft.allIds = state.allIds.filter((id) => state.byId[id].galleryId !== galleryId);
        galleryItemsToRemove.forEach((id) => delete draft.byId[id]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = meta;
        const gallery = payload;
        const { items } = gallery;

        // add items
        items.forEach((item) => addItem(draft, galleryId, item));
        break;
      }
      case ITEM_FULL_SCREEN: {
        const itemId = payload;

        // add items
        draft.byId[itemId].isFullScreen = !draft.byId[itemId].isFullScreen;
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default itemReducer;
