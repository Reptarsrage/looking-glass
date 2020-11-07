import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles'

import FilterValue from './FilterValue'
import { itemFiltersSectionSelector } from '../selectors/itemSelectors'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function ItemFilterSection({ itemId, filterSectionId, onClick }) {
  const classes = useStyles()
  const filterSection = useSelector((state) => itemFiltersSectionSelector(state, { itemId, filterSectionId }))

  if (filterSection.values.length === 0) {
    return null
  }

  return (
    <List className={classes.root} subheader={<ListSubheader>{filterSection.name}</ListSubheader>}>
      {filterSection.values.map((filterId) => (
        <FilterValue key={filterId} filterId={filterId} onClick={onClick} />
      ))}
    </List>
  )
}

ItemFilterSection.defaultProps = {
  onClick: () => {},
}

ItemFilterSection.propTypes = {
  // required
  itemId: PropTypes.string.isRequired,
  filterSectionId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
}
