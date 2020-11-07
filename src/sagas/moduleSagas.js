import { put, call, takeEvery } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import { FETCH_MODULES } from 'actions/types'
import { fetchModulesSuccess, fetchModulesFailure } from 'actions/moduleActions'

/**
 * saga to handle fetching modules
 */
export function* handleFetchModules() {
  try {
    // fetch modules
    const { data } = yield call(lookingGlassService.fetchModules)

    // put info into the store
    yield put(fetchModulesSuccess(data))
  } catch (error) {
    // encountered an error
    console.error(error, 'Error fetching modules')
    yield put(fetchModulesFailure(error))
  }
}

export default function* watchModuleSagas() {
  yield takeEvery(FETCH_MODULES, handleFetchModules)
}
