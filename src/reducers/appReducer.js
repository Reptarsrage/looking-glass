import produce from 'immer';

import { TOGGLE_DARK_THEME } from '../actions/types';

export const initialState = {
  darkTheme: true,
};

const authReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type } = action || {};
    switch (type) {
      case TOGGLE_DARK_THEME: {
        draft.darkTheme = !state.darkTheme;
        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
