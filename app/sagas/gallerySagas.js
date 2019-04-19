import { put, call, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import uuid from 'uuid';

import {
  LOAD_IMAGE_SUCCESS,
  LOAD_IMAGE_ERROR,
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_FAILURE
} from '../actions/types';
import AsyncImageLoader from '../asyncImageLoader';

const replaceUrlWithRandomSizes = url => {
  const myRegexp = /(https?:\/\/via\.placeholder\.com)\/(\d+)\/(\w+)/g;
  const match = myRegexp.exec(url);
  return `${match[1]}/${Math.floor(Math.random() * 2000) + 200}x${Math.floor(
    Math.random() * 2000
  ) + 200}/${match[3]}`;
};

function* handleFetchImage(item) {
  try {
    // Load item
    const loader = new AsyncImageLoader();
    const { width, height } = yield call(loader.loadImageAsync, item.url);

    // Finish
    yield put({
      type: LOAD_IMAGE_SUCCESS,
      payload: { ...item, width, height }
    });
  } catch (error) {
    yield put({ type: LOAD_IMAGE_ERROR, payload: error });
  }
}

function* handlefetchImages() {
  try {
    // Get photos
    let { data } = yield call(
      axios.get,
      'https://jsonplaceholder.typicode.com/photos?_limit=100'
    );

    // Replace ids, randomize dimensions
    data = data.map(item => ({
      ...item,
      id: uuid.v4(),
      url: replaceUrlWithRandomSizes(item.url)
    }));

    // Load all
    yield all(data.map(item => call(handleFetchImage, { ...item })));

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
