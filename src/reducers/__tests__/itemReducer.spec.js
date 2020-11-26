import { clearGallery, fetchGallerySuccess } from 'actions/galleryActions'
import { fetchItemFilters, fetchItemFiltersSuccess, fetchItemFiltersError } from 'actions/filterActions'
import reducer, { initialState } from '../itemReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle CLEAR_GALLERY', () => {
  // arrange
  const galleryId = 'EXPECTED GALLERY ID'
  const action = clearGallery(galleryId)
  let state = {
    allIds: [0, 1, 2],
    byId: {
      0: { galleryId },
      1: { galleryId: 'NOT EXPECTED' },
      2: { galleryId },
    },
  }

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual([1])
  expect(state.byId).toEqual({ 1: { galleryId: 'NOT EXPECTED' } })
})

it('should handle FETCH_ITEM_FILTERS', () => {
  // arrange
  const moduleId = 'EXPECTED MODULE ID'
  const itemId = 'EXPECTED ITEM ID'
  const action = fetchItemFilters(moduleId, itemId)
  const state = { byId: { [itemId]: 'EXPECTED' } }

  // act
  reducer(state, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalledWith('EXPECTED')
})

it('should handle FETCH_ITEM_FILTERS_FAILURE', () => {
  // arrange
  const moduleId = 'EXPECTED MODULE ID'
  const itemId = 'EXPECTED ITEM ID'
  const action = fetchItemFiltersError(moduleId, itemId, 'EXPECTED ERROR')
  const state = { byId: { [itemId]: 'EXPECTED' } }

  // act
  reducer(state, action)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalledWith('EXPECTED', 'EXPECTED ERROR')
})

describe('should handle FETCH_ITEM_FILTERS_SUCCESS', () => {
  it('when given no duplicates', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const itemId = 'EXPECTED ITEM ID'
    const filters = [...Array(3).keys()].map((id) => ({ id, filterId: 'EXPECTED FILTER SECTION ID' }))
    const action = fetchItemFiltersSuccess(moduleId, itemId, filters)
    let state = { byId: { [itemId]: { filters: [] } } }

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[itemId].filters).toEqual([...Array(3).keys()])
  })

  it('when given duplicates', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const itemId = 'EXPECTED ITEM ID'
    const filters = [0, 1, 2, 1, 2, 0, 0, 0].map((id) => ({ id, filterId: 'EXPECTED FILTER SECTION ID' }))
    const action = fetchItemFiltersSuccess(moduleId, itemId, filters)
    let state = { byId: { [itemId]: { filters: [] } } }

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[itemId].filters).toEqual([...Array(3).keys()])
  })
})

describe('should handle FETCH_GALLERY_SUCCESS', () => {
  it('when given no item filters', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const expectedItemIds = [...Array(3).keys()].map((i) => i.toString())
    const gallery = {
      items: expectedItemIds.map((id) => ({
        id,
        urls: [{ url: 'URL', width: 1, height: 1 }],
        width: 'WIDTH',
        height: 'HEIGHT',
        filters: [],
      })),
    }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = {
      allIds: [],
      byId: {},
    }

    constants.generateItemId.mockImplementation((_, itemId) => itemId)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toEqual(expectedItemIds)
    expect(Object.keys(state.byId)).toEqual(expectedItemIds)
  })

  it('when given bad items', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const expectedItemIds = [...Array(3).keys()].map((i) => i.toString())
    const gallery = {
      items: expectedItemIds.map((id) => ({
        id,
        urls: id === '0' ? undefined : [{ url: 'URL', width: 0, height: 0 }],
        width: id === '1' ? undefined : 'WIDTH',
        height: id === '2' ? undefined : 'HEIGHT',
        filters: [],
      })),
    }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = {
      allIds: [],
      byId: {},
    }

    constants.generateItemId.mockImplementation((_, itemId) => itemId)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toEqual([])
    expect(state.byId).toEqual({})
  })

  it('when given duplicate items', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const expectedItemIds = [...Array(3).keys()].map((i) => i.toString())
    const gallery = {
      items: ['0', '1', '2', '0', '0', '1', '2', '2'].map((id) => ({
        id,
        urls: [{ url: 'URL', width: 1, height: 1 }],
        width: 'WIDTH',
        height: 'HEIGHT',
        filters: [],
      })),
    }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = {
      allIds: [],
      byId: {},
    }

    constants.generateItemId.mockImplementation((_, itemId) => itemId)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toEqual(expectedItemIds)
    expect(Object.keys(state.byId)).toEqual(expectedItemIds)
  })

  it('when given item with filters', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const itemId = 'EXPECTED ITEM ID'
    const gallery = {
      items: [
        {
          id: itemId,
          urls: [{ url: 'URL', width: 1, height: 1 }],
          width: 'WIDTH',
          height: 'HEIGHT',
          filters: [...Array(3).keys()].map((id) => ({ filterId: 'EXPECTED FILTER SECTION ID', id })),
        },
      ],
    }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = {
      allIds: [],
      byId: {},
    }

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)
    constants.generateItemId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toContain(itemId)
    expect(state.byId).toHaveProperty(itemId)
    expect(state.byId[itemId].filters).toEqual([...Array(3).keys()])
  })

  it('when given item with duplicate filters', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID'
    const galleryId = 'EXPECTED GALLERY ID'
    const itemId = 'EXPECTED ITEM ID'
    const gallery = {
      items: [
        {
          id: itemId,
          urls: [{ url: 'URL', width: 1, height: 1 }],
          width: 'WIDTH',
          height: 'HEIGHT',
          filters: [0, 1, 2, 2, 1, 2, 2, 1].map((id) => ({ filterId: 'EXPECTED FILTER SECTION ID', id })),
        },
      ],
    }
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = {
      allIds: [],
      byId: {},
    }

    constants.generateFilterId.mockImplementation((_, id) => id)
    constants.generateFilterSectionId.mockImplementation((_, id) => id)
    constants.generateItemId.mockImplementation((_, id) => id)

    // act
    state = reducer(state, action)

    // assert
    expect(state.allIds).toContain(itemId)
    expect(state.byId).toHaveProperty(itemId)
    expect(state.byId[itemId].filters).toEqual([...Array(3).keys()])
  })
})
