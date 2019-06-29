import { put, call, takeLatest, all, select, delay, cancelled } from 'redux-saga/effects';
import axios, { CancelToken } from 'axios';
import moment from 'moment';

import LookingGlassService from '../services/lookingGlassService';
import {
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
  UPDATE_SEARCH,
  CLEAR_IMAGES,
} from '../actions/types';
import { accessTokenSelector, expiresSelector, refreshTokenSelector } from '../selectors/authSelectors';
import { offsetSelector, beforeSelector, afterSelector, searchQuerySelector } from '../selectors/gallerySelectors';

function* handleUpdateSearch(action) {
  const { meta, payload } = action;
  const { moduleId, galleryId } = meta;

  yield delay(500);
  if (yield cancelled()) {
    return;
  }

  yield put({ type: CLEAR_IMAGES, meta: { moduleId, galleryId } });
  yield put({ type: FETCH_IMAGES, meta: { moduleId, galleryId } });
}

function* handlefetchImages(action) {
  const { meta } = action;
  const { moduleId, galleryId } = meta;

  let accessToken = yield select(accessTokenSelector());
  const refreshToken = yield select(refreshTokenSelector());
  const offset = yield select(offsetSelector());
  const before = yield select(beforeSelector());
  const after = yield select(afterSelector());
  const expires = yield select(expiresSelector());
  const searchQuery = yield select(searchQuerySelector());

  const source = CancelToken.source();

  try {
    const lookingGlassService = new LookingGlassService(source);

    if (expires > 0) {
      const expireDate = moment(expires);
      const currentDate = moment();

      if (currentDate.isSameOrAfter(expireDate)) {
        try {
          const { data } = yield call(lookingGlassService.refresh, moduleId, refreshToken);
          ({ accessToken } = data);
          yield put({ type: REFRESH_SUCCESS, payload: data, meta: { moduleId } });
        } catch (error) {
          yield put({ type: REFRESH_ERROR, payload: { ...error }, meta: { moduleId } });
          yield put({ type: FETCH_IMAGES_ERROR, payload: { ...error }, meta: { moduleId, galleryId } });
          return;
        }
      }
    }

    const { data } = yield call(
      lookingGlassService.fetchImages,
      moduleId,
      galleryId,
      accessToken,
      offset,
      before,
      after,
      searchQuery
    );

    yield put({ type: FETCH_IMAGES_SUCCESS, payload: data, meta: { moduleId, galleryId } });
  } catch (e) {
    yield put({ type: FETCH_IMAGES_ERROR, payload: { ...e }, meta: { moduleId, galleryId } });
  } finally {
    if (yield cancelled()) {
      yield call(source, source.cancel);
    }
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handlefetchImages), takeLatest(UPDATE_SEARCH, handleUpdateSearch)]);
}

export default watchGallerySagas;
