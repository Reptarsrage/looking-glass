import { put, call, takeLatest, all, cancelled } from 'redux-saga/effects';
import axios, { CancelToken } from 'axios';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR, FETCH_MODULES } from '../actions/types';

function* handleFetchModules() {
  try {
    const source = CancelToken.source();
    const service = new LookingGlassService(source);
    const { data } = yield call(service.fetchModules);

    yield put({ type: FETCH_MODULES_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: FETCH_MODULES_ERROR, payload: e });
  } finally {
    if (yield cancelled()) {
      yield call(source, source.cancel);
    }
  }
}

function* watchModuleSagas() {
  yield all([takeLatest(FETCH_MODULES, handleFetchModules)]);
}

export default watchModuleSagas;
