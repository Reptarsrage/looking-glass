import { SET_VOLUME } from './types'

export const setVolume = (volume) => ({
  type: SET_VOLUME,
  payload: volume,
})
