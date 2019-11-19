import { put, call, takeLatest, all, select, delay, cancelled } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
import { FETCH_IMAGES, FETCH_IMAGES_SUCCESS, FETCH_IMAGES_ERROR, UPDATE_SEARCH, CLEAR_IMAGES } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { offsetSelector, beforeSelector, afterSelector, searchQuerySelector } from '../selectors/gallerySelectors';
import { refresh } from '../actions/authActions';

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

function* handleFetchImages(action) {
  const { meta } = action;
  const { moduleId, galleryId } = meta;

  try {
    // resolve service
    let service;
    if (moduleId === 'fs') {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    // refresh token (if needed)
    yield put(refresh(moduleId));

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });
    const offset = yield select(offsetSelector);
    const before = yield select(beforeSelector);
    const after = yield select(afterSelector);
    const searchQuery = yield select(searchQuerySelector);
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
    yield put({ type: FETCH_IMAGES_ERROR, payload: e, meta: { moduleId, galleryId } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handleFetchImages), takeLatest(UPDATE_SEARCH, handleUpdateSearch)]);
}

export default watchGallerySagas;
