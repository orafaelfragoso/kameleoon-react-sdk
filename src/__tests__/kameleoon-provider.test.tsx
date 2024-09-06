import { KameleoonContext, KameleoonProvider } from '@/components/kameleoon-provider'
import { act, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { KameleoonClient } from '@kameleoon/javascript-sdk'
import React from 'react'

vi.mock('@kameleoon/javascript-sdk')

describe('KameleoonProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders children', () => {
    const { getByText } = render(
      <KameleoonProvider enabled={true} siteCode="test-site-code">
        <div>Test Child</div>
      </KameleoonProvider>,
    )

    waitFor(() => {
      expect(getByText('Test Child')).toBeInTheDocument()
    })
  })

  it('initializes client when enabled is true', async () => {
    const initializeSpy = vi.spyOn(KameleoonClient.prototype, 'initialize')

    const TestComponent = () => {
      const context = React.useContext(KameleoonContext)
      return <div>{context?.client ? 'Client Initialized' : 'No Client'}</div>
    }

    const { getByText } = render(
      <KameleoonProvider enabled={true} siteCode="test-site-code">
        <TestComponent />
      </KameleoonProvider>,
    )

    await waitFor(() => {
      expect(getByText('Client Initialized')).toBeInTheDocument()
    })

    expect(KameleoonClient).toHaveBeenCalledWith({ siteCode: 'test-site-code' })
    expect(initializeSpy).toHaveBeenCalled()
  })

  it('does not initialize client when enabled is false', () => {
    const TestComponent = () => {
      const context = React.useContext(KameleoonContext)
      return <div>{context?.client ? 'Client Initialized' : 'No Client'}</div>
    }

    const { getByText } = render(
      <KameleoonProvider enabled={false} siteCode="test-site-code">
        <TestComponent />
      </KameleoonProvider>,
    )

    expect(getByText('No Client')).toBeInTheDocument()
    expect(KameleoonClient).not.toHaveBeenCalled()
  })

  it('processes queued actions after client initialization', async () => {
    const trackConversionSpy = vi.spyOn(KameleoonClient.prototype, 'trackConversion')
    const addDataSpy = vi.spyOn(KameleoonClient.prototype, 'addData')
    const flushSpy = vi.spyOn(KameleoonClient.prototype, 'flush')
    const setLegalConsentSpy = vi.spyOn(KameleoonClient.prototype, 'setLegalConsent')

    const TestComponent = () => {
      const context = React.useContext(KameleoonContext)
      context?.queueRef.current.trackConversion.push(['conversion1'])
      context?.queueRef.current.addData.push(['data1'])
      context?.queueRef.current.flush.push(['flush1'])
      context?.queueRef.current.setLegalConsent.push(['consent1'])
      return null
    }

    await act(async () => {
      render(
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          <TestComponent />
        </KameleoonProvider>,
      )
    })

    await waitFor(() => {
      expect(trackConversionSpy).toHaveBeenCalledWith('conversion1')
      expect(addDataSpy).toHaveBeenCalledWith('data1')
      expect(flushSpy).toHaveBeenCalledWith('flush1')
      expect(setLegalConsentSpy).toHaveBeenCalledWith('consent1')
    })
  })

  it('clears the queue after processing', async () => {
    const trackConversionSpy = vi.spyOn(KameleoonClient.prototype, 'trackConversion')

    let contextValue: any = null
    const TestComponent = () => {
      contextValue = React.useContext(KameleoonContext)
      contextValue?.queueRef.current.trackConversion.push(['conversion1'])

      return null
    }

    await act(async () => {
      render(
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          <TestComponent />
        </KameleoonProvider>,
      )
    })

    waitFor(() => {
      expect(trackConversionSpy).toHaveBeenCalledWith('conversion1')
      expect(contextValue.queueRef.current).toEqual({
        trackConversion: [],
        addData: [],
        flush: [],
        setLegalConsent: [],
      })
    })
  })

  it('keeps the queue if there is no internet connection', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const trackConversionSpy = vi.spyOn(KameleoonClient.prototype, 'trackConversion')

    let contextValue: any = null
    const TestComponent = () => {
      contextValue = React.useContext(KameleoonContext)
      contextValue?.queueRef.current.trackConversion.push(['conversion1'])

      return null
    }

    await act(async () => {
      render(
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          <TestComponent />
        </KameleoonProvider>,
      )
    })

    waitFor(() => {
      expect(trackConversionSpy).not.toHaveBeenCalled()
      expect(contextValue.queueRef.current).toEqual({
        trackConversion: ['conversion1'],
        addData: [],
        flush: [],
        setLegalConsent: [],
      })
    })
  })

  it('process the queue if there is internet connection and the client is available', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const trackConversionSpy = vi.spyOn(KameleoonClient.prototype, 'trackConversion')

    let contextValue: any = null
    const TestComponent = () => {
      contextValue = React.useContext(KameleoonContext)
      contextValue?.queueRef.current.trackConversion.push(['conversion1'])

      return null
    }

    await act(async () => {
      render(
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          <TestComponent />
        </KameleoonProvider>,
      )
    })

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    waitFor(() => {
      expect(trackConversionSpy).toHaveBeenCalledWith('conversion1')
      expect(contextValue.queueRef.current).toEqual({
        trackConversion: [],
        addData: [],
        flush: [],
        setLegalConsent: [],
      })
    })
  })

  it('provides client and queueRef through context', async () => {
    let contextValue: any = null
    const TestComponent = () => {
      contextValue = React.useContext(KameleoonContext)
      return null
    }

    await act(async () => {
      render(
        <KameleoonProvider enabled={true} siteCode="test-site-code">
          <TestComponent />
        </KameleoonProvider>,
      )
    })

    await waitFor(() => {
      expect(contextValue).not.toBeNull()
      expect(contextValue.client).toBeDefined()
      expect(contextValue.queueRef).toBeDefined()
      expect(contextValue.queueRef.current).toEqual({
        trackConversion: [],
        addData: [],
        flush: [],
        setLegalConsent: [],
      })
    })
  })
})
