import React from 'react'
import PropTypes from 'prop-types'
import ListSubheader from '@material-ui/core/ListSubheader'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'

import { filterSectionNameSelector, filterSectionFetchingSelector } from 'selectors/filterSectionSelectors'
import { moduleFilterSectionsSelector } from 'selectors/moduleSelectors'

const useStyles = makeStyles((theme) => ({
  subHeader: {
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
  },
}))

export default function FilterSectionHeader({ sectionIndex, moduleId }) {
  const classes = useStyles()
  const sections = useSelector((state) => moduleFilterSectionsSelector(state, { moduleId }))
  const filterSectionId = sections[sectionIndex]
  const header = useSelector((state) => filterSectionNameSelector(state, { filterSectionId }))
  const fetching = useSelector((state) => filterSectionFetchingSelector(state, { filterSectionId }))

  return (
    <ListSubheader className={classes.subHeader}>
      {header}
      {fetching && <LinearProgress color="primary" />}
    </ListSubheader>
  )
}

FilterSectionHeader.propTypes = {
  sectionIndex: PropTypes.number.isRequired,
  moduleId: PropTypes.string.isRequired,
}
