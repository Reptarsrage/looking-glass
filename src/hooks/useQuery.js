import { useLocation } from 'react-router-dom'
import qs from 'querystring'
import moize from 'moize'

export const parseQueryString = moize(
  (search) => {
    let queryString = search
    if (queryString[0] === '?') {
      queryString = queryString.substring(1)
    }

    const query = qs.parse(queryString)
    query.search = query.search || ''
    query.sort = query.sort || ''

    if (!Array.isArray(query.filters)) {
      query.filters = (query.filters || '').split(',').filter(Boolean)
    }

    return query
  },
  { maxAge: 1 }
)

// a custom hook that builds on useLocation to parse
// the query string for you.
export default function useQuery() {
  const location = useLocation()
  return parseQueryString(location.search)
}
