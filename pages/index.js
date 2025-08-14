import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Donny's AI assistant. Ask me about his digital branding work!" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error - please try again!' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '30px' }}>
          Donny Smith AI Assistant
        </h1>
        
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Chat with my AI assistant</h2>
          
          <div style={{ 
            height: '300px', 
            overflowY: 'auto', 
            backgroundColor: '#334155', 
            borderRadius: '8px', 
            padding: '16px',
            marginBottom: '16px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: msg.role === 'user' ? '#2563eb' : '#475569',
                marginLeft: msg.role === 'user' ? '60px' : '0',
                marginRight: msg.role === 'user' ? '0' : '60px'
              }}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </div>
            ))}
            {isLoading && <div style={{color: '#94a3b8'}}>AI is thinking...</div>}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Donny's work, experience, or how to contact him..."
              style={{
                flex: 1,
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                fontSize: '14px'
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: isLoading || !input.trim() ? '#475569' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          <p>
            Powered by GPT-4 • 
            <a href="https://github.com/d999ss/donnysmith" style={{color: '#60a5fa', marginLeft: '8px'}}>
              Open Source
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}