import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import ErrorBoundary from '../components/ErrorBoundary'
import NetworkStatus from '../components/NetworkStatus'
import Portfolio from '../components/Portfolio'
import { trackEvent, trackEngagement } from '../lib/analytics'

export default function Home() {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  const [sessionContext, setSessionContext] = useState({})
  const [currentViewers, setCurrentViewers] = useState(Math.floor(Math.random() * 8) + 12) // 12-19 viewers
  const [recentBookings, setRecentBookings] = useState([
    "Sarah K. from TechCorp booked a call 23 minutes ago",
    "Mike R. from HealthTech booked a call 1 hour ago", 
    "Jennifer L. from FinanceApp booked a call 3 hours ago"
  ])
  const [welcomeText, setWelcomeText] = useState('')
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false)
  const [isMobileInputVisible, setIsMobileInputVisible] = useState(true) // Default to true, will be set properly in useEffect
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [placeholderText, setPlaceholderText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  
  // Rotating placeholder messages
  const placeholderMessages = [
    "Ask if I am available for new projects",
    "Ask if I am taking on new clients",
    "Ask if I am available for consulting work",
    "Ask if I can help with your next project",
    "Ask about Bttr and our services",
    "Ask about my design process",
    "Ask about our product strategy approach"
  ]
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    error,
    append,
    setMessages
  } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      sessionContext: sessionContext,
      stream: false // Disable streaming for instant, complete responses
    },
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })
  
  const scrollToBottom = () => {
    // Only auto-scroll if there are multiple messages and portfolio is not showing
    if (messagesEndRef.current && messages.length > 1 && !showPortfolio) {
      // Use requestAnimationFrame to ensure input field positioning is stable
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
      })
    }
  }
  
  const handleProjectClick = (project) => {
    // Track portfolio interaction
    trackEngagement('project_click', project.name)
    
    // Mark chat as started for analytics (layout is now independent)
    setChatStarted(true)
    
    // Close portfolio and start chat
    setShowPortfolio(false)
    
    // Send a message to chat about the selected project
    setTimeout(() => {
      append({
        role: 'user',
        content: `Tell me more about the ${project.name} project`
      })
    }, 100)
  }
  
  const handleNameClick = () => {
    // Mark chat as started for analytics (layout is now independent)
    setChatStarted(true)
    
    // Then clear the chat and hide portfolio
    setMessages([])
    setShowPortfolio(false)
    
    // Skip welcome animation since this is a manual reset
    setIsWelcomeComplete(true)
    setWelcomeText("")
    
    // Track interaction
    trackEngagement('name_click', 'header')
    
    // Send "what's up" message from assistant after a brief delay
    setTimeout(() => {
      append({
        role: 'assistant',
        content: "What's up! 👋"
      })
    }, 300)
  }

  // Load session context from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('donny-session-context')
    if (saved) {
      try {
        setSessionContext(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse session context:', e)
      }
    }
  }, [])

  // Update session context based on conversation
  const updateSessionContext = (newMessages) => {
    const userMessages = newMessages.filter(msg => msg.role === 'user')
    const context = { ...sessionContext }
    
    // Track topics mentioned
    const topics = {
      design: /design|visual|ui|ux|interface|branding|identity/i,
      strategy: /strategy|business|growth|market|positioning/i,
      technology: /tech|development|code|api|platform|system/i,
      projects: /ikon|ge|pepsi|allergan|air company|portfolio/i,
      contact: /contact|email|hire|work together|collaborate/i,
      pricing: /cost|price|budget|rate|fee/i
    }
    
    userMessages.forEach(msg => {
      Object.entries(topics).forEach(([topic, regex]) => {
        if (regex.test(msg.content)) {
          context[`interested_in_${topic}`] = true
          context[`${topic}_mentions`] = (context[`${topic}_mentions`] || 0) + 1
        }
      })
    })
    
    // Track session stats
    context.total_messages = userMessages.length
    context.last_active = new Date().toISOString()
    context.session_start = context.session_start || new Date().toISOString()
    
    setSessionContext(context)
    localStorage.setItem('donny-session-context', JSON.stringify(context))
  }

  const startInactivityTimer = () => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Removed inactivity prompt - keeping timer structure for potential future use
  }

  useEffect(() => {
    scrollToBottom()
    updateSessionContext(messages)
    // Mark chat as started when first message appears
    if (messages.length > 0) {
      setChatStarted(true)
    }
    // Refocus input after bot responds
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus()
    }
  }, [messages, isLoading])

  // Simple fade-in for welcome message
  useEffect(() => {
    // Set text immediately
    setWelcomeText("Creative Director building bold, meticulously designed products that blend culture, code, and strategy.")
    setIsWelcomeComplete(false)
    
    // Trigger fade-in after brief delay
    const fadeTimer = setTimeout(() => {
      setIsWelcomeComplete(true)
    }, 300)
    
    return () => {
      clearTimeout(fadeTimer)
    }
  }, [])

  // Auto-focus input on mount and ensure welcome message is visible
  useEffect(() => {
    // Track page load
    trackEvent('page_load', {
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    })
    
    // For mobile, don't auto-focus to prevent keyboard popup on load
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Set initial visibility based on device type
    if (typeof window !== 'undefined') {
      setIsMobileInputVisible(!isMobile) // Hide on mobile, show on desktop
    }
    
    // Ensure welcome message is visible first
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      // Only auto-focus on desktop after welcome is complete
      if (!isMobile && isWelcomeComplete) {
        inputRef.current?.focus()
      }
    }, 100)
    
    // Re-focus on visibility change (for mobile app switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isWelcomeComplete])

  useEffect(() => {
    // Start the inactivity timer when component mounts
    startInactivityTimer()
    
    // Cleanup on unmount
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [])

  // Update clock every second to avoid hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }))
    }
    
    // Set initial time
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Simulate live activity and social proof
  useEffect(() => {
    const updateActivity = () => {
      // Randomly fluctuate viewer count
      setCurrentViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newCount = prev + change
        return Math.max(8, Math.min(25, newCount)) // Keep between 8-25
      })
      
      // Occasionally add new booking notifications
      if (Math.random() > 0.97) { // 3% chance every 30 seconds
        const companies = ["TechCorp", "HealthTech", "FinanceApp", "RetailPro", "DataCo", "CloudStart", "GrowthLab"]
        const names = ["Sarah K.", "Mike R.", "Jennifer L.", "David C.", "Lisa M.", "Alex P.", "Maria S."]
        const timeAgo = ["just now", "2 minutes ago", "7 minutes ago", "15 minutes ago"]
        
        const newBooking = `${names[Math.floor(Math.random() * names.length)]} from ${companies[Math.floor(Math.random() * companies.length)]} booked a call ${timeAgo[Math.floor(Math.random() * timeAgo.length)]}`
        
        setRecentBookings(prev => [newBooking, ...prev.slice(0, 2)])
      }
    }
    
    const activityInterval = setInterval(updateActivity, 30000) // Update every 30 seconds
    
    return () => clearInterval(activityInterval)
  }, [])

  // Load Unicorn Studio Folds background with retry logic (exact copy from bttr-ai.com)
  useEffect(() => {
    const loadUnicornStudio = () => {
      const container = document.getElementById('unicorn-folds-bg')
      if (!container) return
      
      // Set the project ID immediately
      // Use exact same config as bttr-ai.com (working liquid animation)
      container.setAttribute('data-us-project', 'lHlDvoJDIXCxxXVqTNOC')
      console.log('Setting up Unicorn Studio with project:', 'lHlDvoJDIXCxxXVqTNOC')
      
      let retryCount = 0
      const maxRetries = 3
      
      const initUnicornStudio = () => {
        if (window.UnicornStudio) {
          try {
            window.UnicornStudio.destroy()
            window.UnicornStudio.init().then(scenes => {
              console.log('Unicorn Studio Folds loaded:', scenes)
              container.style.opacity = '1'
            }).catch(error => {
              console.log('Unicorn Studio init error:', error)
              // Retry if failed
              if (retryCount < maxRetries) {
                retryCount++
                console.log(`Retrying Unicorn Studio init (${retryCount}/${maxRetries})`)
                setTimeout(initUnicornStudio, 1000)
              }
            })
          } catch (error) {
            console.log('Unicorn Studio initialization error:', error)
            // Retry if failed
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`Retrying Unicorn Studio init (${retryCount}/${maxRetries})`)
              setTimeout(initUnicornStudio, 1000)
            }
          }
        } else {
          // UnicornStudio not loaded yet, retry
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`UnicornStudio not ready, retrying (${retryCount}/${maxRetries})`)
            setTimeout(initUnicornStudio, 1000)
          }
        }
      }
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="unicorn.studio"]')
      if (existingScript) {
        setTimeout(initUnicornStudio, 200)
        return
      }
      
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js'
      
      script.onload = () => {
        console.log('Unicorn Studio script loaded')
        setTimeout(initUnicornStudio, 200)
      }
      
      script.onerror = () => {
        console.log('Failed to load Unicorn Studio script')
        // Try to reload the script
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying script load (${retryCount}/${maxRetries})`)
          setTimeout(() => {
            const newScript = script.cloneNode()
            document.head.appendChild(newScript)
          }, 1000)
        }
      }
      
      document.head.appendChild(script)
      
      return () => {
        if (window.UnicornStudio) {
          window.UnicornStudio.destroy()
        }
      }
    }
    
    const cleanupUnicorn = loadUnicornStudio()
    
    // Re-initialize Unicorn Studio on page visibility change (handles navigation)
    const handleVisibilityChange = () => {
      if (!document.hidden && window.UnicornStudio) {
        console.log('Page became visible, re-initializing folds background')
        setTimeout(() => {
          const container = document.getElementById('unicorn-folds-bg')
          if (container) {
            try {
              window.UnicornStudio.destroy()
              window.UnicornStudio.init().then(scenes => {
                console.log('Unicorn Studio Folds re-initialized on visibility:', scenes)
                container.style.opacity = '1'
              }).catch(error => {
                console.log('Unicorn Studio visibility reinit error:', error)
              })
            } catch (error) {
              console.log('Unicorn Studio visibility reinitialization error:', error)
            }
          }
        }, 500)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (typeof cleanupUnicorn === 'function') {
        cleanupUnicorn()
      }
    }
  }, [])

  // Register service worker for performance
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  // Remove typewriter animation - just show static placeholder
  useEffect(() => {
    setPlaceholderText('Ask me anything')
  }, [])

  const handleKeyPress = (e) => {
    // Clear inactivity timer on any key press
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Check if Snake game is active
    const lastMessage = messages[messages.length - 1]
    const isSnakeActive = lastMessage?.content?.includes('🐍 SNAKE GAME ACTIVATED 🐍')
    
    if (isSnakeActive) {
      // Snake game controls
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        append({
          role: 'assistant',
          content: '$ snake.exe running... Use arrow keys to play! (This is a demo - full game coming soon!)'
        })
        return
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        const direction = {
          'ArrowUp': '↑', 'w': '↑',
          'ArrowDown': '↓', 's': '↓', 
          'ArrowLeft': '←', 'a': '←',
          'ArrowRight': '→', 'd': '→'
        }[e.key.toLowerCase()]
        
        append({
          role: 'assistant',
          content: `$ snake moving ${direction} ... (Demo mode - full Snake game in development!)`
        })
        return
      }
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Close portfolio when user starts chatting
      if (showPortfolio) {
        setShowPortfolio(false)
      }
      handleSubmit(e)
    }
  }

  // Auto-sizing textarea functionality
  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return

    const autosize = () => {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px'
    }

    // Auto-size on input and change
    const handleInput = () => {
      autosize()
    }

    textarea.addEventListener('input', handleInput)
    textarea.addEventListener('change', handleInput)
    
    // Initial sizing
    autosize()

    return () => {
      textarea.removeEventListener('input', handleInput)
      textarea.removeEventListener('change', handleInput)
    }
  }, [])

  const handlePageClick = (e) => {
    // Clear inactivity timer on any click
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Don't focus if clicking on interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return
    }
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile && !isMobileInputVisible && messages.length === 0) {
      // On mobile, tapping the welcome screen should show input
      setIsMobileInputVisible(true)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 300) // Wait for animation
    } else if (!isMobile) {
      // Focus the input field immediately on desktop
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>Donny Smith - Product Designer & Creative Technologist</title>
        <meta name="description" content="Donny Smith is a product designer and creative technologist building innovative digital experiences. Specializing in AI, design systems, and user interfaces." />
        <meta name="keywords" content="Donny Smith, product design, UI/UX, creative technology, AI, design systems, web development" />
        <meta name="author" content="Donny Smith" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.donnysmith.com/" />
        <meta property="og:title" content="Donny Smith - Product Designer & Creative Technologist" />
        <meta property="og:description" content="Building innovative digital experiences at the intersection of design and technology." />
        <meta property="og:image" content="https://www.donnysmith.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.donnysmith.com/" />
        <meta property="twitter:title" content="Donny Smith - Product Designer & Creative Technologist" />
        <meta property="twitter:description" content="Building innovative digital experiences at the intersection of design and technology." />
        <meta property="twitter:image" content="https://www.donnysmith.com/og-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.donnysmith.com/" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Donny Smith",
              "jobTitle": "Product Designer & Creative Technologist",
              "description": "Building innovative digital experiences at the intersection of design and technology",
              "url": "https://www.donnysmith.com",
              "sameAs": [
                "https://twitter.com/donnysmith",
                "https://linkedin.com/in/donnysmith",
                "https://github.com/donnysmith"
              ],
              "knowsAbout": [
                "Product Design",
                "User Experience (UX)",
                "User Interface (UI)",
                "Creative Technology",
                "Artificial Intelligence",
                "Design Systems",
                "Web Development"
              ]
            })
          }}
        />
        
        {/* Viewport and Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="dark only" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          /* 
            FLOATING OVERLAY ARCHITECTURE:
            - Navigation header: Fixed overlay at top (z-index: 9998)
            - Input field: Fixed overlay at bottom (z-index: 9999)  
            - Main content: Flows underneath with fixed padding to account for overlays
            - All overlays are completely independent of content state/changes
          */
          
          @font-face {
            font-family: 'Neue Montreal';
            src: url('/NeueMontreal-Regular.woff2') format('woff2'),
                 url('/NeueMontreal-Regular.woff') format('woff'),
                 url('/NeueMontreal-Regular.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'Triakis';
            src: url('/TriakisFont-Regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'SuisseBPIntl';
            src: url('/SuisseBPIntl-Medium.woff2') format('woff2'),
                 url('/SuisseBPIntl-Medium.woff') format('woff'),
                 url('/SuisseBPIntl-Medium.otf') format('opentype');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          
          .pulse-dot {
            width: 12px;
            height: 12px;
            background: #FFFFFF;
            border-radius: 50%;
            filter: blur(2px);
            animation: pulse 1.5s ease-in-out infinite;
          }
          
          .cursor::after {
            content: '█';
            position: absolute;
            animation: blink 1s infinite;
            color: #38FE27;
            left: 0;
            top: 0;
            pointer-events: none;
            font-size: 12px;
            line-height: 1.2;
          }
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            color-scheme: dark;
          }
          
          html {
            color-scheme: dark;
          }
          * {
            box-sizing: border-box;
          }
          ::selection {
            background: #264F78;
            color: #D4D4D4;
          }
          ::-moz-selection {
            background: #264F78;
            color: #D4D4D4;
          }
          input::placeholder {
            color: #808080;
          }
          input::-webkit-input-placeholder {
            color: #808080;
          }
          input::-moz-placeholder {
            color: #808080;
          }
          @media (max-width: 768px) {
            body, div, span, button, input[type="text"], textarea {
              font-size: 16px !important;
            }
            .mobile-hide {
              display: none !important;
            }
            .mobile-show {
              display: block !important;
            }
            .mobile-fullscreen {
              height: calc(100vh - 80px) !important;
              padding-top: calc(16px + env(safe-area-inset-top)) !important;
              padding-top: calc(16px + constant(safe-area-inset-top)) !important; /* iOS < 11.2 */
              padding-bottom: 80px !important;
              padding-left: calc(16px + env(safe-area-inset-left)) !important;
              padding-left: calc(16px + constant(safe-area-inset-left)) !important; /* iOS < 11.2 */
              padding-right: calc(16px + env(safe-area-inset-right)) !important;
              padding-right: calc(16px + constant(safe-area-inset-right)) !important; /* iOS < 11.2 */
              display: flex !important;
              flex-direction: column !important;
              justify-content: flex-start !important;
              overflow-y: auto !important;
              scroll-behavior: smooth !important;
            }
            .mobile-caret {
              font-size: 16px !important;
              line-height: 1.2 !important;
            }
            
            /* Enhanced mobile keyboard styling */
            .input-field,
            .input-field:disabled {
              -webkit-appearance: none !important;
              -webkit-text-fill-color: #FFFFFF !important;
              -webkit-user-select: text !important;
              -webkit-touch-callout: none !important;
              -webkit-tap-highlight-color: transparent !important;
              background-color: #1a1a1a !important;
              caret-color: #FFFFFF !important;
            }
            
            /* iOS keyboard dark mode */
            @supports (-webkit-touch-callout: none) {
              .input-field {
                color-scheme: dark !important;
              }
            }
            
            /* Prevent zoom on focus */
            .input-field:focus {
              font-size: 16px !important;
            }
            
            /* Better mobile viewport handling */
            html {
              height: 100%;
              -webkit-text-size-adjust: 100%;
            }
            
            body {
              height: 100%;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              touch-action: manipulation;
            }
          }
        `}
        {`
          /* Optimized iOS input with proper spacing */
          :root {
            --h: 32px;
            --btn-size: 27px; /* 15% smaller than 32px */
            --gap: 8px;
            --radius: 16px;
            --border: 2px;
            --safe-l: env(safe-area-inset-left);
            --safe-r: env(safe-area-inset-right);
            --safe-b: env(safe-area-inset-bottom);
            --kb: 0px;
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            clip: rect(0 0 0 0);
            overflow: hidden;
            white-space: nowrap;
          }

          .input-bar {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            padding: 16px;
            background: transparent;
            width: 100% !important;
            box-sizing: border-box;
            pointer-events: auto;
            min-height: 64px;
            /* Complete isolation from content flow */
            margin: 0 !important;
            top: auto !important;
          }
          
          @media (min-width: 768px) {
            .input-bar {
              left: 50% !important;
              transform: translateX(-50%) !important;
              max-width: 864px;
              width: 864px;
              padding: 16px 32px;
              box-sizing: border-box;
            }
          }
          
          @media (min-width: 1400px) {
            .input-bar {
              padding: 16px 64px;
            }
          }
          
          /* Nav content container width matching */
          .nav-content-container {
            width: 100%;
            max-width: 864px;
            padding: 8px 32px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            box-sizing: border-box;
          }
          
          @media (min-width: 1400px) {
            .nav-content-container {
              padding: 8px 64px;
            }
          }
          
          /* Prevent layout shifts on header buttons */
          header button {
            contain: layout !important;
          }
          
          /* Disable problematic transitions during state changes */
          .input-bar, .input-field, main {
            transition: none !important;
          }
          
          
          /* Mobile-first redesign */
          @media (max-width: 767px) {
            /* Hide desktop header on mobile */
            .mobile-hide {
              display: none !important;
            }
            
            /* Mobile content takes full viewport */
            .mobile-content {
              height: 100vh !important;
              height: 100dvh !important; /* Dynamic viewport height */
              padding: env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left) !important;
              display: flex !important;
              flex-direction: column !important;
              overflow: hidden !important;
            }
            
            /* Welcome message mobile styling */
            .mobile-welcome {
              flex: 1 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 20px !important;
              text-align: center !important;
            }
            
            .mobile-welcome .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 24px !important;
              line-height: 1.3 !important;
              letter-spacing: -0.4px !important;
              font-weight: 500 !important;
              white-space: normal !important;
              max-width: 90% !important;
              margin: 0 auto !important;
              max-width: 320px !important;
            }
            
            /* Mobile-only input animations */
            @media (max-width: 767px) {
              .input-bar.mobile-hidden {
                transform: translateY(100%) !important;
                transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1) !important;
              }
              
              .input-bar.mobile-visible {
                transform: translateY(0) !important;
                transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1) !important;
              }
            }
            
            /* Mobile chat area */
            .mobile-chat {
              flex: 1 !important;
              overflow-y: auto !important;
              padding: 16px !important;
              padding-bottom: 100px !important; /* Space for input */
            }
            
            /* Mobile message styling */
            .mobile-message {
              margin-bottom: 16px !important;
              font-size: 16px !important;
              line-height: 1.5 !important;
              letter-spacing: 0.1px !important;
            }
            
            /* Override desktop message positioning on mobile */
            .message-container {
              max-width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
          }

          .field-wrap {
            position: relative;
            width: 100%;
          }

          .input-field {
            height: var(--h);
            min-height: var(--h);
            max-height: var(--h);
            width: 100%;
            box-sizing: border-box;
            padding: 0 38px 0 14px; /* Add right padding for button space */
            font: 12px 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            letter-spacing: -0.19px;
            color: #FFFFFF;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(80px) saturate(150%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius);
            outline: none;
            resize: none;
            overflow: hidden;
            line-height: var(--h);
            text-align: left;
            caret-color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          .input-field:focus {
            box-shadow: none;
          }

          .send-btn {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            border-radius: 5px;
            border: 0;
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
          }

          .send-btn:not([disabled]):hover {
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
          }

          .send-btn:not([disabled]):active {
            transform: translateY(-50%) scale(0.95);
          }

          .send-btn[disabled] {
            opacity: 0;
            cursor: default;
            pointer-events: none;
          }
          
          /* Desktop chat container - full width */
          @media (min-width: 768px) {
            .mobile-show {
              display: none !important;
            }
            .desktop-constrained {
              max-width: 864px !important;
              margin: 0 auto !important;
              padding-left: 32px !important;
              padding-right: 32px !important;
            }
          }
          
          @media (min-width: 1400px) {
            .desktop-constrained {
              padding-left: 64px !important;
              padding-right: 64px !important;
            }
          }
          
          /* Messages - consistent left alignment for clean terminal look */
          @media (min-width: 768px) {
            .message-container:not(.mobile-welcome) {
              max-width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            /* Welcome message should be centered */
            .mobile-welcome.message-container {
              max-width: none !important;
              margin-left: auto !important;
              margin-right: auto !important;
              display: flex !important;
              justify-content: center !important;
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .portfolio-enter {
            animation: fadeInUp 0.4s ease-out;
          }
          
          /* Large welcome message on desktop */
          @media (min-width: 768px) {
            .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-weight: 500 !important;
              font-size: 42px !important;
              line-height: 47.5px !important;
              margin-bottom: 0 !important;
              letter-spacing: -0.8px !important;
              white-space: normal !important;
              max-width: 900px !important;
              margin: 0 auto !important;
            }
            
            /* Center content vertically when only welcome message is shown */
            .mobile-fullscreen {
              min-height: calc(100vh - 140px) !important;
            }
          }
        `}</style>
      </Head>
      
      <noscript>
        <div style={{
          minHeight: '100vh',
          background: '#000000',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: "'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>JavaScript Required</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            This interactive experience requires JavaScript to be enabled.
          </p>
          <p style={{ fontSize: '14px', marginTop: '24px' }}>
            Contact: donny@makebttr.com
          </p>
        </div>
      </noscript>
      
      <NetworkStatus />
      
      <div 
        onClick={handlePageClick}
        role="main"
        aria-label="Chat interface"
        style={{
          minHeight: '100vh',
          background: '#000000',
          color: '#FFFFFF',
          fontFamily: "'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '12px',
          lineHeight: '1.2',
          letterSpacing: '-0.19px',
          padding: 0,
          margin: 0,
          cursor: 'text',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative'
        }}>
        
        {/* Animated Folds Background */}
        <div
          id="unicorn-folds-bg"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            backgroundColor: '#000000',
            backgroundImage: 'url(/BK1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none'
          }}
        />
        
        <div style={{
          width: '100%',
          maxWidth: '100vw',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'visible',
          zIndex: 2
        }}
        className="desktop-constrained">
        
        {/* Live Activity Ticker */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 100, 100, 0.3)',
          padding: '6px 20px',
          fontSize: '11px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'monospace'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>🔴 {currentViewers} viewing</span>
            <span>⚡ 2 slots left Q4</span>
          </div>
          <div style={{ 
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '300px',
            fontSize: '10px'
          }}>
            <div style={{
              animation: 'scroll-left 20s linear infinite',
              display: 'inline-block'
            }}>
              📅 {recentBookings[0]}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>

        {/* Floating Navigation Header - Independent overlay */}
        <header className="mobile-hide" role="banner" style={{
          position: 'fixed',
          top: '30px',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Nav content container - matches conversation/input width */}
          <div className="nav-content-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifySelf: 'start' }}>
            <h1 
              onClick={handleNameClick}
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap', 
                margin: 0, 
                fontWeight: 'normal',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Donny Smith
            </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
              <span style={{ color: '#FFFFFF', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {currentTime}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifySelf: 'end' }}>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={() => {
                // Toggle portfolio (layout is now independent of state)
                setShowPortfolio(!showPortfolio)
                trackEngagement('portfolio_toggle', showPortfolio ? 'close' : 'open')
              }}
              aria-label="View portfolio"
            >
              Work
            </button>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={() => {
                // Hide portfolio if showing and start contact chat
                setShowPortfolio(false)
                trackEngagement('contact_click', 'header')
                append({
                  role: 'user',
                  content: '/contact'
                })
              }}
              aria-label="Contact for inquiries"
            >
              Inquiries
            </button>
            </div>
          </div>
        </header>

        {/* Terminal Content - Flows underneath floating overlays */}
        <main className="mobile-content mobile-fullscreen" role="region" aria-label="Chat messages" style={{
          height: '100vh',
          overflowY: 'auto',
          /* Fixed padding that accounts for floating overlays - never changes */
          paddingTop: '80px',
          paddingBottom: '100px', 
          paddingLeft: '12px',
          paddingRight: '12px',
          background: 'transparent',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: (messages.length === 0 && !showPortfolio) ? 'center' : 'flex-start'
        }}>
          
          {/* Welcome Message */}
          {messages.length === 0 && !showPortfolio && (
            <div className="mobile-welcome message-container">
              <div 
                className="welcome-message"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  color: '#FFFFFF'
                }}>
                <div style={{ 
                  position: 'relative',
                  opacity: isWelcomeComplete ? 1 : 0,
                  transition: 'opacity 1.2s ease-out'
                }}>
                  {welcomeText}
                </div>
              </div>
            </div>
          )}
          
          {/* Portfolio Section */}
          {showPortfolio && (
            <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
              <Portfolio onProjectClick={handleProjectClick} />
            </div>
          )}
          
          {/* Mobile Chat Messages - hidden on desktop */}
          {messages.length > 0 && (
            <div className="mobile-chat mobile-show" role="log" aria-label="Conversation history" aria-live="polite">
              {messages.map((msg, i) => (
                <div key={msg.id || i} className="mobile-message message-container" style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    fontSize: '16px',
                    lineHeight: '1.4',
                    ...(msg.role === 'user' ? {
                      background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                      color: '#FFFFFF',
                      borderBottomRightRadius: '4px'
                    } : {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      borderBottomLeftRadius: '4px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    })
                  }}>
                    {msg.role === 'user' ? (
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {msg.content}
                      </div>
                    ) : (
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({children}) => <div style={{ marginBottom: '8px' }}>{children}</div>,
                          strong: ({children}) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                          em: ({children}) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                          a: ({children, href}) => <a href={href} style={{ color: '#00FFFF', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>,
                          code: ({children}) => <code style={{ background: '#1a1a1a', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>,
                          pre: ({children}) => <pre style={{ background: '#1a1a1a', padding: '8px', borderRadius: '3px', overflow: 'auto' }}>{children}</pre>,
                          ul: ({children}) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
                          ol: ({children}) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
                          li: ({children}) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Desktop messages - hidden on mobile */}
          <div className="mobile-hide">
            {messages.map((msg, i) => (
              <div key={msg.id || i} className="message-container" style={{ 
                marginBottom: '12px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  letterSpacing: '-0.19px',
                  ...(msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                    color: '#FFFFFF',
                    borderBottomRightRadius: '4px'
                  } : {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    borderBottomLeftRadius: '4px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  })
                }}>
                  {msg.role === 'user' ? (
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  ) : (
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({children}) => <div style={{ marginBottom: '8px' }}>{children}</div>,
                          strong: ({children}) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                          em: ({children}) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                          a: ({children, href}) => <a href={href} style={{ color: '#00FFFF', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>,
                          code: ({children}) => <code style={{ background: '#1a1a1a', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>,
                          pre: ({children}) => <pre style={{ background: '#1a1a1a', padding: '8px', borderRadius: '3px', overflow: 'auto' }}>{children}</pre>,
                          ul: ({children}) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
                          ol: ({children}) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
                          li: ({children}) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                        }}
                      >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {isLoading && (
            <div role="status" aria-live="polite" aria-label="AI is thinking" style={{ 
              marginBottom: '8px',
              color: '#FFFFFF',
              fontSize: '12px',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              height: '17px'
            }}>
              <div className="pulse-dot" style={{ display: 'inline-block' }}></div>
              <span className="sr-only">Loading response...</span>
            </div>
          )}
          
          {error && (
            <div role="alert" aria-live="assertive" style={{ marginBottom: '8px' }}>
              <div style={{ 
                color: '#F44747',
                marginBottom: '1px',
                fontSize: '12px'
              }}>
                Error:
              </div>
              <div style={{
                color: '#F44747',
                paddingLeft: '12px',
                fontSize: '12px'
              }}>
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* iOS-style Input Bar */}
        <div 
          className={`input-bar ${!isMobileInputVisible ? 'mobile-hidden' : 'mobile-visible'}`} 
          role="form" 
          aria-label="Chat input"
        >
          <label className="sr-only" htmlFor="chat-input">Message</label>
          <div className="field-wrap">
            <textarea 
              id="chat-input"
              ref={inputRef}
              className="input-field"
              rows="1"
              placeholder={placeholderText || "Ask me anything"}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="on"
              spellCheck="true"
              enterKeyHint="send"
              inputMode="text"
              autoFocus
            />

            {input.trim() && !isLoading && (
              <button 
                className="send-btn" 
                type="button" 
                aria-label="Send"
                onClick={(e) => {
                  e.preventDefault()
                  // Close portfolio when user starts chatting
                  if (showPortfolio) {
                    setShowPortfolio(false)
                  }
                  handleSubmit(e)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        

        {/* Keyboard-safe spacing script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if('visualViewport' in window){
                  const vv = window.visualViewport;
                  const set = () => {
                    const overlap = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
                    document.documentElement.style.setProperty('--kb', overlap + 'px');
                    // Prevent conversation from moving up by maintaining scroll position
                    document.body.style.transform = 'translateY(0)';
                  };
                  ['resize','scroll'].forEach(e => vv.addEventListener(e, set));
                  set();
                } else {
                  window.addEventListener('focusin', () => {
                    document.documentElement.style.setProperty('--kb','12px');
                    document.body.style.transform = 'translateY(0)';
                  });
                  window.addEventListener('focusout', () => {
                    document.documentElement.style.setProperty('--kb','0px');
                    document.body.style.transform = 'translateY(0)';
                  });
                }
              })();
            `
          }}
        />
        </div>
      </div>
    </ErrorBoundary>
  )
}