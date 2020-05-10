import { initialState, initialGalleryState } from '../../reducers/galleryReducer';
import { galleryByIdSelector, galleriesSelector, itemsInGallerySelector } from '../gallerySelectors';

describe('Gallery Selectors', () => {
  describe('galleriesSelector', () => {
    it('should return all galleries', () => {
      // arrange
      const allIds = [...Array(3).keys()].map((id) => id.toString());
      const state = { gallery: { ...initialState, allIds } };
      allIds.forEach((id) => {
        state.gallery.byId[id] = { ...initialGalleryState, id };
      });

      // act
      const selected = galleriesSelector(state);

      // assert
      expect(selected).toEqual(allIds);
    });

    it('should return empty', () => {
      // arrange
      const state = { gallery: initialState };

      // act
      const selected = galleriesSelector(state);

      // assert
      expect(selected).toHaveLength(0);
    });
  });

  describe('galleryByIdSelector', () => {
    it('should return gallery', () => {
      // arrange
      const allIds = [...Array(3).keys()].map((id) => id.toString());
      const state = { gallery: { ...initialState, allIds } };
      const props = { galleryId: allIds[1] };
      allIds.forEach((id) => {
        state.gallery.byId[id] = { ...initialGalleryState, id };
      });

      // act
      const selected = galleryByIdSelector(state, props);

      // assert
      expect(selected.id).toEqual('1');
    });

    it('should return initial gallery state', () => {
      // arrange
      const state = { gallery: initialState };
      const props = { galleryId: 'FAKE GALLERY ID' };

      // act
      const selected = galleryByIdSelector(state, props);

      // assert
      expect(selected).toEqual(initialGalleryState);
    });
  });

  describe('itemsInGallerySelector', () => {
    it('should return items', () => {
      // arrange
      const galleryId = 'EXPECTED GALLERY ID';
      const state = { gallery: { ...initialState, allIds: [galleryId] } };
      const expectedItems = [...Array(3).keys()].map((id) => id.toString());
      state.gallery.byId[galleryId] = {
        ...initialGalleryState,
        id: galleryId,
        items: expectedItems,
      };

      // act
      const selected = itemsInGallerySelector(state, { galleryId });

      // assert
      expect(selected).toEqual(expectedItems);
    });

    it('should return empty', () => {
      // arrange
      const galleryId = 'EXPECTED GALLERY ID';
      const state = { gallery: { ...initialState, allIds: [galleryId] } };
      state.gallery.byId[galleryId] = {
        ...initialGalleryState,
        id: galleryId,
      };

      // act
      const selected = itemsInGallerySelector(state, { galleryId });

      // assert
      expect(selected).toHaveLength(0);
    });
  });
});
