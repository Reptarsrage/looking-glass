import { createSelector } from 'reselect';

const moduleState = state => state.get('module');

const fetchingSelector = () =>
  createSelector(
    moduleState,
    state => state.get('fetching')
  );

const errorSelector = () =>
  createSelector(
    moduleState,
    state => state.get('error')
  );

const successSelector = () =>
  createSelector(
    moduleState,
    state => state.get('success')
  );

const modulesSelector = () =>
  createSelector(
    moduleState,
    state => state.get('modules')
  );

export { successSelector, fetchingSelector, errorSelector, modulesSelector };
