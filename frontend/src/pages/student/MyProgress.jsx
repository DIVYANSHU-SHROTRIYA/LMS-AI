import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyEnrollments } from '../../services/enrollmentService'
import { getCourseAttempts } from '../../services/quizService'
import ProgressBar from '../../components/course/ProgressBar'
import { Loader } from '../../components/common/Loader'

export default function MyProgress() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)
  const navigate                      = useNavigate()

  useEffect(() => {
    getMyEnrollments()
      .then(res => setEnrollments(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const totalCourses   = enrollments.length
  const completed      = enrollments.filter(e => e.completionPercent === 100).length
  const inProgress     = enrollments.filter(e => e.completionPercent > 0 && e.completionPercent < 100).length
  const avgProgress    = totalCourses
    ? Math.round(enrollments.reduce((sum, e) => sum + e.completionPercent, 0) / totalCourses)
    : 0

  return (
    <div>
      <div className="mb-24">
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>My Progress</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>
          Track your learning journey across all courses
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid-4 mb-24">
        {[
          { label: 'Total Enrolled', value: totalCourses, icon: '📚', color: '#2563EB' },
          { label: 'Completed',      value: completed,    icon: '✅', color: '#10B981' },
          { label: 'In Progress',    value: inProgress,   icon: '⏳', color: '#F59E0B' },
          { label: 'Avg Progress',   value: `${avgProgress}%`, icon: '📊', color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Course progress list */}
      {enrollments.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No courses yet</div>
          <div className="empty-sub">Enrol in a course to track your progress</div>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/explore')}>
            Browse Courses
          </button>
        </div>
      ) : (
        <div>
          <div className="section-title mb-16">Course Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {enrollments.map(e => {
              const course      = e.course
              const completedL  = e.progress?.filter(p => p.completedAt).length || 0
              const totalL      = course?.totalLessons || 0

              return (
                <div key={e._id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Thumbnail */}
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0, overflow: 'hidden' }}>
                      {course?.thumbnail
                        ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '📚'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{course?.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                        {completedL} of {totalL} lessons completed
                        {e.completedAt && (
                          <span style={{ color: '#10B981', fontWeight: '600', marginLeft: '8px' }}>
                            ✅ Completed {new Date(e.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <ProgressBar
                        percent={e.completionPercent}
                        showLabel={false}
                        height={6}
                        color={e.completionPercent === 100 ? '#10B981' : '#2563EB'}
                      />
                    </div>

                    {/* Percent + action */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: e.completionPercent === 100 ? '#10B981' : '#2563EB' }}>
                        {e.completionPercent}%
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: '8px' }}
                        onClick={() => navigate(`/learn/${course?._id}`)}
                      >
                        {e.completionPercent === 100 ? 'Review' : 'Continue →'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
