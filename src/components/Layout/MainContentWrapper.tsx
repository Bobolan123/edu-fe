'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface MainContentWrapperProps {
  children: ReactNode
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const pathname = usePathname()
  
  // Check if navbar should be hidden (same logic as ConditionalNavbar)
  const shouldHideNavbar = 
    /\/my-learning\/[^\/]+$/.test(pathname) || // my-learning/[title] pattern
    pathname.startsWith('/admin') || // any admin route
    pathname.includes('/admin') // admin routes with locale
  
  return (
    <div 
      id="main-content"
      className={shouldHideNavbar ? '' : 'main-content-with-navbar'}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  )
}