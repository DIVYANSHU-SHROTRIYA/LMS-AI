export default function LessonSidebar({ course, progress = [], currentLessonId, onSelectLesson }) {
  const completedIds = new Set(
    progress.filter(p => p.completedAt).map(p => p.lessonId)
  )

  return (
    <div style={{
      width: '300px', flexShrink: 0, background: 'var(--white)',
      border: '1px solid var(--border)', borderRadius: '12px',
      overflow: 'hidden', height: 'fit-content', maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '14px' }}>
        Course Content
      </div>

      {course?.sections?.map((section, si) => (
        <div key={section._id}>
          {/* Section header */}
          <div style={{
            padding: '10px 16px', background: 'var(--bg)',
            fontSize: '12px', fontWeight: '600', color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.05em',
            borderBottom: '1px solid var(--border)',
          }}>
            {si + 1}. {section.title}
          </div>

          {/* Lessons */}
          {section.lessons?.map((lesson, li) => {
            const isCompleted = completedIds.has(lesson._id)
            const isCurrent   = lesson._id === currentLessonId

            return (
              <div
                key={lesson._id}
                onClick={() => onSelectLesson(section._id, lesson)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '12px 16px', cursor: 'pointer',
                  background: isCurrent ? 'var(--primary-light)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  borderLeft: isCurrent ? '3px solid #2563EB' : '3px solid transparent',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg)' }}
                onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', marginTop: '1px',
                  background: isCompleted ? '#10B981' : isCurrent ? '#2563EB' : 'var(--border)',
                  color: isCompleted || isCurrent ? '#fff' : 'var(--muted)',
                }}>
                  {isCompleted ? '✓' : `${li + 1}`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: isCurrent ? '600' : '500',
                    color: isCurrent ? '#2563EB' : 'var(--text)',
                    lineHeight: 1.4,
                  }}>
                    {lesson.title}
                  </div>
                  {lesson.duration > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                      ⏱ {lesson.duration} min
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
