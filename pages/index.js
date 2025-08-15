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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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
            body, div, span, button, input[type="text"] {
              font-size: 16px !important;
            }
            .mobile-hide {
              display: none !important;
            }
            .mobile-fullscreen {
              height: 100vh !important;
              padding-top: 12px !important;
            }
            .mobile-caret {
              font-size: 16px !important;
              line-height: 1.2 !important;
            }
          }
        `}
        {`
          /* iOS-style input field with auto-sizing textarea */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            clip: rect(0 0 0 0);
            overflow: hidden;
            white-space: nowrap;
          }

          .input-bar {
            position: sticky;
            bottom: 0;
            padding: 8px 16px calc(8px + env(safe-area-inset-bottom));
            background: rgba(0, 0, 0, .85);
            backdrop-filter: saturate(180%) blur(12px);
            display: flex;
            align-items: center;
            gap: 8px;
            border-top: 1px solid rgba(255,255,255,.06);
            z-index: 10;
          }

          .addon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 0;
            color: #28FE14;
            font-size: 16px;
            border-radius: 20px;
          }

          .field-wrap {
            flex: 1;
            display: flex;
          }

          .input-field {
            flex: 1;
            resize: none;
            overflow: hidden;
            font: 16px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #fff;
            background: #1c1c1e;
            border: 1px solid #3a3a3c;
            border-radius: 22px;
            padding: 10px 14px;
            outline: none;
          }

          .input-field:focus {
            border-color: #28FE14;
            box-shadow: 0 0 0 2px rgba(40,254,20,.3);
          }

          .send-btn {
            height: 40px;
            min-width: 40px;
            padding: 0 14px;
            border: 0;
            border-radius: 22px;
            color: #000;
            background: #28FE14;
            font-weight: 600;
            cursor: pointer;
          }

          .send-btn:active {
            background: #20CC10;
          }

          .send-btn[disabled] {
            opacity: .5;
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
          paddingBottom: '100px',
          background: '#000000',
          WebkitOverflowScrolling: 'touch'
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
          <div className="field-wrap">
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
            />
          </div>

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
      </div>
    </>
  )
}