import { put, call, takeLatest, all, select } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_IMAGES, FETCH_IMAGES_SUCCESS, FETCH_IMAGES_ERROR } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { offsetSelector } from '../selectors/gallerySelectors';

function* handlefetchImages(action) {
  const { meta } = action;
  const { moduleId } = meta;

  try {
    // TODO: refresh token if necessary
    const accessToken = yield select(accessTokenSelector(moduleId));
    const offset = yield select(offsetSelector(moduleId));

    // Get photos
    const lookingGlassService = new LookingGlassService();
    const { data } = yield call(lookingGlassService.fetchImages, moduleId, offset, accessToken);

    // Parse results
    data.images = data.images.map(image => ({
      width: image.width,
      height: image.height,
      title: image.title,
      id: image.id,
      url: image.imageURL,
    }));

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
