import { fork, take, call, cancel } from 'redux-saga/effects'

/**
 * like takeLatest, but scopes it to specific ids
 * see: https://github.com/redux-saga/redux-saga/issues/1751
 * @param {*} actionType - Action type to take
 * @param {*} worker - Worker to handle action
 * @param {*} keySelector - Function that takes an action and returns a unique key
 * @param  {...any} args - Any additional args to be passed to the worker. THe action will always be the last argument passed to the worker.
 */
export default function takeLatestPerKey(actionType, worker, keySelector, ...args) {
  return fork(function* helper() {
    const tasks = {}

    while (true) {
      const action = yield take(actionType)
      const key = yield call(keySelector, action)

      if (tasks[key]) {
        yield cancel(tasks[key])
      }

      tasks[key] = yield fork(worker, ...args, action)
    }
  })
}
