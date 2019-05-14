import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';

import { FETCH_IMAGES, FETCH_IMAGES_SUCCESS, FETCH_IMAGES_FAILURE } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { offsetSelector } from '../selectors/gallerySelectors';

function* handlefetchImages() {
  try {
    // TODO: refresh token if necessary
    const accessToken = yield select(accessTokenSelector());
    const offset = yield select(offsetSelector());
    const url = `http://localhost:3000/images?${stringify({ offset })}`;
    const config = {
      headers: { 'access-token': accessToken }
    };

    // Get photos
    const { data } = yield call(axios.get, url, config);

    data.images = data.images.map(image => ({
      width: image.width,
      height: image.height,
      title: image.title,
      id: image.id,
      url: `http://localhost:3000/proxy?${stringify({ uri: image.imageURL })}`
    }));

    // Finish
    yield put({ type: FETCH_IMAGES_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: FETCH_IMAGES_FAILURE, payload: { ...e } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_IMAGES, handlefetchImages)]);
}

export default watchGallerySagas;
