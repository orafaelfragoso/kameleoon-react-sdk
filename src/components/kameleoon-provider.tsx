import { KameleoonClient, type SDKParameters } from '@kameleoon/javascript-sdk'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

import { useOnlineStatus } from '@/hooks/use-online-status'

export interface KameleoonProviderProps {
  children: React.ReactNode
  enabled: boolean
  siteCode: string
  config?: Omit<SDKParameters, 'siteCode'>
}

export const KameleoonContext = createContext<{
  client: KameleoonClient | null
  queueRef: React.MutableRefObject<Record<string, any[]>>
} | null>(null)

export function KameleoonProvider({ children, enabled, siteCode, config = {} }: KameleoonProviderProps) {
  const [client, setClient] = useState<KameleoonClient | null>(null)
  const isOnline = useOnlineStatus()
  const parameters = useMemo(() => ({ siteCode, ...config }), [siteCode, config])
  const queueRef = useRef<Record<string, any[]>>({
    trackConversion: [],
    addData: [],
    flush: [],
    setLegalConsent: [],
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (enabled) {
      const initClient = async () => {
        const newClient = new KameleoonClient(parameters)
        await newClient.initialize()
        setClient(newClient)
      }
      initClient()
    }
  }, [enabled])

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
