import sinon from 'sinon';
import Store from 'electron-store';

import reducer, { initialState } from '../authReducer';

describe('auth reducer', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return the initial state', () => {
    // arrange
    const storeStub = sinon.createStubInstance(Store, {
      get: sinon.stub().returnsArg(1),
      set: sinon.stub(),
    });

    // act
    const newState = reducer(undefined, {}, storeStub);

    // assert
    expect(newState).toEqual(initialState);
  });
});
