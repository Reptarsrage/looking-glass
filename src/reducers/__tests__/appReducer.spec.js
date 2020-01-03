import reducer, { initialState } from '../appReducer';
import * as actions from '../../actions/appActions';

describe('app reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle TOGGLE_DARK_THEME', () => {
    const newState = reducer(initialState, actions.toggleDarkTheme());
    expect(newState.darkTheme).toEqual(!initialState.darkTheme);
  });

  it('should handle SET_CURRENT_GALLERY', () => {
    const galleryId = 'EXPECTED GALLERY ID';
    const moduleId = 'EXPECTED MODULE ID';
    const newState = reducer(initialState, actions.setCurrentGallery(moduleId, galleryId));
    expect(newState.currentModuleId).toEqual(moduleId);
    expect(newState.currentGalleryId).toEqual(galleryId);
  });
});
