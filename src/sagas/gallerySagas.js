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
  const { moduleId } = meta;

  try {
    // TODO: refresh token if necessary
    const accessToken = yield select(accessTokenSelector(moduleId));
    const refreshToken = yield select(refreshTokenSelector(moduleId));
    const offset = yield select(offsetSelector(moduleId));
    const before = yield select(beforeSelector(moduleId));
    const after = yield select(afterSelector(moduleId));
    const expires = yield select(expiresSelector(moduleId));

    const lookingGlassService = new LookingGlassService();

    if (expires > 0) {
      const expireDate = moment(expires);
      const currentDate = moment();

      if (currentDate.isSameOrAfter(expireDate)) {
        try {
          const { data } = yield call(lookingGlassService.refresh, moduleId, refreshToken);
          yield put({ type: REFRESH_SUCCESS, payload: data, meta: { moduleId } });
        } catch (error) {
          yield put({ type: REFRESH_ERROR, payload: { ...error }, meta: { moduleId } });
        }
      }
    }

    // Get photos
    console.log(moduleId, accessToken, offset, before, after);
    const { data } = yield call(lookingGlassService.fetchImages, moduleId, accessToken, offset, before, after);

    // Finish
    yield put({ type: FETCH_IMAGES_SUCCESS, payload: data, meta: { moduleId } });
  } catch (e) {
    console.error(e);
    yield put({ type: FETCH_IMAGES_ERROR, payload: { ...e }, meta: { moduleId } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handlefetchImages)]);
}

export default watchGallerySagas;
