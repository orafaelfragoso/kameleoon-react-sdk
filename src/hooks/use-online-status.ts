import { useEffect, useState } from 'react'

function getOnlineStatus() {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true
}

export function useOnlineStatus() {
  const [isOnline, setOnline] = useState<boolean>((): boolean => {
    return getOnlineStatus()
  })

  useEffect(() => {
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))

    return () => {
      window.removeEventListener('online', () => setOnline(true))
      window.removeEventListener('offline', () => setOnline(false))
    }
  }, [])

  return isOnline
}
