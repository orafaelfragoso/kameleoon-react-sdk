import { useCallback, useContext, useMemo } from 'react'

import { KameleoonContext } from '@/components/kameleoon-provider'
import { compose } from '@/utils/compose'
import type { KameleoonClient } from '@kameleoon/javascript-sdk'

export function useKameleoon() {
  const context = useContext(KameleoonContext)

  if (!context) {
    throw new Error('useKameleoon must be used within a KameleoonProvider')
  }

  const { client, queueRef } = context

  const composeWithClient = useCallback(
    <T extends (...args: any[]) => any>(methodName: string, queueable = false) =>
      compose<T>(client, queueRef, methodName, queueable),
    [client, queueRef],
  )

  return useMemo(
    () => ({
      isFeatureFlagActive: composeWithClient<KameleoonClient['isFeatureFlagActive']>('isFeatureFlagActive'),
      getFeatureFlagVariationKey:
        composeWithClient<KameleoonClient['getFeatureFlagVariationKey']>('getFeatureFlagVariationKey'),
      getFeatureFlags: composeWithClient<KameleoonClient['getFeatureFlags']>('getFeatureFlags'),
      getVisitorFeatureFlags: composeWithClient<KameleoonClient['getVisitorFeatureFlags']>('getVisitorFeatureFlags'),
      getActiveFeatureFlags: composeWithClient<KameleoonClient['getActiveFeatureFlags']>('getActiveFeatureFlags'),
      getFeatureFlagVariable: composeWithClient<KameleoonClient['getFeatureFlagVariable']>('getFeatureFlagVariable'),
      getFeatureFlagVariables: composeWithClient<KameleoonClient['getFeatureFlagVariables']>('getFeatureFlagVariables'),
      getVisitorCode: composeWithClient<KameleoonClient['getVisitorCode']>('getVisitorCode'),
      addData: composeWithClient<KameleoonClient['addData']>('addData', true),
      flush: composeWithClient<KameleoonClient['flush']>('flush', true),
      getRemoteData: composeWithClient<KameleoonClient['getRemoteData']>('getRemoteData'),
      getRemoteVisitorData: composeWithClient<KameleoonClient['getRemoteVisitorData']>('getRemoteVisitorData'),
      getVisitorWarehouseAudience:
        composeWithClient<KameleoonClient['getVisitorWarehouseAudience']>('getVisitorWarehouseAudience'),
      setLegalConsent: composeWithClient<KameleoonClient['setLegalConsent']>('setLegalConsent', true),
      trackConversion: composeWithClient<KameleoonClient['trackConversion']>('trackConversion', true),
      getEngineTrackingCode: composeWithClient<KameleoonClient['getEngineTrackingCode']>('getEngineTrackingCode'),
      onEvent: composeWithClient<KameleoonClient['onEvent']>('onEvent'),
    }),
    [composeWithClient],
  )
}
