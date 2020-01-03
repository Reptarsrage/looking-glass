import reducer, { initialState, initialItemState } from '../itemReducer';
import { FETCH_GALLERY_SUCCESS, CLEAR_GALLERY } from '../../actions/types';

describe('item reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_GALLERY_SUCCESS', () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID';
    const payload = {
      items: [...Array(3).keys()].map(id => ({
        ...initialItemState,
        id,
        url: 'URL',
        width: 1,
        height: 1,
      })),
    };

    // act
    const newState = reducer(initialState, { type: FETCH_GALLERY_SUCCESS, payload, meta: galleryId });

    // assert
    expect(newState.allIds).toHaveLength(payload.items.length);
    expect(Object.keys(newState.byId)).toHaveLength(payload.items.length);
  });

  it('should filter out malformed items on FETCH_GALLERY_SUCCESS', () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID';
    const payload = {
      items: [
        { id: '1', width: 1, height: 1 },
        { id: '2', url: 'URL', height: 1 },
        { id: '3', url: 'URL', width: 1 },
      ],
    };

    // act
    const newState = reducer(initialState, { type: FETCH_GALLERY_SUCCESS, payload, meta: galleryId });

    // assert
    expect(newState.allIds).toHaveLength(0);
    expect(Object.keys(newState.byId)).toHaveLength(0);
  });

  it('should handle CLEAR_GALLERY for items with different galleryId', () => {
    // arrange
    const otherGalleryId = 'OTHER EXPECTED GALLERY ID';
    const galleryId = 'EXPECTED GALLERY ID';
    const itemId = 'EXPECTED ITEM ID';
    const oldState = { byId: {}, allIds: [itemId] };
    oldState.byId[itemId] = { ...initialItemState, id: itemId, galleryId: otherGalleryId };

    // act
    const newState = reducer(oldState, { type: CLEAR_GALLERY, meta: galleryId });

    // assert
    expect(newState.allIds).toHaveLength(oldState.allIds.length);
    expect(Object.keys(newState.byId)).toHaveLength(oldState.allIds.length);
  });

  it('should handle CLEAR_GALLERY for items with matching galleryId', () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID';
    const itemId = 'EXPECTED ITEM ID';
    const oldState = { byId: {}, allIds: [itemId] };
    oldState.byId[itemId] = { ...initialItemState, id: itemId, galleryId };

    // act
    const newState = reducer(oldState, { type: CLEAR_GALLERY, meta: galleryId });

    // assert
    expect(newState.allIds).toHaveLength(0);
    expect(Object.keys(newState.byId)).toHaveLength(0);
  });
});
