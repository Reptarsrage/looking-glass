import produce from 'immer';

import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR } from '../actions/types';
import {
  DEFAULT_GALLERY_ID,
  FILE_SYSTEM_MODULE_ID,
  generateGalleryId,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  handleAsyncSuccess,
  initialAsyncState,
  SEARCH_GALLERY_ID,
} from './constants';

export const initialState = {
  byId: {},
  allIds: [],
  ...initialAsyncState,
};

export const initialModuleState = {
  id: null,
  siteId: null,
  title: null,
  description: null,
  authType: null,
  icon: null,
  defaultGalleryId: null,
  searchGalleryId: null,
};

const addModule = (state, draft, module, actualModuleId) => {
  // generate id
  const moduleId = actualModuleId || generateModuleId(module.id);

  // if module does not exist
  if (!(moduleId in draft.byId)) {
    // add module
    draft.modules.allIds.push(moduleId);
    draft.modules.byId[moduleId] = {
      ...module,
      siteId: module.id,
      id: moduleId,
      defaultGalleryId: generateGalleryId(moduleId, DEFAULT_GALLERY_ID),
      searchGalleryId: generateGalleryId(moduleId, SEARCH_GALLERY_ID),
    };
  }
};

const moduleReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};

    switch (type) {
      case FETCH_MODULES: {
        handleAsyncFetch(state, draft);
        break;
      }
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;
        handleAsyncSuccess(state, draft);
        modules.forEach(module => addModule(state, draft, module));
        addModule(
          state,
          draft,
          {
            ...initialModuleState,
            id: FILE_SYSTEM_MODULE_ID,
            title: 'Local files',
            description: 'Choose a directory',
            authType: '',
          },
          FILE_SYSTEM_MODULE_ID
        );

        break;
      }
      case FETCH_MODULES_ERROR: {
        handleAsyncError(state, draft);
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default moduleReducer;
