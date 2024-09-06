interface KameleoonScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  siteCode: string
  component?: (url: string) => JSX.Element
}

export function KameleoonScript({ siteCode, component, ...props }: KameleoonScriptProps) {
  const scriptSrc = `//${siteCode}.kameleoon.io/kameleoon.js`

  if (component) {
    return component(scriptSrc)
  }

  return <script src={scriptSrc} async crossOrigin="anonymous" referrerPolicy="no-referrer" {...props} />
}
