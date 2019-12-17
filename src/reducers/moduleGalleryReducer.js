import produce from 'immer';

import {
  DEFAULT_GALLERY_ID,
  FILE_SYSTEM_MODULE_ID,
  generateGalleryId,
  generateModuleGalleryId,
  generateModuleId,
  SEARCH_GALLERY_ID,
} from './constants';
import { ADD_GALLERY, FETCH_MODULES_SUCCESS } from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

const addModuleGallery = (draft, moduleId, siteId, actualGalleryId = null) => {
  // generate ids
  const moduleGalleryId = generateModuleGalleryId(moduleId, siteId);
  const galleryId = actualGalleryId || generateGalleryId(moduleId, siteId);

  // if moduleGallery does not already exist
  if (!(moduleGalleryId in draft.byId)) {
    // add moduleGallery
    draft.allIds.push(moduleGalleryId);
    draft.byId[moduleGalleryId] = {
      id: moduleGalleryId,
      moduleId,
      galleryId,
    };
  }
};

const moduleGalleryReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};

    switch (type) {
      case ADD_GALLERY: {
        const { moduleId, galleryId, siteId } = payload;

        // add moduleGallery
        addModuleGallery(draft, moduleId, siteId, galleryId);
        break;
      }
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        // Add default module galleries for all modules
        modules.forEach(({ id }) => {
          const moduleId = generateModuleId(id);
          addModuleGallery(draft, moduleId, DEFAULT_GALLERY_ID);
          addModuleGallery(draft, moduleId, SEARCH_GALLERY_ID);
        });

        // Add file system default module galleries
        addModuleGallery(draft, FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID);
        addModuleGallery(draft, FILE_SYSTEM_MODULE_ID, SEARCH_GALLERY_ID);
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default moduleGalleryReducer;
