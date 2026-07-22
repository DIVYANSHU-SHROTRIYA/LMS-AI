import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../../services/aiService'

export default function AIChatbot({ courseId, courseName }) {
  const [messages, setMessages]   = useState([
    { role: 'assistant', content: `Hi! I'm your AI tutor for **${courseName || 'this course'}**. Ask me anything about the course content! 🤖` }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Build history for context (exclude first greeting)
      const history = messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }))

      const res = await chatWithAI({ message: text, courseId, conversationHistory: history })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again in a moment.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
        <span style={{ fontWeight: '700', fontSize: '15px' }}>AI Tutor</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto', background: 'var(--bg)', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          {courseName || 'Course'}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: '10px 14px', borderRadius: '10px',
              fontSize: '13px', lineHeight: 1.6,
              maxWidth: '88%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#2563EB' : 'var(--primary-light)',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              borderBottomRightRadius: msg.role === 'user' ? '2px' : '10px',
              borderBottomLeftRadius:  msg.role === 'user' ? '10px' : '2px',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{
            padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
            background: 'var(--primary-light)', alignSelf: 'flex-start',
            color: 'var(--muted)', maxWidth: '88%',
          }}>
            <span style={{ display: 'flex', gap: '4px' }}>
              <span style={{ animation: 'bounce 1s infinite 0ms'    }}>●</span>
              <span style={{ animation: 'bounce 1s infinite 150ms'  }}>●</span>
              <span style={{ animation: 'bounce 1s infinite 300ms'  }}>●</span>
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about this course..."
          style={{
            flex: 1, padding: '9px 14px', border: '1px solid var(--border)',
            borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
            outline: 'none', background: 'var(--bg)',
          }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: '36px', height: '36px', background: '#2563EB',
            border: 'none', borderRadius: '8px', color: '#fff',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? .5 : 1,
            fontSize: '15px', flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(.8); opacity: .5; }
          40%            { transform: scale(1);  opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
