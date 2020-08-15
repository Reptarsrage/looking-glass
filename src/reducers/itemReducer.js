import produce from 'immer';

import { generateItemId, generateFilterId, generateFilterSectionId } from './constants';
import {
  FETCH_ITEM_FILTERS,
  FETCH_ITEM_FILTERS_FAILURE,
  FETCH_GALLERY_SUCCESS,
  CLEAR_GALLERY,
  FETCH_ITEM_FILTERS_SUCCESS,
} from '../actions/types';

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
  filters: [],
  fetchingFilters: false,
  fetchedFilters: false,
  fetchFiltersError: null,
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

  // Translate filters
  const filters = item.filters.map(({ filterId, id }) => generateFilterId(filterId, id));

  // if item does not exist
  if (!(itemId in draft.byId)) {
    // add item
    draft.allIds.push(itemId);
    draft.byId[itemId] = {
      ...item,
      siteId: item.id,
      id: itemId,
      galleryId,
      filters,
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
      case FETCH_ITEM_FILTERS: {
        const { itemId } = meta;
        draft.byId[itemId].fetchingFilters = true;
        draft.byId[itemId].fetchedFilters = false;
        draft.byId[itemId].fetchFiltersError = null;
        break;
      }
      case FETCH_ITEM_FILTERS_FAILURE: {
        const { itemId } = meta;
        draft.byId[itemId].fetchingFilters = false;
        draft.byId[itemId].fetchedFilters = true;
        draft.byId[itemId].fetchFiltersError = payload;
        break;
      }
      case FETCH_ITEM_FILTERS_SUCCESS: {
        const { itemId, moduleId } = meta;
        const filters = payload;

        draft.byId[itemId].fetchingFilters = false;
        draft.byId[itemId].fetchedFilters = true;
        draft.byId[itemId].fetchFiltersError = null;
        draft.byId[itemId].filters = filters.map(({ filterId, id }) => {
          const filterSectionId = generateFilterSectionId(moduleId, filterId);
          return generateFilterId(filterSectionId, id);
        });

        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default itemReducer;
