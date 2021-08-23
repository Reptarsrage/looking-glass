import React from 'react'
import PropTypes from 'prop-types'
import ListSubheader from '@material-ui/core/ListSubheader'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSelector } from 'react-redux'

import { filterSectionNameSelector, filterSectionFetchingSelector } from 'selectors/filterSectionSelectors'
import { moduleFilterSectionsSelector } from 'selectors/moduleSelectors'

export default function SectionHeader({ sectionIndex, moduleId }) {
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const header = useSelector((state) => filterSectionNameSelector(state, { filterSectionId }))
  const fetching = useSelector((state) => filterSectionFetchingSelector(state, { filterSectionId }))

  return (
    <ListSubheader
      style={{
        backgroundColor: '#333333',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
      }}
    >
      {header}
      {fetching && <LinearProgress color="primary" />}
    </ListSubheader>
  )
}

SectionHeader.propTypes = {
  sectionIndex: PropTypes.number.isRequired,
  moduleId: PropTypes.string.isRequired,
}
