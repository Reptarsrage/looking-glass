import { fetchGallerySuccess } from 'actions/galleryActions'
import { fetchItemFiltersSuccess, fetchFiltersSuccess } from 'actions/filterActions'
import reducer, { initialState } from '../filterReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

describe('should handle FETCH_FILTERS_SUCCESS', () => {
  it('when given no duplicates', () => {
    // arrange
    const filterSectionId = 'EXPECTED FILTER SECTION ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = expected.map((id) => ({ id }))

    let state = { allIds: [], byId: {} }
    const action = fetchFiltersSuccess(filterSectionId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toEqual(expected)
    expect(Object.keys(state.byId)).toEqual(expected)
  })

  it('when given duplicates', () => {
    // arrange
    const filterSectionId = 'EXPECTED FILTER SECTION ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = [...expected, ...expected].map((id) => ({ id }))

    let state = { allIds: [], byId: {} }
    const action = fetchFiltersSuccess(filterSectionId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toEqual(expected)
    expect(Object.keys(state.byId)).toEqual(expected)
  })
})

it('should handle FETCH_ITEM_FILTERS_SUCCESS', () => {
  // arrange
  const moduleId = 'EXPECTED MODULE ID'
  const itemId = 'EXPECTED ITEM ID'
  const expected = [...Array(3).keys()].map((id) => id.toString())
  const filters = [...expected].map((id) => ({ id }))

  let state = { allIds: [], byId: {} }
  const action = fetchItemFiltersSuccess(moduleId, itemId, filters)

  constants.generateFilterId.mockImplementation((_, id) => id)
  constants.generateFilterSectionId.mockImplementation((_, id) => id)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual(expected)
  expect(Object.keys(state.byId)).toEqual(expected)
})

it('should handle FETCH_GALLERY_SUCCESS', () => {
  // arrange
  const moduleId = 'EXPECTED MODULE ID'
  const galleryId = 'EXPECTED GALLERY ID'
  const expected = [...Array(3).keys()].map((id) => id.toString())
  const gallery = {
    items: [
      {
        filters: [...expected].map((id) => ({ id })),
      },
    ],
  }

  let state = { allIds: [], byId: {} }
  const action = fetchGallerySuccess(moduleId, galleryId, gallery)

  constants.generateFilterId.mockImplementation((_, id) => id)
  constants.generateFilterSectionId.mockImplementation((_, id) => id)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual(expected)
  expect(Object.keys(state.byId)).toEqual(expected)
})
