import { initialState, initialSortState } from '../../reducers/sortReducer';
import { valuesSelector, valueByIdSelector } from '../sortSelectors';

describe('Sort Selectors', () => {
  describe('valuesSelector', () => {
    it('should return sort values', () => {
      // arrange
      const allIds = ['1', '2', '3'];
      const state = { sort: { ...initialState, allIds } };

      // act
      const selected = valuesSelector(state);

      // assert
      expect(selected).toEqual(allIds);
    });

    it('should default to initialState', () => {
      expect(valuesSelector({})).toEqual(initialState.allIds);
    });
  });

  describe('valueByIdSelector', () => {
    it('should return sort values', () => {
      // arrange
      const valueId = 'EXPECTED VALUE ID';
      const byId = {};
      byId[valueId] = { ...initialSortState, id: valueId };
      const state = { sort: { ...initialState, byId } };

      // act
      const selected = valueByIdSelector(state, { valueId });

      // assert
      expect(selected.id).toEqual(valueId);
    });

    it('should default to initialState', () => {
      expect(valueByIdSelector({}, { valueId: 'NOT EXPECTED' })).toEqual(initialSortState);
    });
  });
});
