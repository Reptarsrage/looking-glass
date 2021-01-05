import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'

import { fetchedSelector, fetchingSelector, errorSelector } from 'selectors/authSelectors'
import { login } from 'actions/authActions'
import LoadingIndicator from 'components/LoadingIndicator'

export default function ImplicitAuth() {
  const { moduleId, galleryId } = useParams()
  const dispatch = useDispatch()
  const fetched = useSelector((state) => fetchedSelector(state, { moduleId }))
  const fetching = useSelector((state) => fetchingSelector(state, { moduleId }))
  const error = useSelector((state) => errorSelector(state, { moduleId }))

  useEffect(() => {
    if (!fetching && !fetched) {
      dispatch(login(moduleId, '', ''))
    }
  }, [fetching, fetched, login, moduleId])

  if (fetched && !error) {
    return <Redirect to={`/gallery/${moduleId}/${galleryId}/`} />
  }

  return <LoadingIndicator />
}
