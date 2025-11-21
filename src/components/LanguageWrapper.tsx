import { ReactNode } from 'react'
import LanguageToggle from './LanguageToggle'

interface LanguageWrapperProps {
  children: ReactNode
  showToggle?: boolean
}

/**
 * Wrapper component that adds language toggle button to screens
 * Use this to wrap screens that need the language toggle in top left
 */
export default function LanguageWrapper({ children, showToggle = true }: LanguageWrapperProps) {
  return (
    <>
      {showToggle && (
        <div className="fixed top-4 left-4 z-50" style={{ pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <LanguageToggle />
          </div>
        </div>
      )}
      {children}
    </>
  )
}

