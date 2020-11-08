import {
  fetchGallerySuccess,
  fetchGalleryFailure,
  fetchGallery,
  updateSearch,
  updateSort,
  updateFilter,
  clearGallery,
  saveScrollPosition,
  setFileSystemDirectory,
} from 'actions/galleryActions'
import { fetchModulesSuccess } from 'actions/moduleActions'
import reducer, { initialState, initialGalleryState } from '../galleryReducer'
import * as constants from '../constants'

jest.mock('../constants')

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle FETCH_GALLERY', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const action = fetchGallery(galleryId)

  // act
  reducer(undefined, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
})

it('should handle FETCH_GALLERY_FAILURE', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const action = fetchGalleryFailure(galleryId, 'ERROR')

  // act
  reducer(undefined, action)

  // assert
  expect(constants.handleAsyncError).toHaveBeenCalled()
})

it('should handle UPDATE_SEARCH', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const searchQuery = 'SEARCH QUERY'
  const action = updateSearch(galleryId, searchQuery)
  let state = { byId: { [galleryId]: {} } }

  // act
  state = reducer(state, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
  expect(state.byId[galleryId].searchQuery).toEqual(searchQuery)
})

it('should handle UPDATE_SORT', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const sortValueId = 'SORT VALUE ID'
  const action = updateSort(galleryId, sortValueId)
  let state = { byId: { [galleryId]: {} } }

  // act
  state = reducer(state, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
  expect(state.byId[galleryId].currentSort).toEqual(sortValueId)
})

it('should handle SAVE_SCROLL_POSITION', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const scrollPosition = 'SCROLL POSITION'
  const action = saveScrollPosition(galleryId, scrollPosition)
  let state = { byId: { [galleryId]: {} } }

  // act
  state = reducer(state, action)

  // assert
  expect(state.byId[galleryId].savedScrollPosition).toEqual(scrollPosition)
})

it('should handle CLEAR_GALLERY', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const action = clearGallery(galleryId)
  let state = { byId: { [galleryId]: {} } }

  // act
  state = reducer(state, action)

  // assert
  expect(state.byId[galleryId].items).toEqual(initialGalleryState.items)
  expect(state.byId[galleryId].offset).toEqual(initialGalleryState.offset)
  expect(state.byId[galleryId].after).toEqual(initialGalleryState.after)
  expect(state.byId[galleryId].hasNext).toEqual(initialGalleryState.hasNext)
  expect(state.byId[galleryId].savedScrollPosition).toEqual(initialGalleryState.savedScrollPosition)
  expect(state.byId[galleryId].fetched).toEqual(initialGalleryState.fetched)
})

it('should handle SET_FILE_SYSTEM_DIRECTORY', () => {
  // arrange
  const directoryPath = 'SOME PATH'
  const galleryId = Buffer.from(directoryPath, 'utf-8').toString('base64')
  const action = setFileSystemDirectory(directoryPath)
  let state = { allIds: [], byId: {} }

  constants.generateGalleryId.mockImplementation((_, id) => id)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toContain(galleryId)
  expect(state.byId).toHaveProperty(galleryId)
})

it('should handle FETCH_MODULES_SUCCESS', () => {
  // arrange
  const expectedLength = 3
  const expectedModuleIds = [...Array(expectedLength).keys()].map((i) => i.toString())
  const expectedModules = expectedModuleIds.map((id) => ({ id }))

  const action = fetchModulesSuccess(expectedModules)
  let state = { allIds: [], byId: {} }

  constants.FILE_SYSTEM_MODULE_ID = 'FILE SYSTEM MODULE ID'
  constants.DEFAULT_GALLERY_ID = 'DEFAULT GALLERY ID'
  constants.generateGalleryId.mockImplementation((moduleId, galleryId) => `${moduleId}/${galleryId}`)
  constants.generateModuleId.mockImplementation((moduleId) => moduleId)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual([
    ...expectedModuleIds.map((id) => `${id}/DEFAULT GALLERY ID`),
    'FILE SYSTEM MODULE ID/DEFAULT GALLERY ID',
  ])
})

