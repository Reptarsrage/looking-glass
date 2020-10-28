import { all, fork } from 'redux-saga/effects'

import watchGallerySagas from './gallerySagas'
import watchAuthSagas from './authSagas'
import watchModuleSagas from './moduleSagas'
import filterSagas from './filterSagas'

export default function* rootSaga() {
  yield all([fork(watchGallerySagas), fork(watchAuthSagas), fork(watchModuleSagas), fork(filterSagas)])
}
