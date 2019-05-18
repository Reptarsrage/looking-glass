import { put, call, takeLatest, all } from 'redux-saga/effects';
import LookingGlassService from '../services/lookingGlassService';

import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN } from '../actions/types';

function* handleLogin(action) {
  try {
    // Get images
    const { payload } = action;
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.login, payload);

    // Finish
    yield put({ type: LOGIN_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: LOGIN_ERROR, payload: { ...e } });
  }
}

function* watchAuthSagas() {
  yield all([takeLatest(LOGIN, handleLogin)]);
}

export default watchAuthSagas;
