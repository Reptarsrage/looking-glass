import { runSaga } from 'redux-saga'

export async function recordSaga(saga, initialAction, initialState = {}) {
  const dispatched = []

  await runSaga(
    {
      getState: () => initialState,
      dispatch: (action) => dispatched.push(action),
    },
    saga,
    initialAction
  ).done

  return dispatched
}
