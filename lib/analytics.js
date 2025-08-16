// Simple analytics tracking
export const trackEvent = (eventName, properties = {}) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
  
  // Send to analytics endpoint if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
  
  // Performance metrics
  if (eventName === 'page_load' && typeof window !== 'undefined') {
    // Capture Core Web Vitals
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      const metrics = {
        // Time to First Byte
        ttfb: timing.responseStart - timing.navigationStart,
        // DOM Content Loaded
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        // Full page load
        pageLoad: timing.loadEventEnd - timing.navigationStart,
      }
      
      console.log('Performance Metrics:', metrics)
      
      // Report to analytics
      if (window.gtag) {
        window.gtag('event', 'performance', {
          event_category: 'Web Vitals',
          ...metrics
        })
      }
    }
    
    // Report Web Vitals if available
    if ('web-vital' in window) {
      ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'].forEach(metric => {
        window['web-vital'][metric](({ value }) => {
          if (window.gtag) {
            window.gtag('event', metric, {
              event_category: 'Web Vitals',
              value: Math.round(metric === 'CLS' ? value * 1000 : value)
            })
          }
        })
      })
    }
  }
}

// Track user engagement
export const trackEngagement = (action, label, value) => {
  trackEvent('engagement', {
    event_category: 'User Interaction',
    event_action: action,
    event_label: label,
    value: value
  })
}

// Track errors
export const trackError = (error, fatal = false) => {
  console.error('Error tracked:', error)
  trackEvent('exception', {
    description: error.message || error,
    fatal: fatal
  })
}