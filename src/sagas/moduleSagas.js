import { put, call, takeLatest } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_MODULES } from '../actions/types';
import { fetchModulesSuccess, fetchModulesFailure } from '../actions/moduleActions';

function* handleFetchModules() {
  try {
    const service = new LookingGlassService();
    const { data } = yield call(service.fetchModules);

    yield put(fetchModulesSuccess(data));
  } catch (error) {
    console.error(error, 'Error fetching modules');
    yield put(fetchModulesFailure(error));
  }
}

function* watchModuleSagas() {
  yield takeLatest(FETCH_MODULES, handleFetchModules);
}

export default watchModuleSagas;
