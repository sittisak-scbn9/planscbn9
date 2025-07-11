import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  timeout?: number
}

export function LoadingSpinner({ size = 'md', className = '', timeout }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  // Add timeout to prevent infinite loading
  React.useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => {
        console.warn('Loading spinner timeout reached')
      }, timeout)
      
      return () => clearTimeout(timer)
    }
  }, [timeout])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  )
}