import { createSelector } from 'reselect'

import { generateBreadcrumbId } from 'reducers/constants'
import { gallerySelector, byIdSelector as galleriesByIdSelector } from './gallerySelectors'

export const breadcrumbsSelector = createSelector(
  [gallerySelector, galleriesByIdSelector],
  (currentGallery, galleriesById) => {
    if (!currentGallery || !currentGallery.id) {
      return []
    }

    let gallery = currentGallery
    const breadcrumbs = []
    while (gallery && gallery.id) {
      const { id: galleryId, moduleId, parentId, name } = gallery
      breadcrumbs.unshift({
        id: generateBreadcrumbId(moduleId, galleryId),
        name,
        url: `/gallery/${moduleId}/${galleryId}`,
      })

      gallery = (parentId && galleriesById[parentId]) || null
    }

    return breadcrumbs
  }
)
