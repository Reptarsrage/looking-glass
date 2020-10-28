import { createSelector } from 'reselect'

import { initialState } from '../reducers/appReducer'

const appState = (state) => state.app || initialState

export const darkThemeSelector = createSelector(appState, (state) => state.darkTheme)
