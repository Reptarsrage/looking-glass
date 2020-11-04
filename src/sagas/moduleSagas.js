import { put, call, takeLatest } from 'redux-saga/effects'

import lookingGlassService from '../services/lookingGlassService'
import { FETCH_MODULES } from '../actions/types'
import { fetchModulesSuccess, fetchModulesFailure } from '../actions/moduleActions'

/**
 * Saga to handle fetching modules
 */
export function* handleFetchModules() {
  try {
    // Fetch modules
    const { data } = yield call(lookingGlassService.fetchModules)

    // Put info into the store
    yield put(fetchModulesSuccess(data))
  } catch (error) {
    // Encountered an error
    console.error(error, 'Error fetching modules')
    yield put(fetchModulesFailure(error))
  }
}

export default function* watchModuleSagas() {
  yield takeLatest(FETCH_MODULES, handleFetchModules)
}
