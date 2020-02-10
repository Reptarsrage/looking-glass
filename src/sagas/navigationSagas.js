import { takeLatest, all, put, select } from 'redux-saga/effects';

import {
  NAVIGATE_HOME,
  NAVIGATE_TO_SEARCH,
  NAVIGATE_FROM_SEARCH,
  NAVIGATE_GALLERY,
  NAVIGATE_BACK,
  NAVIGATE_BREADCRUMB,
} from '../actions/types';

import { navigateHome, navigateToBreadcrumb } from '../actions/navigationActions';
import { setCurrentGallery } from '../actions/appActions';
import { addGallery, updateSearch } from '../actions/moduleActions';
import { pushBreadcrumb, popBreadcrumb, clearBreadcrumbs } from '../actions/breadcrumbActions';
import { breadcrumbByIdSelector, breadcrumbsSelector } from '../selectors/breadcrumbSelectors';
import { searchGalleryIdSelector, defaultGalleryIdSelector } from '../selectors/moduleSelectors';
import { galleryIdSelector } from '../selectors/appSelectors';
import { galleryByIdSelector } from '../selectors/gallerySelectors';
import { itemByIdSelector } from '../selectors/itemSelectors';
import { history } from '../store/configureStore';
import { generateGalleryId } from '../reducers/constants';

function* handleNavigateHome() {
  // Clear all breadcrumbs
  yield put(clearBreadcrumbs());

  const galleryId = yield select(galleryIdSelector);

  // Set current gallery to null
  yield put(setCurrentGallery(null, null));

  // Clear search
  if (galleryId) {
    yield put(updateSearch(galleryId, null));
  }

  // Navigate
  history.push('/');
}

function* handleNavigateToSearch(action) {
  const { payload } = action;
  const { moduleId } = payload;

  // Clear breadcrumbs (we do not support nested gallery searches)
  yield put(clearBreadcrumbs());

  // Get search gallery id
  const currentGalleryId = yield select(galleryIdSelector);
  const searchGalleryId = yield select(searchGalleryIdSelector, { moduleId });

  if (currentGalleryId !== searchGalleryId) {
    // Add it as a breadcrumb item
    yield put(pushBreadcrumb(moduleId, searchGalleryId, 'Search Results'));

    // Set it as current gallery
    yield put(setCurrentGallery(moduleId, searchGalleryId));

    // Navigate
    history.push(`/gallery/${moduleId}/${searchGalleryId}`);
  }
}

function* handleNavigateFromSearch(action) {
  const { payload } = action;
  const { moduleId } = payload;

  // Clear breadcrumbs (we do not support nested gallery searches)
  yield put(clearBreadcrumbs());

  // Get default gallery id
  const currentGalleryId = yield select(galleryIdSelector);
  const defaultGalleryId = yield select(defaultGalleryIdSelector, { moduleId });
  const { title } = yield select(galleryByIdSelector, { galleryId: defaultGalleryId });

  if (currentGalleryId !== defaultGalleryId) {
    // Add it as a breadcrumb item
    yield put(pushBreadcrumb(moduleId, defaultGalleryId, title));

    // Set it as current gallery
    yield put(setCurrentGallery(moduleId, defaultGalleryId));

    // Navigate
    history.push(`/gallery/${moduleId}/${defaultGalleryId}`);
  }
}

function* handleNavigateGallery(action) {
  const { payload } = action;
  const { moduleId, title } = payload;
  let { galleryId } = payload;

  // Check if navigating to nested gallery
  const item = yield select(itemByIdSelector, { itemId: galleryId });
  if (item && item.siteId) {
    // If we're navigating to an item that means we're navigating to a nested gallery
    // Ensure gallery exists in state
    yield put(addGallery(moduleId, item.siteId));

    // Update galleryId
    galleryId = generateGalleryId(moduleId, item.siteId);
  }

  // check if navigating to non-existant gallery (file system)
  const requestedGallery = yield select(galleryByIdSelector, { galleryId });
  if (!requestedGallery || !requestedGallery.id) {
    // Ensure gallery exists in state, assume we were given a site id
    yield put(addGallery(moduleId, galleryId));

    // Update galleryId
    galleryId = generateGalleryId(moduleId, galleryId);
  }

  // Gallery exists! Check if we need to navigate
  const currentGalleryId = yield select(galleryIdSelector);
  if (currentGalleryId !== galleryId) {
    // Add it as a breadcrumb item
    yield put(pushBreadcrumb(moduleId, galleryId, title));

    // Set it as current gallery
    yield put(setCurrentGallery(moduleId, galleryId));

    // Navigate
    history.push(`/gallery/${moduleId}/${galleryId}`);
  }
}

function* handleNavigateBack() {
  // Pop the latest
  yield put(popBreadcrumb());

  // Get breadcrumbs
  const breadcrumbs = yield select(breadcrumbsSelector);

  // Are we home?
  if (breadcrumbs.length === 0) {
    yield put(navigateHome());
  } else {
    const breadcrumbId = breadcrumbs[breadcrumbs.length - 1];
    yield put(navigateToBreadcrumb(breadcrumbId));
  }
}

function* handleNavigateBreadcrumb(action) {
  const { payload } = action;
  const { breadcrumbId } = payload;

  // Pop breadcrumbs up until the desired one
  const breadcrumbs = yield select(breadcrumbsSelector);
  const idx = breadcrumbs.indexOf(breadcrumbId);
  let thingsToPop = breadcrumbs.length - idx - 1;
  while (thingsToPop > 0) {
    yield put(popBreadcrumb());
    thingsToPop -= 1;
  }

  // Get breadcrumb
  const currentGalleryId = yield select(galleryIdSelector);
  const breadcrumb = yield select(breadcrumbByIdSelector, { breadcrumbId });
  const { moduleId, galleryId } = breadcrumb;

  if (currentGalleryId !== galleryId) {
    // Set it as current gallery
    yield put(setCurrentGallery(moduleId, galleryId));

    // Navigate
    history.push(`/gallery/${moduleId}/${galleryId}`);
  }
}

function* watchNavigationSagas() {
  yield all([
    takeLatest(NAVIGATE_HOME, handleNavigateHome),
    takeLatest(NAVIGATE_TO_SEARCH, handleNavigateToSearch),
    takeLatest(NAVIGATE_FROM_SEARCH, handleNavigateFromSearch),
    takeLatest(NAVIGATE_GALLERY, handleNavigateGallery),
    takeLatest(NAVIGATE_BACK, handleNavigateBack),
    takeLatest(NAVIGATE_BREADCRUMB, handleNavigateBreadcrumb),
  ]);
}

export default watchNavigationSagas;
