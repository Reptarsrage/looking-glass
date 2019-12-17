import produce from 'immer';

import { generateGalleryItemId, generateItemId } from './constants';
import { FETCH_GALLERY_SUCCESS, CLEAR_GALLERY } from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

const addGalleryItem = (draft, galleryId, item) => {
  // quick sanity check
  if (!item.width || !item.height) {
    return;
  }

  // generate ids
  const galleryItemId = generateGalleryItemId(galleryId, item.id);
  const itemId = generateItemId(galleryId, item.id);

  // if galleryItem does not already exist
  if (!(galleryItemId in draft.byId)) {
    // add galleryItem
    draft.allIds.push(galleryItemId);
    draft.byId[galleryItemId] = {
      id: galleryItemId,
      itemId,
      galleryId,
    };
  }
};

const galleryItemReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case CLEAR_GALLERY: {
        const { galleryId } = meta;

        // remove gallery items
        const galleryItemsToRemove = draft.allIds.filter(id => state.byId[id].galleryId === galleryId);
        draft.allIds = draft.allIds.filter(id => state.byId[id].galleryId !== galleryId);
        galleryItemsToRemove.forEach(id => delete draft.byId[id]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = meta;
        const gallery = payload;
        const { items } = gallery;

        // add all gallery items
        items.forEach(item => addGalleryItem(draft, galleryId, item));
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default galleryItemReducer;
