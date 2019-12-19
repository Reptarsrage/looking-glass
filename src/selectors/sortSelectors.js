import { createSelector } from 'reselect';

import { initialState, initialSortState } from '../reducers/sortReducer';

const getValueId = (_, props) => props.valueId;

const stateSelector = state => state.sort || initialState;

const valuesSelector = createSelector(stateSelector, state => state.allIds);

const valueByIdSelector = createSelector(
  [stateSelector, getValueId],
  (state, valueId) => state.byId[valueId] || initialSortState
);

export { valuesSelector, valueByIdSelector };
