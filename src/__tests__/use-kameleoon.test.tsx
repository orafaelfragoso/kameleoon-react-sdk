import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { KameleoonProvider } from '@/components/kameleoon-provider'
import { useKameleoon } from '@/hooks/use-kameleoon'
import { KameleoonClient } from '@kameleoon/javascript-sdk'
import React from 'react'

vi.mock('@kameleoon/javascript-sdk')

describe('useKameleoon', () => {
  let contextValue: any

  beforeEach(() => {
    contextValue = {
      client: new KameleoonClient({ siteCode: 'test-site-code' }),
      queueRef: { current: { trackConversion: [], addData: [], flush: [], setLegalConsent: [] } },
    }
    vi.spyOn(React, 'useContext').mockReturnValue(contextValue)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('throws error if used outside KameleoonProvider', () => {
    renderHook(() => {
      try {
        useKameleoon()
      } catch (error: any) {
        expect(error.message).toBe('useKameleoon must be used within a KameleoonProvider')
      }
    })
  })

  it('returns the expected methods', () => {
    const { result } = renderHook(() => useKameleoon(), {
      wrapper: ({ children }) => (
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          {children}
        </KameleoonProvider>
      ),
    })

    waitFor(() => {
      expect(result.current.isFeatureFlagActive).toBeInstanceOf(Function)
      expect(result.current.getFeatureFlagVariationKey).toBeInstanceOf(Function)
      expect(result.current.getFeatureFlags).toBeInstanceOf(Function)
      expect(result.current.getVisitorFeatureFlags).toBeInstanceOf(Function)
      expect(result.current.getActiveFeatureFlags).toBeInstanceOf(Function)
      expect(result.current.getFeatureFlagVariable).toBeInstanceOf(Function)
      expect(result.current.getFeatureFlagVariables).toBeInstanceOf(Function)
      expect(result.current.getVisitorCode).toBeInstanceOf(Function)
      expect(result.current.addData).toBeInstanceOf(Function)
      expect(result.current.flush).toBeInstanceOf(Function)
      expect(result.current.getRemoteData).toBeInstanceOf(Function)
      expect(result.current.getRemoteVisitorData).toBeInstanceOf(Function)
      expect(result.current.getVisitorWarehouseAudience).toBeInstanceOf(Function)
      expect(result.current.setLegalConsent).toBeInstanceOf(Function)
      expect(result.current.trackConversion).toBeInstanceOf(Function)
      expect(result.current.getEngineTrackingCode).toBeInstanceOf(Function)
      expect(result.current.onEvent).toBeInstanceOf(Function)
    })
  })
})
