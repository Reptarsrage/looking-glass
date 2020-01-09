import produce from 'immer';

import { UPDATE_BREADCRUMB } from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

// TODO: Determine breadcrumb text
const breadcrumbReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};
    switch (type) {
      case UPDATE_BREADCRUMB: {
        const { id } = payload;
        if (id in state.byId) {
          while (draft.allIds.length > 0 && draft.allIds[draft.allIds.length - 1] !== id) {
            const popped = draft.allIds.pop();
            delete draft.byId[popped];
          }
        } else {
          draft.allIds.push(id);
          draft.byId[id] = payload;
        }

        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default breadcrumbReducer;
