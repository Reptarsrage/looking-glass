import produce from 'immer';

import { CLEAR_BREADCRUMBS, POP_BREADCRUMB, PUSH_BREADCRUMB } from '../actions/types';
import { generateBreadcrumbId } from './constants';

export const initialState = {
  byId: {},
  allIds: [],
};

export const inititalBreadcrumbState = {
  id: null,
  moduleId: null,
  galleryId: null,
  title: null,
};

const breadcrumbReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};
    switch (type) {
      case CLEAR_BREADCRUMBS: {
        while (draft.allIds.length > 0) {
          delete draft.byId[draft.allIds.pop()];
        }

        break;
      }
      case PUSH_BREADCRUMB: {
        const { moduleId, galleryId, title } = payload;
        const id = generateBreadcrumbId(moduleId, galleryId);
        draft.allIds.push(id);
        draft.byId[id] = {
          ...inititalBreadcrumbState,
          id,
          moduleId,
          galleryId,
          title,
        };

        break;
      }
      case POP_BREADCRUMB: {
        const popped = draft.allIds.pop();
        delete draft.byId[popped];

        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default breadcrumbReducer;
