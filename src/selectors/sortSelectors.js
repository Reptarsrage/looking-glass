import { createSelector } from 'reselect';

import { initialState, initialSortState } from '../reducers/sortReducer';
import { currentSortSelector } from './gallerySelectors';
import { moduleByIdSelector, searchQuerySelector } from './moduleSelectors';

const getValueId = (_, props) => props.valueId;

const stateSelector = (state) => state.sort || initialState;

/** All Values */
const valuesSelector = createSelector(stateSelector, (state) => state.allIds);

/** Specific Value */
const valueByIdSelector = createSelector(
  [stateSelector, getValueId, searchQuerySelector],
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
const valueSiteIdSelector = createSelector(valueByIdSelector, (value) => value && value.siteId);

/** All values for a given module */
const moduleValuesSelector = createSelector(
  [moduleByIdSelector, stateSelector, searchQuerySelector],
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
const defaultSortValueSelector = createSelector(
  [moduleByIdSelector, stateSelector, searchQuerySelector],
  (module, sortState, searchQuery) => {
    if (searchQuery) {
      // different default sort value when searching
      return module.sortBy.filter((id) => sortState.byId[id].availableInSearch && sortState.byId[id].default)[0];
    }

    // different default sort value when not searching
    return module.sortBy.filter((id) => !sortState.byId[id].exclusiveToSearch && sortState.byId[id].default)[0];
  }
);

const currentSortTextSelector = createSelector(
  [currentSortSelector, defaultSortValueSelector, stateSelector],
  (currentSort, defaultSort, state) => {
    const valueId = currentSort || defaultSort;
    if (valueId) {
      return state.byId[valueId].fullText || state.byId[valueId].name;
    }

    return null;
  }
);

export {
  stateSelector,
  valuesSelector,
  valueByIdSelector,
  valueSiteIdSelector,
  moduleValuesSelector,
  defaultSortValueSelector,
  currentSortTextSelector,
};
