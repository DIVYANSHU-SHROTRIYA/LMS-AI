import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyCourses, deleteCourse, updateCourse } from '../../services/courseService'
import { Loader } from '../../components/common/Loader'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import StatCard from '../../components/dashboard/StatCard'

export default function InstructorDashboard() {
  const { user }              = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('overview')
  const navigate              = useNavigate()

  useEffect(() => {
    getMyCourses()
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await deleteCourse(id)
      setCourses(prev => prev.filter(c => c._id !== id))
      toast.success('Course deleted')
    } catch {
      toast.error('Could not delete course')
    }
  }

  const handleTogglePublish = async (course) => {
    const form = new FormData()
    form.append('isPublished', !course.isPublished)
    try {
      const res = await updateCourse(course._id, form)
      setCourses(prev => prev.map(c => c._id === course._id ? res.data : c))
      toast.success(res.data.isPublished ? 'Course published!' : 'Course unpublished')
    } catch {
      toast.error('Could not update course')
    }
  }

  if (loading) return <Loader />

  const totalStudents = courses.reduce((s, c) => s + (c.enrolledCount || 0), 0)
  const published     = courses.filter(c => c.isPublished)
  const totalLessons  = courses.reduce((s, c) => s + (c.totalLessons || 0), 0)

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Instructor Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/instructor/create')}>+ Create Course</button>
      </div>

      <div className="grid-4 mb-24">
        <StatCard label="Total Courses"  value={courses.length}   icon="📚" change={`${courses.length - published.length} drafts`} />
        <StatCard label="Published"      value={published.length} icon="✅" change="Live courses" changeType="success" />
        <StatCard label="Total Students" value={totalStudents}    icon="👥" change={totalStudents > 0 ? 'Enrolled' : 'Publish a course'} changeType="success" />
        <StatCard label="Total Lessons"  value={totalLessons}     icon="🎬" change="Across all courses" />
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {[{ key: 'overview', label: 'My Courses' }, { key: 'analytics', label: 'Analytics' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '7px 20px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', background: tab === t.key ? '#2563EB' : 'transparent', color: tab === t.key ? '#fff' : 'var(--muted)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          {courses.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📚</div>
              <div className="empty-title">No courses yet</div>
              <div className="empty-sub">Create your first course to get started</div>
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/instructor/create')}>Create Course</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.map(course => (
                <div key={course._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, overflow: 'hidden' }}>
                    {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📚'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{course.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '16px' }}>
                      <span>📂 {course.category}</span>
                      <span>🎬 {course.totalLessons} lessons</span>
                      <span>👥 {course.enrolledCount} students</span>
                    </div>
                  </div>
                  <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-gray'}`}>{course.isPublished ? 'Published' : 'Draft'}</span>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/instructor/courses/${course._id}`)}>✏️ Manage</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/instructor/quiz/${course._id}`)}>📝 Quizzes</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleTogglePublish(course)}>{course.isPublished ? 'Unpublish' : 'Publish'}</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(course._id, course.title)} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {courses.length === 0 ? (
            <div className="empty"><div className="empty-icon">📊</div><div className="empty-title">No data yet</div></div>
          ) : courses.map(course => (
            <div key={course._id} className="card">
              <div className="flex-between mb-16">
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700' }}>{course.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{course.category} · {course.level}</div>
                </div>
                <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-gray'}`}>{course.isPublished ? 'Published' : 'Draft'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                {[
                  { label: 'Students Enrolled', value: course.enrolledCount || 0,       icon: '👥', color: '#2563EB' },
                  { label: 'Total Lessons',      value: course.totalLessons || 0,        icon: '🎬', color: '#10B981' },
                  { label: 'Duration',           value: `${course.totalDuration || 0}m`, icon: '⏱', color: '#F59E0B' },
                  { label: 'Rating',             value: course.rating || 'N/A',          icon: '⭐', color: '#8B5CF6' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/instructor/courses/${course._id}`)}>Manage Content</button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/instructor/quiz/${course._id}`)}>Manage Quizzes</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}