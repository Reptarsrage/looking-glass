import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'

import { filterBySelector } from 'selectors/moduleSelectors'
import FilterSection from './FilterSection'

function FilterList({ moduleId, onClick }) {
  const filterSections = useSelector((state) => filterBySelector(state, { moduleId }))
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
  onClick: () => {},
}

FilterList.propTypes = {
  // Required
  moduleId: PropTypes.string.isRequired,

  // optional
  onClick: PropTypes.func,
}
