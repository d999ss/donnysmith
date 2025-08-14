import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "👋 Hi there! I'm Donny's AI assistant. I can tell you about his digital branding work, creative projects, and help connect you with him. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef(null)

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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message, 
        timestamp: new Date() 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Connection error - please try again!', 
        timestamp: new Date() 
      }])
    } finally {
      setIsLoading(false)
    }
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
        <title>Donny Smith - AI Assistant</title>
        <meta name="description" content="Chat with Donny's AI assistant to learn about his digital branding work and get in touch." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background gradient that follows mouse */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent)`,
          pointerEvents: 'none',
          transition: 'background 0.3s ease'
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
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Donny Smith
              </h1>
              <p style={{
                margin: '2px 0 0 0',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontWeight: '400'
              }}>
                Digital Branding & Creative Technology
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '300',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ffffff, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}>
              Meet My AI Assistant
            </div>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Chat with my AI to learn about my work in digital branding, creative projects, 
              and how we might collaborate. It knows my background and can help connect us.
            </p>
          </div>

          {/* Chat Interface */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Messages */}
            <div style={{ 
              height: '500px', 
              overflowY: 'auto', 
              padding: '24px',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
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
                      ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: msg.role === 'assistant' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '15px',
                      lineHeight: '1.5',
                      fontWeight: '400'
                    }}>
                      {msg.content}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      opacity: 0.6,
                      marginTop: '6px',
                      fontWeight: '300'
                    }}>
                      {msg.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                    placeholder="Ask about my work, experience, or how to get in touch..."
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
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>Powered by GPT-4</span>
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
        `}</style>
      </div>
    </>
  )
}