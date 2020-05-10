import { createSelector } from 'reselect';

import { initialState, initialFilterSectionState } from '../reducers/filterSectionReducer';

const getFilterSectionId = (_, props) => props.filterSectionId;

const stateSelector = (state) => state.filterSection || initialState;

/** All filter sections */
const filterSectionsSelector = createSelector(stateSelector, (state) => state.allIds);

/** Specific filter section */
const filterSectionByIdSelector = createSelector(
  [stateSelector, getFilterSectionId],
  (state, filterSectionId) => state.byId[filterSectionId] || initialFilterSectionState
);

export { filterSectionsSelector, filterSectionByIdSelector };
