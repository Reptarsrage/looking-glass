import { put, call, takeLatest, all } from 'redux-saga/effects';
import { stringify } from 'qs';
import axios from 'axios';

import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN } from '../actions/types';

function* handleLogin(action) {
  try {
    // Get images
    const { payload } = action;
    const { data } = yield call(axios.get, `http://localhost:3000/login?${stringify(payload)}`);

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
