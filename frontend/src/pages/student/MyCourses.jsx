import { useState, useEffect } from 'react'
import { getMyEnrollments } from '../../services/enrollmentService'
import CourseGrid from '../../components/course/CourseGrid'
import { Loader } from '../../components/common/Loader'

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [tab, setTab]                 = useState('all')

  useEffect(() => {
    getMyEnrollments()
      .then(res => setEnrollments(res.data))
      .finally(() => setLoading(false))
  }, [])

  const courses      = enrollments.map(e => e.course).filter(Boolean)
  const inProgress   = enrollments.filter(e => e.completionPercent > 0 && e.completionPercent < 100)
  const completed    = enrollments.filter(e => e.completionPercent === 100)
  const notStarted   = enrollments.filter(e => e.completionPercent === 0)

  const filtered = tab === 'all'        ? enrollments
                 : tab === 'progress'   ? inProgress
                 : tab === 'completed'  ? completed
                 : notStarted

  if (loading) return <Loader />

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>My Courses</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {[
          { key: 'all',       label: `All (${enrollments.length})` },
          { key: 'progress',  label: `In Progress (${inProgress.length})` },
          { key: 'completed', label: `Completed (${completed.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '7px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              background: tab === t.key ? '#2563EB' : 'transparent',
              color:      tab === t.key ? '#fff'     : 'var(--muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <CourseGrid
        courses={filtered.map(e => e.course).filter(Boolean)}
        enrollments={filtered}
        showProgress
        emptyText="No courses in this category"
      />
    </div>
  )
}
