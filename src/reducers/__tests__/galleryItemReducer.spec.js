import reducer, { initialState } from '../galleryItemReducer';

describe('galleryItem reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });
});
