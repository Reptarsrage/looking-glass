import { fetchGallerySuccess } from 'actions/galleryActions'
import { fetchItemFiltersSuccess, fetchFiltersSuccess, fetchFilters, fetchFiltersError } from 'actions/filterActions'
import { fetchModulesSuccess } from 'actions/moduleActions'
import reducer, { initialState } from '../filterSectionReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle FETCH_MODULES_SUCCESS', () => {
  // arrange
  const expected = [...Array(3).keys()].map((id) => id.toString())
  const modules = [
    {
      id: 'MODULE ID',
      filterBy: expected.map((id) => ({ id })),
    },
  ]

  let state = { allIds: [], byId: {} }
  const action = fetchModulesSuccess(modules)

  constants.generateModuleId.mockImplementation((id) => id)
  constants.generateFilterSectionId.mockImplementation((_, id) => id)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual(expected)
  expect(Object.keys(state.byId)).toEqual(expected)
})

it('should handle FETCH_FILTERS', () => {
  // arrange
  const filterSectionId = 'EXPECTED FILTER SECTION ID'
  const action = fetchFilters(filterSectionId)
  const state = { byId: { [filterSectionId]: 'EXPECTED' } }

  // act
  reducer(state, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalledWith('EXPECTED')
})

describe('should handle FETCH_ITEM_FILTERS_SUCCESS', () => {
  it('when given no duplicates', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const filterId = 'EXPECTED FILTER SECTION ID'
    const itemId = 'EXPECTED ITEM ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = [...expected].map((id) => ({ id, filterId }))

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchItemFiltersSuccess(moduleId, itemId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.byId[filterId].values).toEqual(expected)
  })

  it('when given duplicates', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const filterId = 'EXPECTED FILTER SECTION ID'
    const itemId = 'EXPECTED ITEM ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = [...expected, ...expected].map((id) => ({ id, filterId }))

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchItemFiltersSuccess(moduleId, itemId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.byId[filterId].values).toEqual(expected)
  })
})

describe('should handle FETCH_FILTERS_SUCCESS', () => {
  it('when given no duplicates', () => {
    // arrange
    const filterId = 'EXPECTED FILTER SECTION ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = expected.map((id) => ({ id, filterId }))

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchFiltersSuccess(filterId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[filterId].values).toEqual(expected)
  })

  it('when given duplicates', () => {
    const filterId = 'EXPECTED FILTER SECTION ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const filters = [...expected, ...expected].map((id) => ({ id, filterId }))

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchFiltersSuccess(filterId, filters)

    constants.generateFilterId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[filterId].values).toEqual(expected)
  })
})

it('should handle FETCH_FILTERS_FAILURE', () => {
  // arrange
  const filterSectionId = 'EXPECTED FILTER SECTION ID'

  const state = { byId: { [filterSectionId]: 'EXPECTED' } }
  const action = fetchFiltersError(filterSectionId, 'EXPECTED ERROR')

  // act
  reducer(state, action)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalledWith('EXPECTED', 'EXPECTED ERROR')
})

describe('should handle FETCH_GALLERY_SUCCESS', () => {
  it('when given no duplicates', () => {
    // arrange
    const filterId = 'EXPECTED FILTER SECTION ID'
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const gallery = {
      items: [
        {
          filters: [...expected].map((id) => ({ id, filterId })),
        },
      ],
    }

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.byId[filterId].values).toEqual(expected)
  })

  it('when given duplicates', () => {
    // arrange
    const filterId = 'EXPECTED FILTER SECTION ID'
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const expected = [...Array(3).keys()].map((id) => id.toString())
    const gallery = {
      items: [
        {
          filters: [...expected, ...expected].map((id) => ({ id, filterId })),
        },
      ],
    }

    let state = { allIds: [filterId], byId: { [filterId]: { values: [] } } }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.byId[filterId].values).toEqual(expected)
  })
})
