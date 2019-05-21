import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';

import LookingGlassService from '../services/lookingGlassService';
import {
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
} from '../actions/types';
import { accessTokenSelector, expiresSelector, refreshTokenSelector } from '../selectors/authSelectors';
import { offsetSelector, beforeSelector, afterSelector } from '../selectors/gallerySelectors';

function* handlefetchImages(action) {
  const { meta } = action;
  const { moduleId, galleryId } = meta;

  try {
    let accessToken = yield select(accessTokenSelector(moduleId));
    const refreshToken = yield select(refreshTokenSelector(moduleId));
    const offset = yield select(offsetSelector(moduleId, galleryId));
    const before = yield select(beforeSelector(moduleId, galleryId));
    const after = yield select(afterSelector(moduleId, galleryId));
    const expires = yield select(expiresSelector(moduleId));

    const lookingGlassService = new LookingGlassService();

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
      after
    );

    yield put({ type: FETCH_IMAGES_SUCCESS, payload: data, meta: { moduleId, galleryId } });
  } catch (e) {
    yield put({ type: FETCH_IMAGES_ERROR, payload: { ...e }, meta: { moduleId, galleryId } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handlefetchImages)]);
}

export default watchGallerySagas;
