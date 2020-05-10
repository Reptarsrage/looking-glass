import { createSelector } from 'reselect';

import { initialState, initialFilterState } from '../reducers/filterReducer';

const getFilterId = (_, props) => props.filterId;

const stateSelector = (state) => state.filter || initialState;

/** All filters */
const filtersSelector = createSelector(stateSelector, (state) => state.allIds);

/** Specific filter */
const filterByIdSelector = createSelector(
  [stateSelector, getFilterId],
  (state, filterId) => state.byId[filterId] || initialFilterState
);

const filterSiteIdSelector = createSelector(filterByIdSelector, (value) => value.siteId || undefined);

export { filtersSelector, filterByIdSelector, filterSiteIdSelector };
