import { initialState } from '../../reducers/appReducer';
import { moduleIdSelector, galleryIdSelector, darkThemeSelector } from '../appSelectors';

describe('App Selectors', () => {
  describe('moduleIdSelector', () => {
    it('should return moduleId', () => {
      // arrange
      const currentModuleId = 'EXPECTED MODULE ID';
      const state = { app: { ...initialState, currentModuleId } };

      // act
      const selected = moduleIdSelector(state);

      // assert
      expect(selected).toEqual(currentModuleId);
    });

    it('should default to initialState', () => {
      expect(moduleIdSelector({})).toEqual(initialState.currentModuleId);
    });
  });

  describe('galleryIdSelector', () => {
    it('should return galleryId', () => {
      // arrange
      const currentGalleryId = 'EXPECTED GALLERY ID';
      const state = { app: { ...initialState, currentGalleryId } };

      // act
      const selected = galleryIdSelector(state);

      // assert
      expect(selected).toEqual(currentGalleryId);
    });

    it('should default to initialState', () => {
      expect(galleryIdSelector({})).toEqual(initialState.currentGalleryId);
    });
  });

  describe('darkThemeSelector', () => {
    it('should return darkTheme', () => {
      // arrange
      const darkTheme = true;
      const state = { app: { ...initialState, darkTheme } };

      // act
      const selected = darkThemeSelector(state);

      // assert
      expect(selected).toEqual(true);
    });

    it('should default to initialState', () => {
      expect(darkThemeSelector({})).toEqual(initialState.darkTheme);
    });
  });
});
