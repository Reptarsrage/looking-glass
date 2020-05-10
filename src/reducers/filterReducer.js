import produce from 'immer';

import { FETCH_FILTERS_SUCCESS } from '../actions/types';
import { generateFilterId } from './constants';

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialFilterState = {
  id: null,
  siteId: null,
  name: null,
};

const addFilterForSection = (draft, filterSectionId, filter) => {
  // generate moduleId
  const filterId = generateFilterId(filterSectionId, filter.id);

  // add filters
  draft.allIds.push(filterId);
  draft.byId[filterId] = {
    ...initialFilterState,
    ...filter,
    siteId: filter.id,
    id: filterId,
  };
};

const filterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case FETCH_FILTERS_SUCCESS: {
        // add filters for modules
        payload.forEach((filter) => addFilterForSection(draft, meta, filter));
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default filterReducer;
