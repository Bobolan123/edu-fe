'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ConditionalNavbarProps {
  children: ReactNode
}

export default function ConditionalNavbar({ children }: ConditionalNavbarProps) {
  const pathname = usePathname()
  
  // Hide navbar on my-learning course detail pages and admin pages
  const shouldHideNavbar = 
    /\/my-learning\/[^\/]+$/.test(pathname) || // my-learning/[title] pattern
    pathname.startsWith('/admin') || // any admin route
    pathname.includes('/admin') // admin routes with locale
  
  if (shouldHideNavbar) {
    return null
  }
  
  return <>{children}</>
}