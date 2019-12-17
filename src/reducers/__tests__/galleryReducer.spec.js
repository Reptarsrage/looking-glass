import reducer, { initialState } from '../galleryReducer';

describe('gallery reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });
});
