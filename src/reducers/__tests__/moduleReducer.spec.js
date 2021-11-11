import { fetchModules, fetchModulesFailure, fetchModulesSuccess } from 'actions/moduleActions'
import reducer, { initialState } from '../moduleReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle FETCH_MODULES', () => {
  // arrange
  const action = fetchModules()

  // act
  const state = reducer(undefined, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
  expect(state.allIds).toEqual([])
  expect(state.byId).toEqual({})
})

it('should handle FETCH_MODULES_FAILURE', () => {
  // arrange
  const action = fetchModulesFailure('TEST EXCEPTION')

  // act
  reducer(undefined, action)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalled()
})

it('should handle FETCH_MODULES_SUCCESS', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleIds = [...Array(expectedLength).keys()].map((i) => i.toString())
  const expectedModules = expectedModuleIds.map((id) => ({
    id,
    title: `EXPECTED MODULE TITLE #${id}`,
    description: `EXPECTED MODULE DESCRIPTION #${id}`,
    authType: `EXPECTED MODULE AUTH TYPE #${id}`,
    oAuthUrl: `EXPECTED MODULE OAUTH URL #${id}`,
    icon: `EXPECTED MODULE ICON #${id}`,
    supportsItemFilters: true,
  }))

  const action = fetchModulesSuccess(expectedModules)
  constants.generateModuleId.mockImplementation((id) => id)

  // act
  const state = reducer(undefined, action)

  // assert
  expect(constants.handleAsyncSuccess).toHaveBeenCalled()
  expect(state.allIds).toEqual(expectedModuleIds)
  expect(Object.keys(state.byId)).toEqual(expectedModuleIds)
})

it('should handle FETCH_MODULES_SUCCESS with sort values', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleId = 'EXPECTED MODULE ID'
  const expectedSortIds = [...Array(expectedLength).keys()].map((id) => id.toString())
  const expectedModules = [
    {
      id: expectedModuleId,
      sort: expectedSortIds.map((id) => ({ id })),
    },
  ]

  const action = fetchModulesSuccess(expectedModules)
  constants.generateModuleId.mockImplementation((id) => id)
  constants.generateSortId.mockImplementation((_, id) => id)

  // act
  const state = reducer(undefined, action)

  // assert
  expect(state.byId[expectedModuleId].sort).toEqual(expectedSortIds)
})

it('should handle FETCH_MODULES_SUCCESS with filter values', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleId = 'EXPECTED MODULE ID'
  const expectedFilterIds = [...Array(expectedLength).keys()].map((id) => id.toString())
  const expectedModules = [
    {
      id: expectedModuleId,
      filters: expectedFilterIds.map((id) => ({ id })),
    },
  ]

  const action = fetchModulesSuccess(expectedModules)
  constants.generateModuleId.mockImplementation((id) => id)
  constants.generateFilterSectionId.mockImplementation((_, id) => id)

  // act
  const state = reducer(undefined, action)

  // assert
  expect(state.byId[expectedModuleId].filters).toEqual(expectedFilterIds)
})
