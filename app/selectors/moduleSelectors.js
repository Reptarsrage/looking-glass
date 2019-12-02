import { createSelector } from 'reselect';

import { initialState, initialModuleState } from '../reducers/moduleReducer';

const getModuleId = (state, props) => props.moduleId;

const modulesStateSelector = state => (state.module || initialState).modules;

const modulesSelector = createSelector(
  modulesStateSelector,
  state => state.allIds
);

const moduleByIdSelector = createSelector(
  modulesStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
);

const successSelector = createSelector(
  modulesStateSelector,
  state => state.success
);

const fetchingSelector = createSelector(
  modulesStateSelector,
  state => state.fetching
);

const errorSelector = createSelector(
  modulesStateSelector,
  state => state.error
);

export { modulesSelector, moduleByIdSelector, successSelector, fetchingSelector, errorSelector };
