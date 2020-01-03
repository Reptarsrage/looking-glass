import reducer, { initialState, initialSortState } from '../sortReducer';
import { FETCH_MODULES_SUCCESS } from '../../actions/types';
import { generateModuleId, generateSortId } from '../constants';

const generateTestData = (moduleCount, sortValueCount, nestedValueCount) =>
  [...Array(moduleCount).keys()].map(moduleId => ({
    id: moduleId.toString(),
    sortBy: [...Array(sortValueCount).keys()].map(sortById => ({
      ...initialSortState,
      id: `${moduleId}-${sortById}`,
      values: [...Array(nestedValueCount).keys()].map(nestedId => ({
        ...initialSortState,
        id: `${moduleId}-${sortById}-${nestedId}`,
      })),
    })),
  }));

describe('sort reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_MODULES_SUCCESS with one module', () => {
    // arrange
    const moduleCount = 1;
    const sortValueCount = 3;
    const nestedValueCount = 0;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    expect(newState.allIds.length).toEqual(sortValueCount);
    expect(Object.keys(newState.byId).length).toEqual(sortValueCount);
  });

  it('should handle FETCH_MODULES_SUCCESS with one module and nested values', () => {
    // arrange
    const moduleCount = 1;
    const sortValueCount = 3;
    const nestedValueCount = 2;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    expect(newState.allIds.length).toEqual(sortValueCount + sortValueCount * nestedValueCount);
    expect(Object.keys(newState.byId).length).toEqual(sortValueCount + sortValueCount * nestedValueCount);
  });

  it('should handle FETCH_MODULES_SUCCESS with multiple modules', () => {
    // arrange
    const moduleCount = 2;
    const sortValueCount = 3;
    const nestedValueCount = 0;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    expect(newState.allIds.length).toEqual(moduleCount * sortValueCount);
    expect(Object.keys(newState.byId).length).toEqual(moduleCount * sortValueCount);
  });

  it('should handle FETCH_MODULES_SUCCESS with multiple modules and nested values', () => {
    // arrange
    const moduleCount = 2;
    const sortValueCount = 3;
    const nestedValueCount = 1;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    expect(newState.allIds.length).toEqual(
      moduleCount * sortValueCount + moduleCount * sortValueCount * nestedValueCount
    );
    expect(Object.keys(newState.byId).length).toEqual(
      moduleCount * sortValueCount + moduleCount * sortValueCount * nestedValueCount
    );
  });

  it('should handle FETCH_MODULES_SUCCESS with correctly generated ids', () => {
    // arrange
    const moduleCount = 2;
    const sortValueCount = 3;
    const nestedValueCount = 1;
    const payload = generateTestData(moduleCount, sortValueCount, nestedValueCount);

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    payload.forEach(module => {
      const moduleId = generateModuleId(module.id);
      module.sortBy.forEach(sortValue => {
        // verify un-nested values
        const sortValueId = generateSortId(moduleId, sortValue.id);
        expect(newState.byId[sortValueId]).toBeDefined();
        expect(newState.byId[sortValueId].values).toEqual(
          sortValue.values.map(nestedValue => generateSortId(moduleId, nestedValue.id))
        );
        sortValue.values.forEach(nestedValue => {
          // verify nested values
          const nestedValueId = generateSortId(moduleId, nestedValue.id);
          expect(newState.byId[nestedValueId]).toBeDefined();
        });
      });
    });
  });
});
