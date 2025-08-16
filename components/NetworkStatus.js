import { useState, useEffect } from 'react'

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (!online) {
        setShowOfflineMessage(true)
      } else {
        // Hide message after 3 seconds when back online
        setTimeout(() => setShowOfflineMessage(false), 3000)
      }
    }

    // Check initial status
    updateOnlineStatus()

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: isOnline ? '#38FE27' : '#F44747',
        color: '#000000',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        animation: 'fadeInDown 0.3s ease-out'
      }}
    >
      {isOnline ? 'Back online' : 'No internet connection'}
    </div>
  )
}