import { put, call, takeLatest, all } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR, FETCH_MODULES, ADD_MODULE } from '../actions/types';

function* handleFetchModules() {
  try {
    const service = new LookingGlassService();
    const { data } = yield call(service.fetchModules);

    yield put({ type: FETCH_MODULES_SUCCESS, payload: data });
    yield all(data.map(module => put({ type: ADD_MODULE, payload: module })));
  } catch (e) {
    yield put({ type: FETCH_MODULES_ERROR, payload: e });
  }
}

function* watchModuleSagas() {
  yield all([takeLatest(FETCH_MODULES, handleFetchModules)]);
}

export default watchModuleSagas;
