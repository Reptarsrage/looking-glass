import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';

import LookingGlassService from '../services/lookingGlassService';
import { expiresSelector, refreshTokenSelector } from '../selectors/authSelectors';
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
  REFRESH,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
} from '../actions/types';

function* handleRefresh(action) {
  const { meta } = action;
  const { moduleId } = meta;
  const refreshToken = yield select(refreshTokenSelector, { moduleId });
  const expires = yield select(expiresSelector, { moduleId });

  // does this module even support expiration?
  if (expires <= 0) {
    return;
  }

  const expireDate = moment(expires);
  const currentDate = moment();
  if (currentDate.isSameOrAfter(expireDate)) {
    try {
      const lookingGlassService = new LookingGlassService();
      const { data } = yield call(lookingGlassService.refresh, moduleId, refreshToken);
      yield put({ type: REFRESH_SUCCESS, payload: data, meta: { moduleId } });
    } catch (e) {
      yield put({ type: REFRESH_ERROR, payload: e, meta: { moduleId } });
    }
  }
}

function* handleAuthorize(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.authorize, moduleId, payload);

    yield put({ type: AUTHORIZE_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    yield put({ type: AUTHORIZE_ERROR, payload: e, meta: { moduleId } });
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
    yield put({ type: FETCH_OATH_URL_ERROR, payload: e, meta: { moduleId } });
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
    yield put({ type: LOGIN_ERROR, payload: e, meta: { moduleId } });
  }
}

function* watchAuthSagas() {
  yield all([
    takeLatest(LOGIN, handleLogin),
    takeLatest(FETCH_OATH_URL, handleFetchOauthURL),
    takeLatest(AUTHORIZE, handleAuthorize),
    takeLatest(REFRESH, handleRefresh),
  ]);
}

export default watchAuthSagas;
