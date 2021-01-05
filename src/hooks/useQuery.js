import { useLocation } from 'react-router-dom'
import qs from 'querystring'

// a custom hook that builds on useLocation to parse
// the query string for you.
export default function useQuery() {
  const query = qs.parse(useLocation().search.substring(1))

  // ensure some default values
  query.search = query.search || ''
  query.sort = query.sort || ''
  query.filters = (query.filters || '').split(',').filter(Boolean)

  return query
}
