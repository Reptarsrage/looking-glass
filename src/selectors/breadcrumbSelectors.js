import { createSelector } from 'reselect';

import { galleryByIdSelector, galleriesStateSelector } from './gallerySelectors';
import { generateBreadcrumbId } from '../reducers/constants';

export const breadcrumbsSelector = createSelector(
  [galleryByIdSelector, galleriesStateSelector],
  (currentGallery, state) => {
    if (!currentGallery || !currentGallery.id) {
      return [];
    }

    let gallery = currentGallery;
    const breadcrumbs = [];
    while (gallery && gallery.id) {
      const { id: galleryId, moduleId, parentId, title } = gallery;
      breadcrumbs.unshift({
        id: generateBreadcrumbId(moduleId, galleryId),
        title,
        url: `/gallery/${moduleId}/${galleryId}`,
      });

      gallery = (parentId && state.byId[parentId]) || null;
    }

    return breadcrumbs;
  }
);
