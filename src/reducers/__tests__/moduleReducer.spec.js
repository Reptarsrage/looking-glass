import { initialSortState } from '../sortReducer';
import reducer, { initialState, initialModuleState } from '../moduleReducer';
import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR } from '../../actions/types';
import { generateModuleId, generateSortId } from '../constants';

const generateTestData = (moduleCount, sortValueCount, nestedValueCount) =>
  [...Array(moduleCount).keys()].map((moduleId) => ({
    id: moduleId.toString(),
    sortBy: [...Array(sortValueCount).keys()].map((sortById) => ({
      ...initialSortState,
      id: `${moduleId}-${sortById}`,
      values: [...Array(nestedValueCount).keys()].map((nestedId) => ({
        ...initialSortState,
        id: `${moduleId}-${sortById}-${nestedId}`,
      })),
    })),
  }));

describe('module reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_MODULES', () => {
    const newState = reducer(initialState, { type: FETCH_MODULES });
    expect(newState.error).toEqual(null);
    expect(newState.fetching).toEqual(true);
    expect(newState.success).toEqual(false);
  });

  it('should handle FETCH_MODULES_SUCCESS', () => {
    const payload = [...Array(3).keys()].map((id) => ({ ...initialModuleState, id: id.toString() }));
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });
    expect(newState.error).toEqual(null);
    expect(newState.fetching).toEqual(false);
    expect(newState.success).toEqual(true);
    expect(newState.allIds.length).toEqual(payload.length + 1);
    expect(Object.keys(newState.byId).length).toEqual(payload.length + 1);
  });

  it('should handle FETCH_MODULES_SUCCESS with sortBy values', () => {
    // arrange
    const moduleCount = 3;
    const sortValueCount = 2;
    const nestedValueCount = 1;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    payload.forEach((module) => {
      // verify module sortBy array
      const moduleId = generateModuleId(module.id);
      expect(newState.byId[moduleId].sortBy).toEqual(
        module.sortBy.map((sortValue) => generateSortId(moduleId, sortValue.id))
      );
    });
  });

  it('should handle FETCH_MODULES_ERROR', () => {
    const error = 'EXPECTED ERROR';
    const newState = reducer(initialState, { type: FETCH_MODULES_ERROR, payload: error });
    expect(newState.error).toEqual(error);
    expect(newState.fetching).toEqual(false);
    expect(newState.success).toEqual(false);
  });
});
