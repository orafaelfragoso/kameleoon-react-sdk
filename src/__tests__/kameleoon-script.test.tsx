import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { KameleoonScript } from '@/components/kameleoon-script'

describe('KameleoonScript', () => {
  const siteCode = '123'

  it('renders a script tag with default attributes when no component prop is provided', () => {
    render(<KameleoonScript siteCode={siteCode} />)

    const script = document.querySelector('script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('src', `//${siteCode}.kameleoon.io/kameleoon.js`)
    expect(script).toHaveAttribute('async', '')
    expect(script).toHaveAttribute('crossorigin', 'anonymous')
    expect(script).toHaveAttribute('referrerpolicy', 'no-referrer')
  })

  it('calls the custom component callback with the script src when provided', () => {
    const customComponentMock = vi.fn((url: string) => <div>Custom Script: {url}</div>)

    render(<KameleoonScript siteCode={siteCode} component={customComponentMock} />)

    expect(customComponentMock).toHaveBeenCalledWith(`//${siteCode}.kameleoon.io/kameleoon.js`)
    expect(screen.getByText(`Custom Script: //${siteCode}.kameleoon.io/kameleoon.js`)).toBeInTheDocument()
  })

  it('passes additional props to the script tag', () => {
    render(<KameleoonScript siteCode={siteCode} defer id="test-script" integrity="sha384-..." />)

    const script = document.querySelector('script')
    expect(script).toHaveAttribute('defer', '')
    expect(script).toHaveAttribute('id', 'test-script')
    expect(script).toHaveAttribute('integrity', 'sha384-...')
  })
})
