import { fetchModulesSuccess } from 'actions/moduleActions'
import reducer, { initialState } from '../sortReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

describe('should handle FETCH_MODULES_SUCCESS', () => {
  it('when given no nested values', () => {
    // arrange
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const modules = [
      {
        id: 'EXPECTED MODULE ID',
        sort: expected.map((id) => ({ id })),
      },
    ]

    const action = fetchModulesSuccess(modules)

    constants.generateModuleId.mockImplementation((id) => id)
    constants.generateSortId.mockImplementation((_, id) => id)

    // act
    const state = reducer(undefined, action)

    // assert
    expect(state.allIds).toEqual(expected)
    expect(Object.keys(state.byId)).toEqual(expected)
  })

  it('when given nested values', () => {
    // arrange
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const modules = [
      {
        id: 'EXPECTED MODULE ID',
        sort: [
          {
            id: 'EXPECTED PARENT ID',
            values: expected.map((id) => ({ id, name: 'CHILD' })),
            name: 'PARENT',
          },
        ],
      },
    ]

    const action = fetchModulesSuccess(modules)

    constants.generateModuleId.mockImplementation((id) => id)
    constants.generateSortId.mockImplementation((_, id) => id)

    // act
    const state = reducer(undefined, action)

    // assert
    expect(state.allIds).toEqual([...expected, 'EXPECTED PARENT ID'])
    expect(Object.keys(state.byId)).toEqual([...expected, 'EXPECTED PARENT ID'])
  })
})
