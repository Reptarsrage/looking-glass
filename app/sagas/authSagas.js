import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';

import LookingGlassService from '../services/lookingGlassService';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
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

export function* needsRefresh(moduleId) {
  const expires = yield select(expiresSelector, { moduleId });
  const refreshToken = yield select(refreshTokenSelector, { moduleId });
  if (!refreshToken || expires <= 0) {
    return false; // module does not support refreshing
  }

  const expireDate = moment(expires);
  const currentDate = moment();
  return currentDate.isSameOrAfter(expireDate);
}

function* handleRefresh(action) {
  const { meta } = action;
  const { moduleId } = meta;
  const needToRefresh = yield call(needsRefresh, moduleId);
  if (needToRefresh) {
    try {
      const { siteId } = yield select(moduleByIdSelector, { moduleId });
      const refreshToken = yield select(refreshTokenSelector, { moduleId });
      const lookingGlassService = new LookingGlassService();
      const { data } = yield call(lookingGlassService.refresh, siteId, refreshToken);
      yield put({ type: REFRESH_SUCCESS, payload: data, meta: { moduleId } });
    } catch (e) {
      console.error(e, 'Error refreshing authentication token');
      yield put({ type: REFRESH_ERROR, payload: e, meta: { moduleId } });
    }
  }
}

function* handleAuthorize(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { siteId } = yield select(moduleByIdSelector, { moduleId });
    const { data } = yield call(lookingGlassService.authorize, siteId, payload);

    yield put({ type: AUTHORIZE_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    console.error(e, 'Error retrieving authentication token');
    yield put({ type: AUTHORIZE_ERROR, payload: e, meta: { moduleId } });
  }
}

function* handleFetchOauthURL(action) {
  const { meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { siteId } = yield select(moduleByIdSelector, { moduleId });
    const { data } = yield call(lookingGlassService.getOauthURL, siteId);

    yield put({ type: FETCH_OATH_URL_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    console.error(e, 'Error fetching OAuth info');
    yield put({ type: FETCH_OATH_URL_ERROR, payload: e, meta: { moduleId } });
  }
}

function* handleLogin(action) {
  const { payload, meta } = action;
  const { moduleId } = meta;

  try {
    const lookingGlassService = new LookingGlassService();
    const { siteId } = yield select(moduleByIdSelector, { moduleId });
    const { data } = yield call(lookingGlassService.login, siteId, payload);

    yield put({ type: LOGIN_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    console.error(e, 'Error logging in');
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
