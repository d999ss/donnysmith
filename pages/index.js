import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

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
        content: `Hello, How can I help you today?`
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
    if (messagesEndRef.current) {
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
    
    // Set a new timer for 10 seconds
    inactivityTimerRef.current = setTimeout(() => {
      // Only show prompt if there's just the welcome message and no user interaction
      if (messages.length === 1 && messages[0].id === 'welcome') {
        append({
          role: 'assistant',
          content: '$ ping -t 10... Still there?'
        })
      }
    }, 10000)
  }

  useEffect(() => {
    scrollToBottom()
    updateSessionContext(messages)
  }, [messages])

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
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
      return
    }
    // Focus the input field
    inputRef.current?.focus()
  }

  return (
    <>
      <Head>
        <title>donnysmith@terminal ~ $</title>
        <meta name="description" content="Donny Smith - Terminal interface for AI assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="dark" />
        <style>{`
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
              padding-top: 20px !important;
              padding-bottom: 80px !important;
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
            .input-field {
              -webkit-appearance: none !important;
              -webkit-text-fill-color: #28FE14 !important;
              -webkit-user-select: text !important;
              -webkit-touch-callout: none !important;
              -webkit-tap-highlight-color: transparent !important;
              background-color: #1a1a1a !important;
              caret-color: #28FE14 !important;
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
            padding: 8px calc(16px + var(--safe-r))
                     calc(8px + max(0px, var(--safe-b) - var(--kb)))
                     calc(16px + var(--safe-l));
            background: #000000;
            backdrop-filter: saturate(180%) blur(12px);
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
            font: 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            color: #28FE14;
            background: #1a1a1a;
            border: none;
            border-radius: var(--radius);
            outline: none;
            resize: none;
            overflow: hidden;
            line-height: var(--h);
            text-align: left;
          }

          .input-field::placeholder {
            color: rgba(40, 254, 20, 0.6);
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
            background: #28FE14;
            color: #000;
          }

          .send-btn:not([disabled]):active {
            background: #20CC10;
          }

          .send-btn[disabled] {
            opacity: 1;
            cursor: default;
          }
        `}</style>
      </Head>
      
      <div 
        onClick={handlePageClick}
        style={{
          minHeight: '100vh',
          background: '#000000',
          color: '#28FE14',
          fontFamily: "'Andale Mono', monospace",
          fontSize: '12px',
          lineHeight: '1.2',
          padding: 0,
          margin: 0,
          cursor: 'text'
        }}>
        
        {/* Terminal Header Bar */}
        <div className="mobile-hide" style={{
          background: '#000000',
          borderBottom: 'max(1px, 0.5px) solid rgba(128, 128, 128, 0.5)',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#28FE14', fontSize: '12px', whiteSpace: 'nowrap' }}>
              DonnySmith
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#28FE14', fontSize: '12px', whiteSpace: 'nowrap' }}>
              {new Date().toDateString()} {new Date().toTimeString().split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="mobile-fullscreen" style={{
          height: 'calc(100vh - 140px)',
          overflowY: 'auto',
          padding: '12px',
          paddingBottom: '120px',
          background: '#000000',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {messages.map((msg, i) => (
            <div key={msg.id || i} style={{ marginBottom: '8px' }}>
              <div style={{
                color: msg.role === 'user' ? 'rgb(123, 123, 123)' : '#28FE14',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: '0',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                color: '#28FE14',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px'
              }}>
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span style={{ color: '#FFFF00' }}>thinking...</span>
              </div>
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
            placeholder=""
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="on"
            spellCheck="true"
            enterKeyHint="send"
            inputMode="text"
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
                  };
                  ['resize','scroll'].forEach(e => vv.addEventListener(e, set));
                  set();
                } else {
                  window.addEventListener('focusin', () =>
                    document.documentElement.style.setProperty('--kb','12px'));
                  window.addEventListener('focusout', () =>
                    document.documentElement.style.setProperty('--kb','0px'));
                }
              })();
            `
          }}
        />
      </div>
    </>
  )
}