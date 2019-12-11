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
