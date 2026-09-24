import { useId } from 'react'

export default function Logo() {
  const roughenId = `logo-roughen-${useId().replace(/:/g, '')}`

  return (
    <div className="logo-sketch w-10 h-10 bg-[var(--xuli-bg-tertiary)] border-2 border-border flex items-center justify-center">
      <svg className="w-5 h-5" viewBox="0 0 100 100">
        <defs>
          <filter id={roughenId}><feTurbulence baseFrequency="0.035" numOctaves="2" seed="3" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" /></filter>
        </defs>
        <g filter={`url(#${roughenId})`} fill="none" stroke="var(--xuli-accent)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M27 14 L67 16 L76 27 L73 85 L24 82 Z" strokeWidth="4" />
          <path d="M66 16 L65 27 L76 27" strokeWidth="4" />
          <path d="M35 42c8-6 17-7 25-4M35 52c11-5 22-4 30 1M35 64c7 2 15 2 23-1" strokeWidth="3" />
          <path d="M31 72l5 5 12-12" stroke="var(--xuli-mark)" strokeWidth="4" />
        </g>
      </svg>
    </div>
  )
}
