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
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  handleAsyncSuccess,
  initialAsyncState,
} from './constants'

const electronStore = new Store()

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

export default produce((draft, action, store = electronStore) => {
  const { type, payload, meta } = action || {}
  const moduleId = meta

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      modules
        .filter((module) => Boolean(module.authType))
        .forEach((module) => {
          // generate id
          const id = generateModuleId(module.id)

          // load from persistent store
          draft.byId[id] = initialAuthState // store.get(id, initialAuthState)
          draft.allIds.push(id)
        })

      break
    }
    case LOGIN: {
      handleAsyncFetch(draft.byId[moduleId])
      break
    }
    case REFRESH_SUCCESS:
    case LOGIN_SUCCESS: {
      const { expiresIn, accessToken, refreshToken } = payload
      const expires = moment().add(expiresIn, 'seconds').valueOf()

      draft.byId[moduleId].accessToken = accessToken
      draft.byId[moduleId].refreshToken = refreshToken
      draft.byId[moduleId].expires = expires

      handleAsyncSuccess(draft.byId[moduleId])

      // save to persistent store
      store.set(moduleId, draft.byId[moduleId])

      break
    }
    case REFRESH_FAILURE:
    case LOGIN_FAILURE: {
      handleAsyncError(draft.byId[moduleId], payload)
      break
    }

    // no default
  }
}, initialState)
