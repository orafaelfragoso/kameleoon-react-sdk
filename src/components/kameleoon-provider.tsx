import { createContext, useEffect, useRef, useState } from 'react'

import { useOnlineStatus } from '@/hooks/use-online-status'
import { KameleoonClient } from '@kameleoon/javascript-sdk'

export interface KameleoonProviderProps {
  children: React.ReactNode
  enabled: boolean
  siteCode: string
}

export const KameleoonContext = createContext<{
  client: KameleoonClient | null
  queueRef: React.MutableRefObject<Record<string, any[]>>
} | null>(null)

export function KameleoonProvider({ children, enabled, siteCode }: KameleoonProviderProps) {
  const [client, setClient] = useState<KameleoonClient | null>(null)
  const isOnline = useOnlineStatus()
  const queueRef = useRef<Record<string, any[]>>({
    trackConversion: [],
    addData: [],
    flush: [],
    setLegalConsent: [],
  })

  useEffect(() => {
    if (enabled) {
      const initClient = async () => {
        const newClient = new KameleoonClient({ siteCode })
        await newClient.initialize()
        setClient(newClient)
      }
      initClient()
    }
  }, [enabled, siteCode])

  useEffect(() => {
    if (client && isOnline) {
      Object.entries(queueRef.current).forEach(([method, queue]) => {
        queue.forEach((args) => (client as any)[method](...args))
      })
      queueRef.current = { trackConversion: [], addData: [], flush: [], setLegalConsent: [] }
    }
  }, [client, isOnline])

  return <KameleoonContext.Provider value={{ client, queueRef }}>{children}</KameleoonContext.Provider>
}
