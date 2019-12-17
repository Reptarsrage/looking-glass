import { initialState, initialItemState } from '../../reducers/itemReducer';
import { itemsSelector, itemByIdSelector } from '../itemSelectors';

describe('Item Selectors', () => {
  describe('itemsSelector', () => {
    it('should return items', () => {
      // arrange
      const allIds = [...Array(3).keys()].map(id => id.toString());
      const state = { item: { ...initialState, allIds } };
      allIds.forEach(id => {
        state.item.byId[id] = { ...initialItemState, id };
      });

      // act
      const selected = itemsSelector(state);

      // assert
      expect(selected).toEqual(allIds);
    });

    it('should return empty', () => {
      // arrange
      const state = { item: initialState };

      // act
      const selected = itemsSelector(state);

      // assert
      expect(selected).toHaveLength(0);
    });
  });

  describe('itemByIdSelector', () => {
    it('should return item', () => {
      // arrange
      const allIds = [...Array(3).keys()].map(id => id.toString());
      const state = { item: { ...initialState, allIds } };
      const props = { itemId: allIds[1] };
      allIds.forEach(id => {
        state.item.byId[id] = { ...initialItemState, id };
      });

      // act
      const selected = itemByIdSelector(state, props);

      // assert
      expect(selected.id).toEqual('1');
    });

    it('should return initial item state', () => {
      // arrange
      const state = { item: initialState };
      const props = { itemId: 'FAKE MODULE ID' };

      // act
      const selected = itemByIdSelector(state, props);

      // assert
      expect(selected).toEqual(initialItemState);
    });
  });
});
