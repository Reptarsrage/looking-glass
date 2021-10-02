import React from 'react'
import StatusPage from './StatusPage'
import Image from '../assets/undraw_server_down_s4lk.svg'

export default function ServerDown() {
  return (
    <StatusPage message="Unable to connect to server">
      <Image />
    </StatusPage>
  )
}
