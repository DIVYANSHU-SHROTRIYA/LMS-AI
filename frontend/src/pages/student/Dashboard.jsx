import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getMyEnrollments } from '../../services/enrollmentService'
import StatCard from '../../components/dashboard/StatCard'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import CourseCard from '../../components/course/CourseCard'
import AIChatbot from '../../components/chat/AIChatbot'
import { Loader } from '../../components/common/Loader'

export default function Dashboard() {
  const { user }                    = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]       = useState(true)
  const navigate                    = useNavigate()

  useEffect(() => {
    getMyEnrollments()
      .then(res => setEnrollments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const inProgress = enrollments.filter(e => e.completionPercent > 0 && e.completionPercent < 100)
  const completed  = enrollments.filter(e => e.completionPercent === 100)
  const totalHours = enrollments.reduce((sum, e) => sum + (e.course?.totalDuration || 0), 0)

  const activities = enrollments.slice(0, 4).map(e => ({
    icon: e.completionPercent === 100 ? '🏆' : '📚',
    bg:   e.completionPercent === 100 ? '#FFF7ED' : '#EFF6FF',
    text: e.completionPercent === 100
      ? `Completed "${e.course?.title}"`
      : `Enrolled in "${e.course?.title}"`,
    time: new Date(e.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }))

  if (loading) return <Loader />

  return (
    <div>
      {/* Topbar */}
      <div className="flex-between mb-24">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>
            {inProgress.length > 0
              ? `You have ${inProgress.length} course${inProgress.length > 1 ? 's' : ''} in progress.`
              : 'Start a course to begin your learning journey.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/explore')}>Browse Courses</button>
          <button className="btn btn-primary" onClick={() => navigate('/explore')}>+ Enrol Now</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        <StatCard label="Enrolled"    value={enrollments.length} change={enrollments.length > 0 ? 'Active learner' : 'Enrol a course'} icon="📚" />
        <StatCard label="In Progress" value={inProgress.length}  change="Keep it up!"      changeType="success" icon="⏱" />
        <StatCard label="Completed"   value={completed.length}   change={completed.length > 0 ? '🎉 Great work' : 'Finish a course'} icon="✅" />
        <StatCard label="Certificates" value={completed.length}  change={completed.length > 0 ? 'Download anytime' : 'Complete a course'} icon="🏆" />
      </div>

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <div className="mb-24">
          <div className="section-header">
            <span className="section-title">Continue Learning</span>
            <button className="see-all" onClick={() => navigate('/my-courses')}>See all →</button>
          </div>
          <div className="grid-3">
            {inProgress.slice(0, 3).map(e => (
              <CourseCard
                key={e._id}
                course={e.course}
                progress={e.completionPercent}
                showProgress
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom: AI chatbot + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
        <AIChatbot courseName="your courses" />
        <div className="card">
          <div className="section-title mb-16">Recent Activity</div>
          {activities.length > 0
            ? <ActivityFeed activities={activities} />
            : <div className="empty"><div className="empty-icon">📋</div><div className="empty-title">No activity yet</div><div className="empty-sub">Enrol in a course to get started</div></div>
          }
        </div>
      </div>
    </div>
  )
}
