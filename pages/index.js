import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o-mini')
  const [showProviders, setShowProviders] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const messagesEndRef = useRef(null)
  
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
        content: `donnysmith@terminal ~ $ whoami
Donny Smith - Executive Creative Director
Bored Optimism™ | Park City, UT
@donnysmith on X | Joined February 2008

donnysmith@terminal ~ $ cat ~/company.txt
@makebttr - A Brand & Digital Experience Company
Helping ambitious teams design a better future.
makebttr.com

donnysmith@terminal ~ $ cat ~/philosophy.txt
"An object in motion stays in motion."

donnysmith@terminal ~ $ ls -la services/
drwxr-xr-x  brand-strategy/
drwxr-xr-x  digital-experiences/
drwxr-xr-x  creative-direction/
drwxr-xr-x  team-consulting/

donnysmith@terminal ~ $ echo "Ready to help. What ambitious project can we build for you?"`
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
            display: inline-block;
            animation: blink 1s infinite;
            color: #D4D4D4;
            margin-left: 2px;
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
      
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#00FF00',
        fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
        fontSize: '13px',
        lineHeight: '1.5',
        padding: 0,
        margin: 0
      }}>
        
        {/* Terminal Header Bar */}
        <div style={{
          background: '#000000',
          borderBottom: '1px solid #808080',
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
            <span style={{ color: '#00FF00', fontSize: '13px', whiteSpace: 'nowrap' }}>donnysmith@terminal ~ $</span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Provider Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProviders(!showProviders)}
                style={{
                  background: '#000000',
                  border: '1px solid #808080',
                  color: '#00FF00',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '13px',
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
                        color: '#00FF00',
                        cursor: 'pointer',
                        fontSize: '13px'
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
          {/* Login message */}
          <div style={{ 
            color: '#00FF00', 
            fontSize: '13px', 
            marginBottom: '8px',
            lineHeight: '1.1'
          }}>
            Last login: {new Date().toDateString()} {new Date().toTimeString().split(' ')[0]}
          </div>
          
          {/* Command shortcuts */}
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '4px'
          }}>
            <div style={{ 
              color: '#808080', 
              fontSize: '12px',
              marginBottom: '8px'
            }}>
              Quick commands:
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['/portfolio', '/contact', '/philosophy', '/clients'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #404040',
                    color: '#00FF00',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      background: '#2a2a2a',
                      borderColor: '#4EC9B0'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2a2a2a'
                    e.target.style.borderColor = '#4EC9B0'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#1a1a1a'
                    e.target.style.borderColor = '#404040'
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          {messages.map((msg, i) => (
            <div key={msg.id || i} style={{ marginBottom: '8px' }}>
              <div style={{ 
                color: '#00FF00',
                marginBottom: '1px',
                fontSize: '13px'
              }}>
                {msg.role === 'user' ? 'user@terminal ~ $' : 'assistant@donnysmith ~ $'}
              </div>
              <div style={{
                color: '#00FF00',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: '12px',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ 
                color: '#00FF00',
                marginBottom: '1px',
                fontSize: '13px'
              }}>
                assistant@donnysmith ~ $
              </div>
              <div style={{
                color: '#00FF00',
                paddingLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px'
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
                fontSize: '13px'
              }}>
                error@donnysmith ~ $
              </div>
              <div style={{
                color: '#F44747',
                paddingLeft: '12px',
                fontSize: '13px'
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
          border: '1px solid #808080',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.5)',
          zIndex: 200
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00FF00', fontSize: '13px', flexShrink: 0 }}>
              {'>'}
            </span>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
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
                  color: '#00FF00',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  padding: '6px 0',
                  caretColor: '#00FF00',
                  WebkitAppearance: 'none',
                  borderRadius: 0
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: input.trim() ? '#264F78' : 'transparent',
                border: '1px solid #808080',
                borderRadius: '4px',
                color: input.trim() ? '#4EC9B0' : '#808080',
                fontSize: '13px',
                fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                cursor: input.trim() ? 'pointer' : 'default',
                padding: '6px 12px',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </>
  )
}