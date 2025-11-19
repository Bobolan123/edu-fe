'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ConditionalFooterProps {
  children: ReactNode
}

export default function ConditionalFooter({ children }: ConditionalFooterProps) {
  const pathname = usePathname()
  
  // Check if footer should be hidden
  const shouldHideFooter = 
    /\/my-learning\/[^\/]+$/.test(pathname) || // my-learning/[title] video watching page
    pathname.includes('/admin') || // any admin route
    pathname.includes('/login') || // authentication pages
    pathname.includes('/signup') ||
    pathname.includes('/register') ||
    pathname.includes('/signin') ||
    pathname.includes('/auth')
  
  if (shouldHideFooter) {
    return null
  }
  
  return <>{children}</>
}

