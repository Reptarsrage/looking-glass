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
  fullText: null,
  values: [],
  default: false,
  availableInSearch: false,
  exclusiveToSearch: false,
}

const addSortForModule = (draft, module) => {
  // generate moduleId
  const moduleId = generateModuleId(module.id)

  // add sort values
  module.sortBy.forEach((sortValue) => {
    // add nested values
    if (sortValue.values) {
      sortValue.values.forEach((nestedSortValue) => {
        const nestedId = generateSortId(moduleId, nestedSortValue.id)
        draft.allIds.push(nestedId)
        draft.byId[nestedId] = {
          ...initialSortState,
          ...nestedSortValue,
          siteId: nestedSortValue.id,
          moduleId,
          id: nestedId,
          fullText: `${sortValue.name} (${nestedSortValue.name})`,
        }
      })
    }

    // add current one
    const id = generateSortId(moduleId, sortValue.id)
    draft.allIds.push(id)
    draft.byId[id] = {
      ...initialSortState,
      ...sortValue,
      values:
        sortValue.values && sortValue.values.map((nestedSortValue) => generateSortId(moduleId, nestedSortValue.id)),
      siteId: sortValue.id,
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

      // tODO: add file system sort options
      break
    }
    default:
      break // nothing to do
  }
}, initialState)
