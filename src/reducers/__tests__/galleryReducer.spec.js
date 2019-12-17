import reducer, { initialState, initialGalleryState } from '../galleryReducer';
import { initialModuleState } from '../moduleReducer';
import { generateGalleryId } from '../constants';
import {
  ADD_GALLERY,
  FETCH_MODULES_SUCCESS,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  UPDATE_SEARCH,
} from '../../actions/types';

describe('gallery reducer', () => {
  it('should return the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle ADD_GALLERY with explicit galleryId', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID';
    const siteId = 'EXPECTED SITE ID';
    const galleryId = 'EXPECTED GALLERY ID';
    const payload = { moduleId, siteId, galleryId };

    // act
    const newState = reducer(initialState, { type: ADD_GALLERY, payload });

    // assert
    expect(newState.allIds.length).toEqual(1);
    expect(Object.keys(newState.byId).length).toEqual(1);
    expect(newState.byId).toHaveProperty(galleryId);
  });

  it('should handle ADD_GALLERY with implicit galleryId', () => {
    // arrange
    const moduleId = 'EXPECTED MODULE ID';
    const siteId = 'EXPECTED SITE ID';
    const galleryId = generateGalleryId(moduleId, siteId);
    const payload = { moduleId, siteId };

    // act
    const newState = reducer(initialState, { type: ADD_GALLERY, payload });

    // assert
    expect(newState.allIds.length).toEqual(1);
    expect(Object.keys(newState.byId).length).toEqual(1);
    expect(newState.byId).toHaveProperty(galleryId);
  });

  it('should handle FETCH_GALLERY', () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID';
    const oldState = { allIds: [galleryId], byId: {} };
    oldState.byId[galleryId] = { ...initialGalleryState, id: galleryId };

    // act
    const newState = reducer(oldState, { type: FETCH_GALLERY, payload: { galleryId } });

    // assert
    expect(newState.byId[galleryId].error).toEqual(null);
    expect(newState.byId[galleryId].fetching).toEqual(true);
    expect(newState.byId[galleryId].success).toEqual(false);
  });

  it('should handle FETCH_GALLERY_SUCCESS', () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID';
    const oldState = { allIds: [galleryId], byId: {} };
    oldState.byId[galleryId] = { ...initialGalleryState, id: galleryId };
    const payload = {
      ...initialGalleryState,
      id: galleryId,
      offset: 10,
      hasNext: false,
      before: 'BEFORE',
      after: 'AFTER',
    };

    // act
    const newState = reducer(oldState, { type: FETCH_GALLERY_SUCCESS, payload, meta: galleryId });

    // assert
    expect(newState.byId[galleryId].error).toEqual(null);
    expect(newState.byId[galleryId].fetching).toEqual(false);
    expect(newState.byId[galleryId].success).toEqual(true);
  });

  it('should handle FETCH_GALLERY_ERROR', () => {
    // arrange
    const error = 'EXPECTED ERROR';
    const galleryId = 'EXPECTED GALLERY ID';
    const oldState = { allIds: [galleryId], byId: {} };
    oldState.byId[galleryId] = { ...initialGalleryState, id: galleryId };

    // act
    const newState = reducer(oldState, { type: FETCH_GALLERY_ERROR, payload: error, meta: galleryId });

    // assert
    expect(newState.byId[galleryId].error).toEqual(error);
    expect(newState.byId[galleryId].fetching).toEqual(false);
    expect(newState.byId[galleryId].success).toEqual(false);
  });

  it('should handle UPDATE_SEARCH', () => {
    // arrange
    const payload = 'EXPECTED SEARCH QUERY';
    const galleryId = 'EXPECTED GALLERY ID';
    const oldState = { allIds: [galleryId], byId: {} };
    oldState.byId[galleryId] = { ...initialGalleryState, id: galleryId };

    // act
    const newState = reducer(oldState, { type: UPDATE_SEARCH, payload, meta: { galleryId } });

    // assert
    expect(newState.byId[galleryId].searchQuery).toEqual(payload);
  });

  it('should handle FETCH_MODULES_SUCCESS', () => {
    // arrange
    const payload = [...Array(3).keys()].map(id => ({ ...initialModuleState, id: id.toString() }));

    // act
    const newState = reducer(initialState, { type: FETCH_MODULES_SUCCESS, payload });

    // assert
    expect(newState.allIds.length).toEqual((payload.length + 1) * 2);
    expect(Object.keys(newState.byId).length).toEqual((payload.length + 1) * 2);
  });
});
