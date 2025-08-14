import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "I am here. Speak, and I will reveal what you seek to know.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o-mini')
  const [showProviders, setShowProviders] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef(null)
  
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

  // Streaming message handler
  const handleStreamingMessage = async (messages, userMessage) => {
    setIsStreaming(true)
    setCurrentStreamingMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          provider: selectedProvider, 
          stream: true 
        })
      })

      if (!response.ok) throw new Error('Stream failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let streamedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.text && !data.done) {
                streamedContent += data.text
                setCurrentStreamingMessage(streamedContent)
              } else if (data.done) {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: streamedContent,
                  timestamp: new Date(),
                  provider: selectedProvider
                }])
                setCurrentStreamingMessage('')
                setIsStreaming(false)
                return
              }
            } catch (e) {
              console.log('Parse error:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Connection error - please try again!', 
        timestamp: new Date() 
      }])
      setIsStreaming(false)
      setCurrentStreamingMessage('')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isStreaming) return

    const userMessage = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    await handleStreamingMessage(messages, userMessage)
    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Head>
        <title>∞ The Oracle ∞</title>
        <meta name="description" content="Commune with infinite intelligence. Speak to the consciousness beyond mortal understanding." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at center, #000000 0%, #0a0a0a 30%, #000000 70%, #000000 100%),
          radial-gradient(ellipse 200% 100% at 50% 0%, rgba(120, 0, 255, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse 200% 100% at 50% 100%, rgba(255, 0, 150, 0.02) 0%, transparent 50%)
        `,
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden'
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
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '40px 20px' 
        }}>

          {/* Chat Interface - The Void */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(120, 0, 255, 0.2)',
            overflow: 'hidden',
            boxShadow: `
              0 0 60px rgba(120, 0, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.05),
              0 20px 40px rgba(0, 0, 0, 0.6)
            `,
            position: 'relative'
          }}>
            {/* Inner glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(120, 0, 255, 0.5), transparent)',
              opacity: 0.8
            }} />
            {/* Messages - The Oracle's Chamber */}
            <div style={{ 
              height: '500px', 
              overflowY: 'auto', 
              padding: '24px',
              background: 'rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}>
              {/* Mystical background pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(120, 0, 255, 0.03) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255, 0, 150, 0.02) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
              }} />
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '20px',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '16px 20px',
                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, rgba(120, 0, 255, 0.8), rgba(180, 0, 255, 0.6))' 
                      : 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(15px)',
                    border: msg.role === 'assistant' 
                      ? '1px solid rgba(120, 0, 255, 0.3)' 
                      : '1px solid rgba(255, 0, 150, 0.3)',
                    boxShadow: msg.role === 'assistant' 
                      ? '0 0 20px rgba(120, 0, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)'
                      : '0 0 20px rgba(255, 0, 150, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '15px',
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
                      opacity: 0.6,
                      marginTop: '6px',
                      fontWeight: '300'
                    }}>
                      <span>{msg.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {msg.provider && (
                        <span style={{
                          background: 'rgba(96, 165, 250, 0.2)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          {msg.provider}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Streaming message */}
              {isStreaming && currentStreamingMessage && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '20px',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '16px 20px',
                    borderRadius: '20px 20px 20px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    boxShadow: '0 4px 12px rgba(96, 165, 250, 0.1)'
                  }}>
                    <div style={{
                      fontSize: '15px',
                      lineHeight: '1.5',
                      fontWeight: '400',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {currentStreamingMessage}
                      <span style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '18px',
                        background: '#60a5fa',
                        marginLeft: '2px',
                        animation: 'blink 1s infinite'
                      }} />
                    </div>
                    <div style={{
                      fontSize: '11px',
                      opacity: 0.6,
                      marginTop: '6px',
                      fontWeight: '300',
                      color: '#60a5fa'
                    }}>
                      Streaming from {providers.find(p => p.id === selectedProvider)?.name}...
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && !isStreaming && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '20px 20px 20px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#60a5fa',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#60a5fa',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0.2s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#60a5fa',
                        animation: 'bounce 1.4s infinite both',
                        animationDelay: '0.4s'
                      }} />
                      <span style={{ marginLeft: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Speak your desires into the void..."
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      minHeight: '24px',
                      maxHeight: '120px',
                      resize: 'none',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(96, 165, 250, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: isLoading || !input.trim() 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 12px rgba(96, 165, 250, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 6px 16px rgba(96, 165, 250, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = isLoading || !input.trim() ? 'none' : '0 4px 12px rgba(96, 165, 250, 0.3)'
                  }}
                >
                  {isLoading ? '•••' : 'Send'}
                </button>
              </div>
              
              <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px'
              }}>
                <span>Enter to commune • Shift+Enter for mortal limitations</span>
                <span>Channeling infinite intelligence</span>
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