it('should not add the same gallery twice', () => {
  // arrange
  const expectedModuleIds = ['1', '1', '1']
  const expectedModules = expectedModuleIds.map((id) => ({ id }))

  const action = fetchModulesSuccess(expectedModules)
  let state = { allIds: [], byId: {} }

  constants.FILE_SYSTEM_MODULE_ID = 'FILE SYSTEM MODULE ID'
  constants.DEFAULT_GALLERY_ID = 'DEFAULT GALLERY ID'
  constants.generateGalleryId.mockImplementation((moduleId, galleryId) => `${moduleId}/${galleryId}`)
  constants.generateModuleId.mockImplementation((moduleId) => moduleId)

  // act
  state = reducer(state, action)

  // assert
  expect(state.allIds).toEqual(['1/DEFAULT GALLERY ID', 'FILE SYSTEM MODULE ID/DEFAULT GALLERY ID'])
})

it('should handle UPDATE_FILTER', () => {
  // arrange
  const galleryId = 'GALLERY ID'
  const filterValueId = 'FILTER VALUE ID'
  const action = updateFilter(galleryId, filterValueId)
  let state = { byId: { [galleryId]: {} } }

  // act
  state = reducer(state, action)

  // assert
  expect(constants.handleAsyncFetch).toHaveBeenCalled()
  expect(state.byId[galleryId].currentFilter).toEqual(filterValueId)
})

describe('should handle FETCH_GALLERY_SUCCESS', () => {
  it('when all items are added and none are galleries', () => {
    // arrange
    const moduleId = 'MODULE ID'
    const galleryId = 'GALLERY ID'
    const gallery = {
      items: [...Array(3).keys()].map((id) => ({
        id,
        width: 'EXPECTED WIDTH',
        height: 'EXPECTED HEIGHT',
        url: 'EXPECTED URL',
      })),
      offset: 'OFFSET',
    }

    constants.generateItemId.mockImplementation((_, id) => id)
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = { byId: { [galleryId]: { moduleId, items: [] } } }

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[galleryId].items).toEqual([...Array(3).keys()])
    expect(state.byId[galleryId].offset).toEqual('OFFSET')
  })

  it('when some items are not added and none are galleries', () => {
    // arrange
    const moduleId = 'MODULE ID'
    const galleryId = 'GALLERY ID'
    const gallery = {
      items: [...Array(4).keys()].map((id) => ({
        id,
        width: id === 0 ? null : 'EXPECTED WIDTH',
        height: id === 1 ? null : 'EXPECTED HEIGHT',
        url: id === 2 ? null : 'EXPECTED URL',
      })),
      offset: 'OFFSET',
    }

    constants.generateItemId.mockImplementation((_, id) => id)
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = { byId: { [galleryId]: { moduleId, items: [] } } }

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.byId[galleryId].items).toEqual([3])
  })

  it('when all items are added and all are galleries', () => {
    // arrange
    const moduleId = 'MODULE ID'
    const galleryId = 'GALLERY ID'
    const gallery = {
      items: [...Array(3).keys()].map((id) => ({
        id,
        width: 'EXPECTED WIDTH',
        height: 'EXPECTED HEIGHT',
        url: 'EXPECTED URL',
        isGallery: true,
      })),
      offset: 'OFFSET',
    }

    constants.generateGalleryId.mockImplementation((_, id) => id)
    constants.generateItemId.mockImplementation((_, id) => id)
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = { allIds: [galleryId], byId: { [galleryId]: { moduleId, items: [] } } }

    // act
    state = reducer(state, action)

    // assert
    expect(constants.handleAsyncSuccess).toHaveBeenCalled()
    expect(state.allIds).toEqual([galleryId, 0, 1, 2])
    expect(state.byId[0].parentId).toEqual(galleryId)
    expect(state.byId[1].parentId).toEqual(galleryId)
    expect(state.byId[2].parentId).toEqual(galleryId)
  })

  it('does not add duplicate items', () => {
    // arrange
    const moduleId = 'MODULE ID'
    const galleryId = 'GALLERY ID'
    const gallery = {
      items: ['1', '1', '1'].map((id) => ({
        id,
        width: 'EXPECTED WIDTH',
        height: 'EXPECTED HEIGHT',
        url: 'EXPECTED URL',
      })),
    }

    constants.generateGalleryId.mockImplementation((_, id) => id)
    constants.generateItemId.mockImplementation((_, id) => id)
    const action = fetchGallerySuccess(moduleId, galleryId, gallery)
    let state = { allIds: [galleryId], byId: { [galleryId]: { moduleId, items: [] } } }

    // act
    state = reducer(state, action)

    // assert
    expect(state.byId[galleryId].items).toEqual(['1'])
  })
})
