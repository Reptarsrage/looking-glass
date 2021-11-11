import produce from 'immer'

import { FETCH_MODULES_SUCCESS } from 'actions/types'
import { generateSortId, generateModuleId } from './constants'

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialSortState = {
  id: null,
  siteId: null,
  moduleId: null,
  name: null,
  isDefault: false,
  availableInSearch: false,
  exclusiveToSearch: false,
}

const addSortForModule = (draft, module) => {
  // generate moduleId
  const moduleId = generateModuleId(module.id)

  // add sort values
  module.sort.forEach((sortValue) => {
    const id = generateSortId(moduleId, sortValue.id)
    draft.allIds.push(id)
    draft.byId[id] = {
      ...initialSortState,
      ...sortValue,
      siteId: sortValue.id,
      parentId: sortValue.parentId ? generateSortId(moduleId, sortValue.parentId) : undefined,
      moduleId,
      id,
    }
  })
}

export default produce((draft, action) => {
  const { type, payload } = action || {}

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      // add sort options for modules
      modules.forEach((module) => addSortForModule(draft, module))
      break
    }

    // no default
  }
}, initialState)
