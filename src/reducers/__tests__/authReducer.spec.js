import moment from 'moment'

import { login, loginSuccess, loginFailure, refreshFailure, refreshSuccess } from 'actions/authActions'
import { fetchModulesSuccess } from 'actions/moduleActions'
import reducer, { initialState } from '../authReducer'
import * as constants from '../constants'

jest.mock('electron-store')
jest.mock('../constants')

const mockStore = {
  get: jest.fn(),
  set: jest.fn(),
}

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle LOGIN', () => {
  // arrange
  const action = login()

  // act
  reducer(undefined, action, mockStore)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
})

it('should handle REFRESH_SUCCESS', () => {
  // arrange
  const moduleId = 'MODULE ID'
  const expiresIn = 360
  const accessToken = 'ACCESS TOKEN'
  const refreshToken = 'REFRESH TOKEN'
  const action = refreshSuccess(moduleId, { expiresIn, accessToken, refreshToken })
  let state = {
    byId: {
      [moduleId]: {},
    },
  }

  // act
  state = reducer(state, action, mockStore)

  // assert
  expect(constants.handleAsyncSuccess).toHaveBeenCalled()
  expect(mockStore.set).toHaveBeenCalled()
  expect(state.byId[moduleId].accessToken).toEqual(accessToken)
  expect(state.byId[moduleId].refreshToken).toEqual(refreshToken)
  expect(-moment().diff(state.byId[moduleId].expires, 'seconds')).toBeGreaterThanOrEqual(0)
  expect(-moment().diff(state.byId[moduleId].expires, 'seconds')).toBeLessThanOrEqual(expiresIn)
})

it('should handle LOGIN_SUCCESS', () => {
  // arrange
  const moduleId = 'MODULE ID'
  const expiresIn = 360
  const accessToken = 'ACCESS TOKEN'
  const refreshToken = 'REFRESH TOKEN'
  const action = loginSuccess(moduleId, { expiresIn, accessToken, refreshToken })
  let state = {
    byId: {
      [moduleId]: {},
    },
  }

  // act
  state = reducer(state, action, mockStore)

  // assert
  expect(constants.handleAsyncSuccess).toHaveBeenCalled()
  expect(mockStore.set).toHaveBeenCalled()
  expect(state.byId[moduleId].accessToken).toEqual(accessToken)
  expect(state.byId[moduleId].refreshToken).toEqual(refreshToken)
  expect(-moment().diff(state.byId[moduleId].expires, 'seconds')).toBeGreaterThanOrEqual(0)
  expect(-moment().diff(state.byId[moduleId].expires, 'seconds')).toBeLessThanOrEqual(expiresIn)
})

it('should handle LOGIN_FAILURE', () => {
  // arrange
  const action = loginFailure('ERROR')

  // act
  reducer(undefined, action, mockStore)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalled()
})

it('should handle REFRESH_FAILURE', () => {
  // arrange
  const action = refreshFailure('ERROR')

  // act
  reducer(undefined, action, mockStore)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalled()
})

it('should handle FETCH_MODULES_SUCCESS when given modules with auth', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleIds = [...Array(expectedLength).keys()].map((i) => i.toString())
  const expectedModules = expectedModuleIds.map((id) => ({
    id,
    authType: `EXPECTED MODULE AUTH TYPE #${id}`,
  }))

  constants.generateModuleId.mockImplementation((id) => id)
  const action = fetchModulesSuccess(expectedModules)

  // act
  const state = reducer(undefined, action, mockStore)

  // assert
  expect(state.allIds).toEqual([...expectedModuleIds])
  expect(Object.keys(state.byId)).toEqual([...expectedModuleIds])
})

it('should handle FETCH_MODULES_SUCCESS when given modules without auth', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleIds = [...Array(expectedLength).keys()].map((i) => i.toString())
  const expectedModules = expectedModuleIds.map((id) => ({
    id,
    authType: null,
  }))

  constants.generateModuleId.mockImplementation((id) => id)
  const action = fetchModulesSuccess(expectedModules)

  // act
  const state = reducer(undefined, action, mockStore)

  // assert
  expect(state.allIds).toEqual([])
  expect(Object.keys(state.byId)).toEqual([])
})
