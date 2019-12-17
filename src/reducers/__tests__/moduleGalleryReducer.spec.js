import reducer, { initialState } from '../moduleGalleryReducer';

describe('moduleGallery reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });
});
