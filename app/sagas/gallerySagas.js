import { put, call, takeLatest, all, select, delay, cancelled } from 'redux-saga/effects';
import moment from 'moment';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
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

const fsService = new FileSystemService();

function* handleUpdateSearch(action) {
  const { meta } = action;
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

  let accessToken = yield select(accessTokenSelector);
  const refreshToken = yield select(refreshTokenSelector);
  const offset = yield select(offsetSelector);
  const before = yield select(beforeSelector);
  const after = yield select(afterSelector);
  const expires = yield select(expiresSelector);
  const searchQuery = yield select(searchQuerySelector);

  try {
    let service;
    if (moduleId === 'fs') {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    if (expires > 0) {
      const expireDate = moment(expires);
      const currentDate = moment();

      if (currentDate.isSameOrAfter(expireDate)) {
        try {
          const { data } = yield call(service.refresh, moduleId, refreshToken);
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
      service.fetchImages,
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
    console.error(e, 'Error fetching images');
    yield put({ type: FETCH_IMAGES_ERROR, payload: { ...e }, meta: { moduleId, galleryId } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handlefetchImages), takeLatest(UPDATE_SEARCH, handleUpdateSearch)]);
}

export default watchGallerySagas;
