'use client'

import { useEffect, useState } from 'react'

import { API_BASE_URL } from '@/lib/constants'

export default function PingPage() {
  const [message, setMessage] = useState<string>('')

  const pingServer = async () => {
    const response = await fetch(`${API_BASE_URL}/ping`)

    const ping = await response.json()

    console.log(ping)

    if (ping.success) setMessage(ping.message)
  }

  useEffect(() => {
    pingServer()
  }, [])

  return (
    <div className='min-h-screen'>
      <center className='flex min-h-screen justify-center pt-24'>
        {message ? (
          <p className='text-dark-primary text-lg font-semibold'>{message}</p>
        ) : (
          <p className='text-dark-primary text-lg font-semibold'>
            Not connected
          </p>
        )}
      </center>
    </div>
  )
}
