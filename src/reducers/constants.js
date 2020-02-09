import uuidv3 from 'uuid/v3';

// async state, and reducer functions
export const initialAsyncState = {
  fetching: false,
  success: false,
  error: null,
};

export const handleAsyncFetch = (state, draft) => {
  draft.fetching = true;
  draft.success = false;
  draft.error = null;
};

export const handleAsyncSuccess = (state, draft) => {
  draft.fetching = false;
  draft.success = true;
  draft.error = null;
};

export const handleAsyncError = (state, draft, error) => {
  draft.fetching = false;
  draft.success = false;
  draft.error = error;
};

// namespace constants
// https://www.guidgenerator.com/
export const MODULE_NAMESPACE = '124f5b23-53e1-4258-9f17-0eaa1b9bf86f';
export const DEFAULT_GALLERY_ID = '8d8ba67e-bbad-4908-9ce2-e55e9add872d';
export const SEARCH_GALLERY_ID = '766e634b-9815-4098-8562-315bb37786ac';
export const FILE_SYSTEM_MODULE_ID = '3d527484-b8d6-4cf8-aab3-8a185e740033';
export const GALLERY_NAMESPACE = '0e20817f-1e71-4afb-b107-e215cc7d29d0';
export const GALLERY_ITEM_NAMESPACE = '2e26db14-58ab-4060-812e-5fae4cc4fd87';
export const MODULE_GALLERY_NAMESPACE = '357757cf-6140-4439-b2ee-08c7f31ecfb4';
export const ITEM_NAMESPACE = '05948023-6791-4837-96f4-ceff6416b3e3';
export const SORT_NAMESPACE = 'fe042171-3af8-4c2e-b215-8c95313a7768';
export const BREADCRUMB_NAMESPACE = '0a082b6d-09d6-475f-95ee-fc307d10ed09';

// id generator functions
export const generateModuleId = moduleId => uuidv3(moduleId, MODULE_NAMESPACE);
export const generateItemId = (galleryId, itemId) => uuidv3(galleryId + itemId, ITEM_NAMESPACE);
export const generateGalleryId = (moduleId, galleryId) => uuidv3(moduleId + galleryId, GALLERY_NAMESPACE);
export const generateModuleGalleryId = (moduleId, galleryId) => uuidv3(moduleId + galleryId, MODULE_GALLERY_NAMESPACE);
export const generateGalleryItemId = (galleryId, itemId) => uuidv3(galleryId + itemId, GALLERY_ITEM_NAMESPACE);
export const generateSortId = (moduleId, sortId) => uuidv3(moduleId + sortId, SORT_NAMESPACE);
export const generateBreadcrumbId = (moduleId, galleryId) => uuidv3(moduleId + galleryId, BREADCRUMB_NAMESPACE);
