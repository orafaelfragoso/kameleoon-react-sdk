import { KameleoonError, KameleoonException } from '@kameleoon/javascript-sdk'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { compose } from '@/utils/compose'

describe('compose', () => {
  let client: any
  let queueRef: React.MutableRefObject<Record<string, any[]>>

  beforeEach(() => {
    client = {
      someMethod: vi.fn(),
    }
    queueRef = { current: { someMethod: [] } }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls the method on client when client is available', () => {
    const composedMethod = compose(client, queueRef, 'someMethod')

    composedMethod('arg1', 'arg2')

    expect(client.someMethod).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('logs and rethrows KameleoonError when method throws it', () => {
    const error = new KameleoonError(KameleoonException.Initialization)
    client.someMethod.mockImplementation(() => {
      throw error
    })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    compose(client, queueRef, 'someMethod')('arg1', 'arg2')

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Kameleoon error: ${error.message}`)
    consoleErrorSpy.mockRestore()
  })

  it('logs and rethrows non-KameleoonError when method throws it', () => {
    const error = new Error('General error message')
    client.someMethod.mockImplementation(() => {
      throw error
    })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    compose(client, queueRef, 'someMethod')('arg1', 'arg2')

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error in Kameleoon method 'someMethod':`, error)
    consoleErrorSpy.mockRestore()
  })

  it('queues arguments when client is not available and queueable is true', () => {
    const composedMethod = compose(null, queueRef, 'someMethod', true)

    composedMethod('arg1', 'arg2')

    expect(queueRef.current.someMethod).toEqual([['arg1', 'arg2']])
  })

  it('does nothing when client is not available and queueable is false', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const composedMethod = compose(null, queueRef, 'someMethod', false)

    composedMethod('arg1', 'arg2')

    expect(queueRef.current.someMethod).toEqual([])
    expect(consoleWarnSpy).not.toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })
})
