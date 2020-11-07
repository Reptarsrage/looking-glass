import produce from 'immer'
import moment from 'moment'
import Store from 'electron-store'

import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN,
  REFRESH_SUCCESS,
  REFRESH_FAILURE,
  FETCH_MODULES_SUCCESS,
} from 'actions/types'
import {
  FILE_SYSTEM_MODULE_ID,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  handleAsyncSuccess,
  initialAsyncState,
} from './constants'

// Allow store to be passed via unit test
let electronStore
const getStore = () => {
  if (!electronStore) {
    electronStore = new Store()
  }

  return electronStore
}

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialAuthState = {
  accessToken: '',
  refreshToken: '',
  expires: 0,
  ...initialAsyncState,
}

export default produce((draft, action, store = getStore()) => {
  const { type, payload, meta } = action || {}
  const moduleId = meta

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      modules.forEach((module) => {
        // generate id
        const id = generateModuleId(module.id)

        // load from persistent store
        draft.byId[id] = store.get(id, initialAuthState)
        draft.allIds.push(id)
      })

      // add file system
      draft.byId[FILE_SYSTEM_MODULE_ID] = initialAuthState
      draft.allIds.push(FILE_SYSTEM_MODULE_ID)

      break
    }
    case LOGIN: {
      handleAsyncFetch(draft.byId[moduleId])
      break
    }
    case REFRESH_SUCCESS:
    case LOGIN_SUCCESS: {
      const { expiresIn } = payload
      const date = moment()
      date.add(expiresIn, 'seconds')

      handleAsyncSuccess(draft.byId[moduleId])
      draft.byId[moduleId] = {
        ...draft.byId[moduleId],
        ...payload,
        expires: date.valueOf(),
      }

      // save to persistent store
      store.set(moduleId, draft.byId[moduleId])
      break
    }
    case REFRESH_FAILURE:
    case LOGIN_FAILURE: {
      handleAsyncError(draft.byId[moduleId], payload)
      break
    }
    default:
      // Nothing to do
      break
  }
}, initialState)
