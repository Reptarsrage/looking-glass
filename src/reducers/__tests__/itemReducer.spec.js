import reducer, { initialState } from '../itemReducer';

describe('item reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });
});
