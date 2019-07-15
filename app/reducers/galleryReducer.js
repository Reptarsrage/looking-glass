import produce from 'immer';

import {
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
  FETCH_MODULES_SUCCESS,
  LOCATION_CHANGE,
  UPDATE_SEARCH,
  CLEAR_IMAGES,
  CLEAR_SEARCH,
} from '../actions/types';

export const initialState = {};

export const initialGalleryState = {
  images: [],
  offset: 1,
  before: null,
  after: null,
  hasNext: true,
  fetching: false,
  success: false,
  error: null,
  searchQuery: null,
};

const galleryReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};
    let { moduleId, galleryId = 'default' } = meta || {};

    switch (type) {
      case CLEAR_SEARCH: {
        draft[moduleId][galleryId] = {
          ...initialGalleryState,
          fetching: true,
        };
        break;
      }
      case CLEAR_IMAGES: {
        draft[moduleId][galleryId] = {
          ...initialGalleryState,
          fetching: true,
          searchQuery: state[moduleId][galleryId].searchQuery,
        };
        break;
      }
      case UPDATE_SEARCH: {
        draft[moduleId][galleryId].searchQuery = payload;
        break;
      }
      case LOCATION_CHANGE: {
        const { location } = payload;
        const { pathname } = location;
        const parts = pathname.split('/');

        if (parts[1] === 'gallery') {
          [, , moduleId, galleryId] = parts;
          if (
            !Object.prototype.hasOwnProperty.call(state, moduleId) ||
            !Object.prototype.hasOwnProperty.call(state[moduleId], galleryId)
          ) {
            draft[moduleId] = state[moduleId] || {};
            draft[moduleId][galleryId] = initialGalleryState;
          }

          // reset so that we're in a good state even if FECH_IMAGES is cancelled
          draft[moduleId][galleryId].fetching = false;
          draft[moduleId][galleryId].error = null;
          draft[moduleId][galleryId].success = false;
        }

        break;
      }
      case FETCH_MODULES_SUCCESS: {
        for (const { id } of payload) {
          draft[id] = {};
          draft[id][galleryId] = initialGalleryState;
        }

        break;
      }
      case FETCH_IMAGES: {
        draft[moduleId][galleryId].fetching = true;
        draft[moduleId][galleryId].error = null;
        draft[moduleId][galleryId].success = false;

        break;
      }
      case FETCH_IMAGES_SUCCESS: {
        const { offset, images, hasNext, after, before } = payload;

        draft[moduleId][galleryId] = {
          ...state[moduleId][galleryId],
          images: state[moduleId][galleryId].images.concat(images),
          offset,
          hasNext,
          after,
          before,
          fetching: false,
          success: true,
          error: null,
        };

        break;
      }
      case FETCH_IMAGES_ERROR: {
        draft[moduleId][galleryId].fetching = false;
        draft[moduleId][galleryId].error = payload;
        draft[moduleId][galleryId].success = false;

        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default galleryReducer;
