import { put, call, takeLatest, all } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';

import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN,
  FETCH_OATH_URL,
  FETCH_OATH_URL_ERROR,
  FETCH_OATH_URL_SUCCESS,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_ERROR,
} from '../actions/types';

function* handleAuthorize(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.authorize, moduleId, payload);

    yield put({ type: AUTHORIZE_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: AUTHORIZE_ERROR, payload: { ...e }, meta: { moduleId } });
  }
}

function* handleFetchOauthURL(action) {
  const { meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.getOauthURL, moduleId);

    yield put({ type: FETCH_OATH_URL_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: FETCH_OATH_URL_ERROR, payload: { ...e }, meta: { moduleId } });
  }
}

function* handleLogin(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.login, moduleId, payload);

    yield put({ type: LOGIN_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: LOGIN_ERROR, payload: { ...e }, meta: { moduleId } });
  }
}

function* watchAuthSagas() {
  yield all([
    takeLatest(LOGIN, handleLogin),
    takeLatest(FETCH_OATH_URL, handleFetchOauthURL),
    takeLatest(AUTHORIZE, handleAuthorize),
  ]);
}

export default watchAuthSagas;
