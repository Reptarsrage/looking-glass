import { v3 } from 'uuid'

// async state, and reducer functions
export const initialAsyncState = {
  fetching: false,
  fetched: false,
  error: null,
}

export const handleAsyncFetch = (draft) => {
  draft.fetching = true
  draft.error = null
}

export const handleAsyncSuccess = (draft) => {
  draft.fetching = false
  draft.fetched = true
  draft.error = null
}

export const handleAsyncError = (draft, error) => {
  draft.fetching = false
  draft.fetched = true
  draft.error = error
}

// namespace constants
// https://www.guidgenerator.com/
export const MODULE_NAMESPACE = '124f5b23-53e1-4258-9f17-0eaa1b9bf86f'
export const DEFAULT_GALLERY_ID = '8d8ba67e-bbad-4908-9ce2-e55e9add872d'
export const FILE_SYSTEM_MODULE_ID = '3d527484-b8d6-4cf8-aab3-8a185e740033'
export const GALLERY_NAMESPACE = '0e20817f-1e71-4afb-b107-e215cc7d29d0'
export const GALLERY_ITEM_NAMESPACE = '2e26db14-58ab-4060-812e-5fae4cc4fd87'
export const MODULE_GALLERY_NAMESPACE = '357757cf-6140-4439-b2ee-08c7f31ecfb4'
export const ITEM_NAMESPACE = '05948023-6791-4837-96f4-ceff6416b3e3'
export const SORT_NAMESPACE = 'fe042171-3af8-4c2e-b215-8c95313a7768'
export const BREADCRUMB_NAMESPACE = '0a082b6d-09d6-475f-95ee-fc307d10ed09'
export const FILTER_SECTION_NAMESPACE = '86803187-aa7e-4209-bb30-907c404402c5'
export const FILTER_NAMESPACE = '4d33d42f-49b3-4ec9-865d-a14c6ab8ad2b'

// id generator functions
export const generateModuleId = (moduleId) => v3(moduleId, MODULE_NAMESPACE)
export const generateItemId = (galleryId, itemId) => v3(galleryId + itemId, ITEM_NAMESPACE)
export const generateGalleryId = (moduleId, galleryId) => v3(moduleId + galleryId, GALLERY_NAMESPACE)
export const generateModuleGalleryId = (moduleId, galleryId) => v3(moduleId + galleryId, MODULE_GALLERY_NAMESPACE)
export const generateGalleryItemId = (galleryId, itemId) => v3(galleryId + itemId, GALLERY_ITEM_NAMESPACE)
export const generateSortId = (moduleId, sortId) => v3(moduleId + sortId, SORT_NAMESPACE)
export const generateBreadcrumbId = (moduleId, galleryId) => v3(moduleId + galleryId, BREADCRUMB_NAMESPACE)
export const generateFilterSectionId = (moduleId, filterSectionId) =>
  v3(moduleId + filterSectionId, FILTER_SECTION_NAMESPACE)
export const generateFilterId = (filterSectionId, filterId) => v3(filterSectionId + filterId, FILTER_NAMESPACE)
