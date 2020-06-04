import { createSelector } from 'reselect';

import { initialState, initialSortState } from '../reducers/sortReducer';
import { currentSearchQuerySelector } from './gallerySelectors';
import { moduleByIdSelector } from './moduleSelectors';

const getValueId = (_, props) => props.valueId;

const stateSelector = (state) => state.sort || initialState;

/** All Values */
export const valuesSelector = createSelector(stateSelector, (state) => state.allIds);

/** Specific Value */
export const valueByIdSelector = createSelector(
  [stateSelector, getValueId, currentSearchQuerySelector],
  (state, valueId, searchQuery) => {
    const value = state.byId[valueId] || initialSortState;
    if (!value.values) {
      return value;
    }

    if (searchQuery) {
      return {
        ...value,
        values: value.values.filter((id) => state.byId[id].availableInSearch),
      };
    }

    return {
      ...value,
      values: value.values.filter((id) => !state.byId[id].exclusiveToSearch),
    };
  }
);

/** Translate internal id to siteId */
export const valueSiteIdSelector = createSelector(valueByIdSelector, (value) => value && value.siteId);

/** All values for a given module */
export const moduleValuesSelector = createSelector(
  [moduleByIdSelector, stateSelector, currentSearchQuerySelector],
  (module, sortState, searchQuery) => {
    if (searchQuery) {
      // different sort values when searching
      return module.sortBy.filter((id) => sortState.byId[id].availableInSearch);
    }

    // different sort values when not searching
    return module.sortBy.filter((id) => !sortState.byId[id].exclusiveToSearch);
  }
);

/** Default value */
export const defaultSortValueSelector = createSelector(
  [moduleByIdSelector, stateSelector, currentSearchQuerySelector],
  (module, sortState, searchQuery) => {
    let sortVals = sortState.allIds.filter((id) => sortState.byId[id].moduleId === module.id);
    if (searchQuery) {
      // different default sort value when searching
      sortVals = sortVals.filter((id) => sortState.byId[id].availableInSearch);
    } else {
      sortVals = sortVals.filter((id) => !sortState.byId[id].exclusiveToSearch);
    }

    return sortVals.find((id) => sortState.byId[id].default);
  }
);
