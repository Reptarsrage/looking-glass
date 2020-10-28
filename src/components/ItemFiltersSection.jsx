import React from 'react'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { withStyles } from '@material-ui/core/styles'

import FilterValue from './FilterValue'
import { itemFiltersSectionSelector } from '../selectors/itemSelectors'

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
})

const ItemFilterSection = ({ filterSection, classes, onClick }) => {
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
  search: null,
}

ItemFilterSection.propTypes = {
  // Required
  // eslint-disable-next-line react/no-unused-prop-types
  itemId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  filterSectionId: PropTypes.string.isRequired,

  // Optional
  // eslint-disable-next-line react/no-unused-prop-types
  search: PropTypes.string,
  onClick: PropTypes.func,

  // Selectors
  filterSection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  filterSection: itemFiltersSectionSelector,
})

export default compose(connect(mapStateToProps), withStyles(styles))(ItemFilterSection)
