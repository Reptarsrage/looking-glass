import React from 'react'
import StatusPage from './StatusPage'
import Image from '../assets/undraw_QA_engineers_dg5p.svg'

export default function Error() {
  return (
    <StatusPage message="Whoops... how did that slip past QA?">
      <Image />
    </StatusPage>
  )
}
