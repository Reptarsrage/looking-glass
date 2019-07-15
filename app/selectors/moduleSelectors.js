import { createSelector } from 'reselect';

import { moduleIdSelector } from './appSelectors';
import { initialState, initialModuleState } from '../reducers/moduleReducer';

const moduleState = state => state.module || initialState;

const fetchingSelector = createSelector(
  moduleState,
  state => state.fetching
);

const errorSelector = createSelector(
  moduleState,
  state => state.error
);

const successSelector = createSelector(
  moduleState,
  state => state.success
);

const modulesSelector = createSelector(
  moduleState,
  state => state.modules
);

const moduleSelector = createSelector(
  modulesSelector,
  moduleIdSelector,
  (state, moduleId) => state.find(m => m.id === moduleId) || initialModuleState
);

export { successSelector, fetchingSelector, errorSelector, modulesSelector, moduleSelector };
