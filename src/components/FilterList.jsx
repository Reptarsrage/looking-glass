import React from 'react'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'

import { filterBySelector } from 'selectors/moduleSelectors'
import FilterSection from './FilterSection'

function FilterList({ filterSections, onClick }) {
  const [search, setSearch] = React.useState('')
  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <>
      <TextField
        label="Search"
        placeholder="Search for filters"
        fullWidth
        margin="normal"
        style={{ margin: 8 }}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
        value={search}
      />

      {filterSections
        .map((filterSectionId) => (
          <FilterSection key={filterSectionId} onClick={onClick} filterSectionId={filterSectionId} search={search} />
        ))
        .reduce((p, c) => [...p, <Divider key={`${c.key}-divider`} />, c], [])}
    </>
  )
}

FilterList.defaultProps = {
  onClick: null,
}

FilterList.propTypes = {
  // Required
  // eslint-disable-next-line react/no-unused-prop-types
  moduleId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,

  // Selectors
  filterSections: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const mapStateToProps = createStructuredSelector({
  filterSections: filterBySelector,
})

export default connect(mapStateToProps)(FilterList)
