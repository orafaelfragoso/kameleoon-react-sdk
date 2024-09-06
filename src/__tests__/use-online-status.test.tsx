import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOnlineStatus } from '@/hooks/use-online-status'

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with the correct online status', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)
  })

  it('should update status when online event is fired', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { result } = renderHook(() => useOnlineStatus())

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    waitFor(() => {
      expect(result.current).toBe(true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    })
  })

  it('should update status when offline event is fired', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { result } = renderHook(() => useOnlineStatus())

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    waitFor(() => {
      expect(result.current).toBe(false)
      expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    })
  })

  it('should add event listeners on mount', () => {
    renderHook(() => useOnlineStatus())

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useOnlineStatus())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should handle missing navigator.onLine gracefully', () => {
    const originalNavigator = global.navigator
    global.navigator = undefined as any

    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)
    global.navigator = originalNavigator
  })
})
