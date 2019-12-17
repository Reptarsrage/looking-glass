import reducer, { initialState, initialModuleState } from '../moduleReducer';
import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR } from '../../actions/types';

describe('module reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_MODULES', () => {
    const newState = reducer({ ...initialState }, { type: FETCH_MODULES });
    expect(newState.error).toEqual(null);
    expect(newState.fetching).toEqual(true);
    expect(newState.success).toEqual(false);
  });

  it('should handle FETCH_MODULES_SUCCESS', () => {
    const payload = [...Array(3).keys()].map(id => ({ ...initialModuleState, id }));
    const newState = reducer({ ...initialState }, { type: FETCH_MODULES_SUCCESS, payload });
    expect(newState.error).toEqual(null);
    expect(newState.fetching).toEqual(false);
    expect(newState.success).toEqual(true);
    expect(newState.allIds.length).toEqual(payload.length);
    expect(Object.keys(newState.byId).length).toEqual(payload.length);
  });

  it('should handle FETCH_MODULES_ERROR', () => {
    const error = 'EXPECTED ERROR';
    const newState = reducer({ ...initialState }, { type: FETCH_MODULES_ERROR, payload: error });
    expect(newState.error).toEqual(error);
    expect(newState.fetching).toEqual(false);
    expect(newState.success).toEqual(false);
  });
});
