import React from 'react'
import PropTypes from 'prop-types'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useSelector } from 'react-redux'

import { filterSectionNameSelector } from 'selectors/filterSectionSelectors'
import { moduleFilterSectionsSelector } from 'selectors/moduleSelectors'

export default function SectionHeader({ sectionIndex, moduleId }) {
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const header = useSelector((state) => filterSectionNameSelector(state, { filterSectionId }))

  return <ListSubheader>{header}</ListSubheader>
}

SectionHeader.propTypes = {
  sectionIndex: PropTypes.number.isRequired,
  moduleId: PropTypes.string.isRequired,
}
