import { put, call, takeLatest, all, cancelled } from 'redux-saga/effects';
import axios, { CancelToken } from 'axios';

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

  const source = CancelToken.source();
  try {
    const lookingGlassService = new LookingGlassService(source);
    const { data } = yield call(lookingGlassService.authorize, moduleId, payload);

    yield put({ type: AUTHORIZE_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: AUTHORIZE_ERROR, payload: { ...e }, meta: { moduleId } });
  } finally {
    if (yield cancelled()) {
      yield call(source, source.cancel);
    }
  }
}

function* handleFetchOauthURL(action) {
  const { meta } = action;
  const { moduleId } = meta;

  const source = CancelToken.source();
  try {
    const lookingGlassService = new LookingGlassService(source);
    const { data } = yield call(lookingGlassService.getOauthURL, moduleId);

    yield put({ type: FETCH_OATH_URL_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: FETCH_OATH_URL_ERROR, payload: { ...e }, meta: { moduleId } });
  } finally {
    if (yield cancelled()) {
      yield call(source, source.cancel);
    }
  }
}

function* handleLogin(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  const source = CancelToken.source();
  try {
    const lookingGlassService = new LookingGlassService(source);
    const { data } = yield call(lookingGlassService.login, moduleId, payload);

    yield put({ type: LOGIN_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: LOGIN_ERROR, payload: { ...e }, meta: { moduleId } });
  } finally {
    if (yield cancelled()) {
      yield call(source, source.cancel);
    }
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
