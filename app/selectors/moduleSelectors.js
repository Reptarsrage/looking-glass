import { createSelector } from 'reselect';

const moduleState = state => state.get('module');

const appState = state => state.get('app');

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

const moduleSelector = () =>
  createSelector(
    moduleState,
    appState,
    (module, app) => {
      const modules = module.get('modules');
      const moduleId = app.get('moduleId');
      const idx = modules.findIndex(m => m.get('id') === moduleId);
      const m = modules.get(idx);
      return m;
    }
  );

export { successSelector, fetchingSelector, errorSelector, modulesSelector, moduleSelector };
