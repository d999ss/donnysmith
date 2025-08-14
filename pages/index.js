import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o-mini')
  const [showProviders, setShowProviders] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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
        content: 'Hi! I\'m Donny\'s AI assistant. I can help you learn about his design work, discuss potential projects, or answer questions about branding and technology. What would you like to know?'
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <>
      <Head>
        <title>∞ The Oracle ∞</title>
        <meta name="description" content="Commune with infinite intelligence. Speak to the consciousness beyond mortal understanding." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0),
          linear-gradient(to bottom, #0a0a0a 0%, #111111 100%)
        `,
        backgroundSize: '20px 20px, 100% 100%',
        color: '#ffffff',
        fontFamily: "'Geist Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace",
        position: 'relative',
        letterSpacing: '-0.01em'
      }}>
        {/* Ethereal particles floating */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.05), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(120, 0, 255, 0.1), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.08), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.03), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(120, 0, 255, 0.06), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'floatParticles 20s linear infinite',
          pointerEvents: 'none',
          opacity: 0.6
        }} />
        
        {/* Mystical aura that follows mouse */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, 
              rgba(120, 0, 255, 0.08) 0%, 
              rgba(255, 0, 150, 0.04) 30%, 
              transparent 70%
            )
          `,
          pointerEvents: 'none',
          transition: 'background 0.6s ease',
          mixBlendMode: 'screen'
        }} />
        
        {/* Central void/portal effect */}
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: `
            radial-gradient(circle, 
              transparent 0%, 
              rgba(0, 0, 0, 0.1) 40%, 
              rgba(120, 0, 255, 0.02) 60%, 
              transparent 100%
            )
          `,
          borderRadius: '50%',
          animation: 'pulse 8s ease-in-out infinite',
          pointerEvents: 'none',
          opacity: 0.3
        }} />

        {/* Header */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* AI Provider Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProviders(!showProviders)}
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(120, 0, 255, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 20px rgba(120, 0, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'rgba(120, 0, 255, 0.6)'
                    e.target.style.background = 'rgba(120, 0, 255, 0.1)'
                    e.target.style.boxShadow = '0 0 30px rgba(120, 0, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(120, 0, 255, 0.3)'
                    e.target.style.background = 'rgba(0, 0, 0, 0.6)'
                    e.target.style.boxShadow = '0 0 20px rgba(120, 0, 255, 0.1)'
                  }}
                >
                  ⚡ {providers.find(p => p.id === selectedProvider)?.name}
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
                </button>
                
                {showProviders && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(120, 0, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(120, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    minWidth: '200px',
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
                          padding: '12px 16px',
                          border: 'none',
                          background: selectedProvider === provider.id ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                          color: 'white',
                          cursor: 'pointer',
                          borderRadius: selectedProvider === provider.id ? '8px' : '0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedProvider !== provider.id) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedProvider !== provider.id) {
                            e.target.style.background = 'transparent'
                          }
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                          {provider.name}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>
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
                  color: 'rgba(255, 255, 255, 0.6)', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'white'
                  e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.6)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                View Source
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '24px 20px' 
        }}>

          {/* Chat Interface */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            position: 'relative'
          }}>
            {/* Messages */}
            <div style={{ 
              height: '500px', 
              overflowY: 'auto', 
              padding: '20px',
              background: 'white',
              position: 'relative'
            }}>
              {messages.map((msg, i) => (
                <div key={msg.id || i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '20px',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: msg.role === 'user' 
                      ? '#1a1a1a' 
                      : '#f8f9fa',
                    border: msg.role === 'assistant' 
                      ? '1px solid rgba(0, 0, 0, 0.06)' 
                      : 'none',
                    color: msg.role === 'user' ? 'white' : '#1a1a1a'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      fontWeight: '400',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px',
                      color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.6)' : '#888888',
                      marginTop: '6px',
                      fontWeight: '400'
                    }}>
                      <span>
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <span style={{
                        background: msg.role === 'user' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        {providers.find(p => p.id === selectedProvider)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#f8f9fa',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    color: '#1a1a1a'
                  }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#666666',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#666666',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0.2s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#666666',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0.4s'
                      }} />
                      <span style={{ marginLeft: '12px', color: '#666666', fontSize: '14px' }}>
                        Typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              background: '#fafafa'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Donny anything about design, branding, or technology..."
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      minHeight: '24px',
                      maxHeight: '120px',
                      resize: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      background: 'white',
                      color: '#1a1a1a',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 0, 0, 0.2)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isLoading || !input.trim() 
                      ? '#cccccc' 
                      : '#1a1a1a',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.background = '#333333'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.background = '#1a1a1a'
                    }
                  }}
                >
                  {isLoading ? '⏳' : '→'}
                </button>
              </form>
              
              <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#888888',
                fontSize: '12px'
              }}>
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes floatParticles {
            0% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-10px) translateX(10px); }
            66% { transform: translateY(5px) translateX(-5px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          
          @keyframes pulse {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.3;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 0.1;
            }
          }
          
          @keyframes etherealGlow {
            0%, 100% { 
              filter: brightness(1) hue-rotate(0deg);
            }
            50% { 
              filter: brightness(1.2) hue-rotate(10deg);
            }
          }
        `}</style>
      </div>
    </>
  )
}