import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o-mini')
  const [showProviders, setShowProviders] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    error
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `What can I help you with?`
      }
    ],
    body: {
      provider: selectedProvider
    },
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })
  
  const providers = [
    { id: 'gpt-4o-mini', name: 'Nexus-4 Spinner', speed: 'Spinner Class', cost: 'Low Nuyen' },
    { id: 'gpt-4o', name: 'Nexus-4', speed: 'Off-World Model', cost: 'High Nuyen' },
    { id: 'gpt-3.5-turbo', name: 'Nexus-3 Turbo', speed: 'Street Mod', cost: 'Very Low Nuyen' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCommand = (command) => {
    // Set the input value to the command
    handleInputChange({ target: { value: command } })
    
    // Submit it after a brief delay so the UI updates
    setTimeout(() => {
      const fakeEvent = {
        preventDefault: () => {},
      }
      handleSubmit(fakeEvent)
    }, 50)
  }

  const handlePageClick = (e) => {
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
          borderBottom: '0.5px solid #808080',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ color: '#28FE14', fontSize: '12px', whiteSpace: 'nowrap' }}>
              DonnySmith {new Date().toDateString()} {new Date().toTimeString().split(' ')[0]}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Provider Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProviders(!showProviders)}
                style={{
                  background: '#000000',
                  border: '1px solid #808080',
                  color: '#28FE14',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {providers.find(p => p.id === selectedProvider)?.name}
                <span style={{ fontSize: '14px' }}>▼</span>
              </button>
              
              {showProviders && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: '#000000',
                  border: '1px solid #808080',
                  borderRadius: '4px',
                  minWidth: '160px',
                  zIndex: 1000
                }}>
                  {providers.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setSelectedProvider(provider.id)
                        setShowProviders(false)
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        border: 'none',
                        background: selectedProvider === provider.id ? '#264F78' : 'transparent',
                        color: '#28FE14',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <div>{provider.name}</div>
                      <div style={{ fontSize: '14px', color: '#C0C0C0' }}>
                        {provider.speed} • {provider.cost}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
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
              {msg.id !== 'welcome' && (
                <div style={{ 
                  color: '#28FE14',
                  marginBottom: '1px',
                  fontSize: '12px'
                }}>
                  {msg.role === 'user' ? 'user@terminal ~ $' : 'assistant@donnysmith ~ $'}
                </div>
              )}
              <div style={{
                color: '#28FE14',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: msg.id === 'welcome' ? '0' : '12px',
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
                marginBottom: '1px',
                fontSize: '12px'
              }}>
                assistant@donnysmith ~ $
              </div>
              <div style={{
                color: '#28FE14',
                paddingLeft: '12px',
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
                error@donnysmith ~ $
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
          padding: '10px',
          zIndex: 200
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                className={!input ? 'cursor' : ''}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#28FE14',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  padding: '6px 0',
                  caretColor: 'transparent',
                  WebkitAppearance: 'none',
                  borderRadius: 0,
                  position: 'relative'
                }}
              />
              {!input && (
                <div style={{
                  position: 'absolute',
                  left: '0px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#38FE27',
                  fontSize: '12px',
                  animation: 'blink 1s infinite',
                  pointerEvents: 'none',
                  fontFamily: 'inherit'
                }}>
                  █
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'transparent',
                border: 'none',
                color: input.trim() ? '#28FE14' : '#666666',
                fontSize: '16px',
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