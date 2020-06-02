import { createSelector } from 'reselect';

import { initialState, initialFilterState } from '../reducers/filterReducer';

const getFilterId = (_, props) => props.filterId;

const stateSelector = (state) => state.filter || initialState;

/** All filters */
export const filtersSelector = createSelector(stateSelector, (state) => state.allIds);

/** Specific filter */
export const filterByIdSelector = createSelector(
  [stateSelector, getFilterId],
  (state, filterId) => state.byId[filterId] || initialFilterState
);

/** Site Id for a specific filter */
export const filterSiteIdSelector = createSelector(filterByIdSelector, (value) => value.siteId || undefined);
