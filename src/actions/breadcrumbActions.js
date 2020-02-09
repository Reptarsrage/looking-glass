import { CLEAR_BREADCRUMBS, PUSH_BREADCRUMB, POP_BREADCRUMB } from './types';

// eslint-disable-next-line import/prefer-default-export
export const clearBreadcrumbs = () => ({
  type: CLEAR_BREADCRUMBS,
});

export const popBreadcrumb = () => ({
  type: POP_BREADCRUMB,
});

export const pushBreadcrumb = (moduleId, galleryId, title) => ({
  type: PUSH_BREADCRUMB,
  payload: { moduleId, galleryId, title },
});
