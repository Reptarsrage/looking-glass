import { initialState, initialItemState } from '../../reducers/itemReducer';
import { itemsSelector, itemByIdSelector, itemsInGallerySelector } from '../itemSelectors';

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

  describe('itemsInGallerySelector', () => {
    it('should return items', () => {
      // arrange
      const galleryId = 'EXPECTED GALLERY ID';
      const allIds = [...Array(3).keys()].map(id => id.toString());
      const state = { item: { ...initialState, allIds } };
      const props = { galleryId };
      allIds.forEach(id => {
        state.item.byId[id] = { ...initialItemState, id };
      });

      state.item.byId['1'].galleryId = galleryId;
      state.item.byId['2'].galleryId = galleryId;

      // act
      const selected = itemsInGallerySelector(state, props);

      // assert
      expect(selected).toEqual(['1', '2']);
    });

    it('should return empty', () => {
      // arrange
      const galleryId = 'EXPECTED GALLERY ID';
      const state = { item: initialState };
      const props = { galleryId };

      // act
      const selected = itemsInGallerySelector(state, props);

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
