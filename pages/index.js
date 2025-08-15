import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  const [sessionContext, setSessionContext] = useState({})
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    error,
    append
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `How can I help you today?`
      }
    ],
    body: {
      sessionContext: sessionContext
    },
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })
  
  const scrollToBottom = () => {
    // Only auto-scroll if there are multiple messages
    if (messagesEndRef.current && messages.length > 1) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
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
    // Refocus input after bot responds
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus()
    }
  }, [messages, isLoading])

  // Auto-focus input on mount and ensure welcome message is visible
  useEffect(() => {
    // For mobile, don't auto-focus to prevent keyboard popup on load
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Ensure welcome message is visible first
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      // Only auto-focus on desktop
      if (!isMobile) {
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
  }, [])

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
    // Focus the input field - especially important for mobile
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <>
      <Head>
        <title>donnysmith@terminal ~ $</title>
        <meta name="description" content="Donny Smith - Terminal interface for AI assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="dark only" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          @font-face {
            font-family: 'Neue Montreal';
            src: url('/NeueMontreal-Regular.woff2') format('woff2'),
                 url('/NeueMontreal-Regular.woff') format('woff'),
                 url('/NeueMontreal-Regular.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Triakis';
            src: url('/TriakisFont-Regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
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
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            display: grid;
            grid-template-columns: 1fr var(--h);
            align-items: center;
            gap: var(--gap);
            padding: calc(16px + var(--safe-b)) calc(16px + var(--safe-r)) calc(16px + var(--safe-b)) calc(16px + var(--safe-l));
            background: #000000;
            backdrop-filter: saturate(180%) blur(12px);
            width: 100%;
            box-sizing: border-box;
          }
          
          @media (min-width: 768px) {
            .input-bar {
              left: 50%;
              transform: translateX(-50%);
              max-width: 864px;
              padding: calc(16px + var(--safe-b)) calc(32px + var(--safe-r)) calc(16px + var(--safe-b)) calc(32px + var(--safe-l));
            }
          }
          
          @media (min-width: 1400px) {
            .input-bar {
              padding: calc(16px + var(--safe-b)) calc(64px + var(--safe-r)) calc(16px + var(--safe-b)) calc(64px + var(--safe-l));
            }
          }

          .field-wrap {
            display: flex;
          }

          .input-field {
            height: var(--h);
            min-height: var(--h);
            max-height: var(--h);
            width: 100%;
            box-sizing: border-box;
            padding: 0 14px;
            font: 12px 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            letter-spacing: -0.19px;
            color: #FFFFFF;
            background: #1a1a1a;
            border: none;
            border-radius: var(--radius);
            outline: none;
            resize: none;
            overflow: hidden;
            line-height: var(--h);
            text-align: left;
            caret-color: white;
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          .input-field:focus {
            box-shadow: none;
          }

          .send-btn {
            width: var(--h);
            height: var(--h);
            border-radius: 50%;
            border: 0;
            background: #1a1a1a;
            color: #000000;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .send-btn:not([disabled]) {
            background: #FFFFFF;
            color: #000;
          }

          .send-btn:not([disabled]):active {
            background: #CCCCCC;
          }

          .send-btn[disabled] {
            opacity: 1;
            cursor: default;
          }
          
          /* Desktop chat container - modern chat UI standards */
          @media (min-width: 768px) {
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
          
          /* Large welcome message on desktop */
          @media (min-width: 768px) {
            .welcome-message {
              font-size: 72px !important;
              line-height: 1.1 !important;
              margin-bottom: 24px !important;
              letter-spacing: -0.19px !important;
              animation: fadeInUp 0.8s ease-out !important;
            }
          }
        `}</style>
      </Head>
      
      <div 
        onClick={handlePageClick}
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
          justifyContent: 'center'
        }}>
        
        <div style={{
          width: '100%',
          maxWidth: '100vw',
          minHeight: '100vh',
          position: 'relative'
        }}
        className="desktop-constrained">
        
        {/* Terminal Header Bar */}
        <div className="mobile-hide" style={{
          background: '#000000',
          borderBottom: 'max(1px, 0.5px) solid rgba(128, 128, 128, 0.5)',
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifySelf: 'start' }}>
            <span style={{ color: '#FFFFFF', fontSize: '12px', whiteSpace: 'nowrap' }}>
              Donny Smith
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
            <span style={{ color: '#FFFFFF', fontSize: '12px', whiteSpace: 'nowrap' }}>
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end' }}>
            <span 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onClick={() => {
                append({
                  role: 'user',
                  content: '/contact'
                })
              }}
            >
              Inquiries
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="mobile-fullscreen" style={{
          height: 'calc(100vh - 140px)',
          overflowY: 'auto',
          padding: '12px',
          paddingTop: 'calc(12px + env(safe-area-inset-top))',
          paddingBottom: '120px',
          background: '#000000',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {messages.map((msg, i) => (
            <div key={msg.id || i} style={{ marginBottom: '12px' }}>
              {msg.role === 'user' ? (
                <div style={{
                  color: 'rgb(123, 123, 123)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  paddingLeft: '0',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  letterSpacing: '-0.19px'
                }}>
                  {msg.content}
                </div>
              ) : (
                <div 
                  className={msg.id === 'welcome' ? 'welcome-message' : ''}
                  style={{
                    color: '#FFFFFF',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    letterSpacing: '-0.19px'
                  }}>
                  <ReactMarkdown
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
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div style={{ 
              marginBottom: '8px',
              color: '#FFFFFF',
              fontSize: '12px',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              height: '17px'
            }}>
              <div className="pulse-dot" style={{ display: 'inline-block' }}></div>
            </div>
          )}
          
          {error && (
            <div style={{ marginBottom: '8px' }}>
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
                {error.message || 'Something went wrong'}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* iOS-style Input Bar */}
        <div className="input-bar" role="form" aria-label="Chat input">
          <label className="sr-only" htmlFor="chat-input">Message</label>
          <textarea 
            id="chat-input"
            ref={inputRef}
            className="input-field"
            rows="1"
            placeholder="Ask me anything"
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

          <button 
            className="send-btn" 
            type="button" 
            aria-label="Send"
            disabled={isLoading || !input.trim()}
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
          >
            ↑
          </button>
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
    </>
  )
}