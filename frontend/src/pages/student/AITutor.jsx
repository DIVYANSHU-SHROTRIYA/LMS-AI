import { useState, useEffect } from 'react'
import { getMyEnrollments } from '../../services/enrollmentService'
import AIChatbot from '../../components/chat/AIChatbot'
import { Loader } from '../../components/common/Loader'

export default function AITutor() {
  const [enrollments, setEnrollments] = useState([])
  const [selected, setSelected]       = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    getMyEnrollments()
      .then(res => {
        setEnrollments(res.data)
        if (res.data[0]) setSelected(res.data[0])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-24">
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>AI Tutor 🤖</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>
          Ask questions about any of your enrolled courses
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🤖</div>
          <div className="empty-title">No courses enrolled</div>
          <div className="empty-sub">Enrol in a course to use the AI Tutor</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
          {/* Course selector */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '12px' }}>
              Select Course
            </div>
            {enrollments.map(e => (
              <div
                key={e._id}
                onClick={() => setSelected(e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                  background: selected?._id === e._id ? 'var(--primary-light)' : 'transparent',
                  border: `1px solid ${selected?._id === e._id ? '#BFDBFE' : 'transparent'}`,
                  marginBottom: '6px', transition: 'all .15s',
                }}
              >
                <span style={{ fontSize: '20px' }}>📚</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: selected?._id === e._id ? '#2563EB' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.course?.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {e.completionPercent}% complete
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat */}
          <div>
            {selected
              ? <AIChatbot courseId={selected.course?._id} courseName={selected.course?.title} />
              : <div className="empty"><div className="empty-title">Select a course to start</div></div>
            }
            <div style={{ marginTop: '12px', background: 'var(--primary-light)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1D4ED8' }}>
              💡 <strong>Tip:</strong> The AI only answers questions related to your selected course. Be specific — "explain useEffect with an example" gets better answers than "explain hooks".
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
