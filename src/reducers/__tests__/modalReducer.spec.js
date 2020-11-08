import { modalOpen, modalClear, modalClose, modalBoundsUpdate, modalSetItem } from 'actions/modalActions'
import reducer, { initialState } from '../modalReducer'

it('should return the initial state', () => {
  expect(reducer(undefined, null)).toEqual(initialState)
})

it('should handle MODAL_OPEN', () => {
  // arrange
  const action = modalOpen()
  let state = { modalOpen: false }

  // act
  state = reducer(state, action)

  // assert
  expect(state.modalOpen).toEqual(true)
})

it('should handle MODAL_BOUNDS_UPDATE', () => {
  // arrange
  const modalBounds = 'EXPECTED MODAL BOUNDS'
  const action = modalBoundsUpdate(modalBounds)
  let state = { modalBounds: null }

  // act
  state = reducer(state, action)

  // assert
  expect(state.modalBounds).toEqual(modalBounds)
})

it('should handle MODAL_CLOSE', () => {
  // arrange
  const action = modalClose()
  let state = { modalOpen: true }

  // act
  state = reducer(state, action)

  // assert
  expect(state.modalOpen).toEqual(false)
})

it('should handle MODAL_CLEAR', () => {
  // arrange
  const action = modalClear()
  let state = { modalItemId: 'NOT EXPECTED', modalBounds: 'NOT EXPECTED' }

  // act
  state = reducer(state, action)

  // assert
  expect(state.modalItemId).toBeNull()
  expect(state.modalBounds).toBeNull()
})

it('should handle MODAL_SET_ITEM', () => {
  // arrange
  const modalItemId = 'EXPECTED MODAL ITEM ID'
  const action = modalSetItem(modalItemId)
  let state = { modalItemId: null }

  // act
  state = reducer(state, action)

  // assert
  expect(state.modalItemId).toEqual(modalItemId)
})
