import { useNavigate } from 'react-router-dom'

export default function QuizResult({ result, onRetry, courseId }) {
  const navigate = useNavigate()
  const isPassed = result.passed
  const color    = isPassed ? '#10B981' : '#EF4444'
  const bg       = isPassed ? '#F0FDF4' : '#FEF2F2'

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>
          {isPassed ? '🎉' : '😅'}
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          {isPassed ? 'Quiz Passed!' : 'Not Quite There'}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '28px' }}>
          {isPassed
            ? 'Great job! Keep going with the next lesson.'
            : 'Review the material and try again.'}
        </div>

        {/* Score circle */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: bg, border: `4px solid ${color}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 28px',
        }}>
          <span style={{ fontSize: '26px', fontWeight: '800', color }}>{result.score}%</span>
          <span style={{ fontSize: '11px', color, fontWeight: '500' }}>Score</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Correct',   value: result.correctAnswers,                         color: '#10B981' },
            { label: 'Wrong',     value: result.totalQuestions - result.correctAnswers,  color: '#EF4444' },
            { label: 'Total',     value: result.totalQuestions,                          color: '#2563EB' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weak topics */}
        {result.weakTopics?.length > 0 && (
          <div style={{ background: '#FFF9EC', borderRadius: '8px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#78450A', marginBottom: '8px' }}>
              🤖 AI detected weak topics:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.weakTopics.map(t => (
                <span key={t} style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onRetry}>Try Again</button>
          <button className="btn btn-primary" onClick={() => navigate(`/learn/${courseId}`)}>
            Back to Course
          </button>
        </div>
      </div>
    </div>
  )
}
