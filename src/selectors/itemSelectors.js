import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/itemReducer';
import { generateGalleryId } from '../reducers/constants';
import { galleriesStateSelector } from './gallerySelectors';
import { filterSectionByIdSelector } from './filterSectionSelectors';
import { stateSelector as filterStateSelector } from './filterSelectors';

const getItemId = (_, props) => props.itemId;

export const itemsStateSelector = (state) => state.item || initialState;

/** All items */
export const itemsSelector = createSelector(itemsStateSelector, (state) => state.allIds);

/** Specific item */
export const itemByIdSelector = createSelector(
  [itemsStateSelector, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

/** Item dimensions */
export const itemDimensionsSelector = createSelector(itemByIdSelector, (item) => ({
  width: item.width,
  height: item.height,
}));

/** Item gallery URL */
export const itemGalleryUrlSelector = createSelector([itemByIdSelector, galleriesStateSelector], (item, state) => {
  if (!item.isGallery) {
    return null;
  }

  const { galleryId, siteId } = item;
  const { moduleId } = state.byId[galleryId];
  const itemGalleryId = generateGalleryId(moduleId, siteId);
  return `/gallery/${moduleId}/${itemGalleryId}`;
});

/** Item filters are pending */
export const itemFetchingFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetchingFilters);

/** Item filters are fetched */
export const itemFetchedFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetchedFilters);

/** Item filters error */
export const itemFetchFiltersErrorSelector = createSelector(itemByIdSelector, (item) => item.fetchFiltersError);

/** Item filters */
export const itemFiltersSelector = createSelector(itemByIdSelector, (item) => item.filters);

/** Item filters by section */
export const itemFiltersSectionSelector = createSelector(
  [itemByIdSelector, filterStateSelector, filterSectionByIdSelector],
  (item, filterState, filterSection) => {
    const values = item.filters.filter((id) => {
      if (id in filterState.byId) {
        return filterState.byId[id].filterSectionId === filterSection.id;
      }

      console.warn('Filter not found', id);
      return false;
    });

    return {
      ...filterSection,
      values,
    };
  }
);
