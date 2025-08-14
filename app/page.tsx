'use client'

import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Donny's AI assistant. Ask me about his work!" }
  ])
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, having connection issues!' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Donny Smith AI Assistant</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl mb-4">Chat with my AI assistant</h2>
          
          <div className="h-80 overflow-y-auto mb-4 space-y-3 bg-slate-700 rounded p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-600 ml-12' : 'bg-slate-600 mr-12'}`}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </div>
            ))}
            {isLoading && <div className="text-slate-400">AI is typing...</div>}
          </div>
          
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Donny's work, experience, or how to contact him..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-6 py-2 rounded text-white"
            >
              Send
            </button>
          </div>
        </div>

        <div className="text-center text-slate-400">
          <p>Powered by GPT-4 • <a href="https://github.com/d999ss/donnysmith" className="text-blue-400">Open Source</a></p>
        </div>
      </div>
    </div>
  )
}