import { useState } from 'react'

export default function QuizCard({ question, index, onAnswer, selectedIndex, showResult, correctIndex }) {
  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--primary)', marginRight: '8px' }}>Q{index + 1}.</span>
        {question.question}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {question.options.map((opt, i) => {
          let bg     = 'var(--bg)'
          let border = 'var(--border)'
          let color  = 'var(--text)'

          if (showResult) {
            if (i === correctIndex) {
              bg = '#F0FDF4'; border = '#10B981'; color = '#065F46'
            } else if (i === selectedIndex && i !== correctIndex) {
              bg = '#FEF2F2'; border = '#EF4444'; color = '#991B1B'
            }
          } else if (i === selectedIndex) {
            bg = 'var(--primary-light)'; border = '#2563EB'; color = '#1D4ED8'
          }

          return (
            <div
              key={i}
              onClick={() => !showResult && onAnswer(i)}
              style={{
                padding: '11px 14px', borderRadius: '8px',
                border: `1px solid ${border}`, background: bg,
                color, fontSize: '14px', cursor: showResult ? 'default' : 'pointer',
                transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                border: `1px solid ${border}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', fontWeight: '600',
              }}>
                {showResult && i === correctIndex ? '✓'
                  : showResult && i === selectedIndex ? '✗'
                  : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          )
        })}
      </div>

      {showResult && question.explanation && (
        <div style={{
          marginTop: '12px', padding: '10px 14px', background: '#FFF9EC',
          borderLeft: '3px solid #F59E0B', borderRadius: '0 8px 8px 0',
          fontSize: '13px', color: '#78450A', lineHeight: 1.5,
        }}>
          💡 {question.explanation}
        </div>
      )}
    </div>
  )
}
