import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o-mini')
  const [showProviders, setShowProviders] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading 
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `donnysmith@terminal ~ $ whoami
Donny Smith - Brand strategist, digital designer, AI enthusiast

donnysmith@terminal ~ $ cat ~/about.txt
Building compelling visual identities and strategic brands since 2010.
Currently exploring the intersection of AI and creative workflows.
Available for brand strategy, design systems, and automation projects.

donnysmith@terminal ~ $ ls -la services/
drwxr-xr-x  brand-strategy/
drwxr-xr-x  visual-identity/  
drwxr-xr-x  digital-marketing/
drwxr-xr-x  ai-automation/

donnysmith@terminal ~ $ echo "Ready to help. What can I build for you?"`
      }
    ],
    body: {
      provider: selectedProvider
    }
  })
  
  const providers = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', speed: 'Fast', cost: 'Low' },
    { id: 'gpt-4o', name: 'GPT-4o', speed: 'Medium', cost: 'High' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', speed: 'Very Fast', cost: 'Very Low' }
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

  return (
    <>
      <Head>
        <title>donnysmith@terminal ~ $</title>
        <meta name="description" content="Donny Smith - Terminal interface for AI assistant" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          * {
            box-sizing: border-box;
          }
          ::selection {
            background: #1A215E;
            color: #00FF00;
          }
          ::-moz-selection {
            background: #1A215E;
            color: #00FF00;
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
        `}</style>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#00FF00',
        fontFamily: "'Andale Mono', monospace",
        fontSize: '14px',
        lineHeight: '1.6',
        padding: 0,
        margin: 0
      }}>
        
        {/* Terminal Header Bar */}
        <div style={{
          background: '#000000',
          borderBottom: '1px solid #808080',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca3f' }} />
            </div>
            <span style={{ color: '#00FF00', marginLeft: '12px' }}>donnysmith@terminal ~ $</span>
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
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {providers.find(p => p.id === selectedProvider)?.name}
                <span style={{ fontSize: '10px' }}>▼</span>
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
                        background: selectedProvider === provider.id ? '#1A215E' : 'transparent',
                        color: '#00FF00',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <div>{provider.name}</div>
                      <div style={{ fontSize: '10px', color: '#C0C0C0' }}>
                        {provider.speed} • {provider.cost} Cost
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <a 
              href="https://github.com/d999ss/donnysmith"
              style={{ 
                color: '#00FFFF',
                textDecoration: 'none',
                fontSize: '12px',
                padding: '4px 8px',
                border: '1px solid #808080',
                borderRadius: '4px'
              }}
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Terminal Content */}
        <div style={{
          height: 'calc(100vh - 100px)',
          overflowY: 'auto',
          padding: '16px',
          paddingBottom: '100px',
          background: '#000000'
        }}>
          {messages.map((msg, i) => (
            <div key={msg.id || i} style={{ marginBottom: '16px' }}>
              <div style={{ 
                color: msg.role === 'user' ? '#FF00FF' : '#00FF00',
                marginBottom: '4px',
                fontSize: '12px'
              }}>
                {msg.role === 'user' ? 'user@terminal ~ $' : 'assistant@donnysmith ~ $'}
              </div>
              <div style={{
                color: '#00FF00',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: '16px'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                color: '#00FF00',
                marginBottom: '4px',
                fontSize: '12px'
              }}>
                assistant@donnysmith ~ $
              </div>
              <div style={{
                color: '#00FF00',
                paddingLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span style={{ color: '#FFFF00' }}>thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Terminal Input */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#000000',
          borderTop: '1px solid #808080',
          padding: '16px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#FF00FF', fontSize: '12px', flexShrink: 0 }}>
              user@terminal ~ $
            </span>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#00FF00',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '4px 0',
                caretColor: '#00FF00'
              }}
            />
            {input.trim() && (
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00FFFF',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                [SEND]
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  )
}