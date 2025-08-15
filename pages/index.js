import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

export default function Home() {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  
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
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
            body, div, span, button {
              font-size: 13px !important;
            }
            input[type="text"] {
              font-size: 16px !important;
            }
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
        <div style={{
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
        <div style={{
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

        {/* Terminal Input */}
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          right: '10px',
          background: '#000000',
          border: 'max(1px, 0.5px) solid rgba(128, 128, 128, 0.5)',
          borderRadius: '4px',
          padding: '4px 8px',
          zIndex: 200
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#28FE14', fontSize: '12px' }}>{'>'}</span>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder=""
                disabled={isLoading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#28FE14',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  padding: '0',
                  caretColor: '#38FE27',
                  WebkitAppearance: 'none',
                  borderRadius: 0,
                  position: 'relative'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'transparent',
                border: 'none',
                color: input.trim() ? '#28FE14' : '#666666',
                fontSize: '12px',
                cursor: input.trim() ? 'pointer' : 'default',
                padding: '6px',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ↑
            </button>
          </form>
        </div>
      </div>
    </>
  )
}