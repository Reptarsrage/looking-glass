import produce from 'immer';

import { FETCH_FILTERS, FETCH_FILTERS_SUCCESS, FETCH_FILTERS_ERROR, FETCH_MODULES_SUCCESS } from '../actions/types';
import {
  generateFilterId,
  generateFilterSectionId,
  generateModuleId,
  initialAsyncState,
  handleAsyncFetch,
  handleAsyncError,
  handleAsyncSuccess,
} from './constants';

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialFilterSectionState = {
  id: null,
  siteId: null,
  name: null,
  description: null,
  values: [],
  ...initialAsyncState,
};

const addFilterSectionForModule = (draft, module) => {
  // generate moduleId
  const moduleId = generateModuleId(module.id);

  // add filter sections
  module.filterBy.forEach((filterSection) => {
    const id = generateFilterSectionId(moduleId, filterSection.id);
    draft.allIds.push(id);
    draft.byId[id] = {
      ...initialFilterSectionState,
      ...filterSection,
      siteId: filterSection.id,
      id,
    };
  });
};

const filterSectionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        // add filter sections for modules
        modules.forEach((module) => addFilterSectionForModule(draft, module));

        // TODO: add file system filter sections
        break;
      }
      case FETCH_FILTERS: {
        const filterSectionId = payload;
        handleAsyncFetch(state.byId[filterSectionId], draft.byId[filterSectionId]);
        break;
      }
      case FETCH_FILTERS_SUCCESS: {
        const filterSectionId = meta;
        handleAsyncSuccess(state.byId[filterSectionId], draft.byId[filterSectionId]);
        draft.byId[filterSectionId].values = payload
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ id }) => generateFilterId(filterSectionId, id));
        break;
      }
      case FETCH_FILTERS_ERROR: {
        const filterSectionId = meta;
        handleAsyncError(state.byId[filterSectionId], draft.byId[filterSectionId], payload);
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default filterSectionReducer;
