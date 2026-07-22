import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCourse } from '../../services/courseService'
import { enrollCourse, getEnrollment } from '../../services/enrollmentService'
import { Loader } from '../../components/common/Loader'
import useAuth from '../../hooks/useAuth'

export default function CourseDetail() {
  const { id }                = useParams()
  const { user }              = useAuth()
  const navigate              = useNavigate()
  const [course, setCourse]   = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    Promise.all([
      getCourse(id),
      user ? getEnrollment(id).catch(() => null) : Promise.resolve(null),
    ]).then(([courseRes, enrollRes]) => {
      setCourse(courseRes.data)
      if (enrollRes) setEnrolled(true)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id, user])

  const handleEnrol = async () => {
    if (!user) return navigate('/login')
    setEnrolling(true)
    try {
      await enrollCourse(id)
      setEnrolled(true)
      toast.success('Enrolled successfully!')
      navigate(`/learn/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrolment failed')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <Loader />
  if (!course) return <div className="empty"><div className="empty-title">Course not found</div></div>

  const totalLessons = course.sections?.reduce((s, sec) => s + sec.lessons.length, 0) || 0

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '12px', display: 'inline-block' }}>{course.category}</span>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px', lineHeight: 1.3 }}>{course.title}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{course.description}</p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            <span>👤 {course.instructor?.name}</span>
            <span>📚 {totalLessons} lessons</span>
            <span>📊 {course.level}</span>
            <span>👥 {course.enrolledCount} enrolled</span>
          </div>
        </div>

        <div>
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} />
            : <div style={{ width: '100%', height: '180px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', marginBottom: '16px' }}>📚</div>
          }
          {enrolled
            ? <button className="btn btn-primary btn-full" onClick={() => navigate(`/learn/${id}`)}>Continue Learning →</button>
            : <button className="btn btn-primary btn-full" onClick={handleEnrol} disabled={enrolling}>
                {enrolling ? 'Enrolling...' : 'Enrol for Free'}
              </button>
          }
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Free · Certificate on completion</p>
        </div>
      </div>

      {/* Curriculum */}
      <div className="card">
        <div className="section-title mb-16">Course Curriculum</div>
        {course.sections?.map((section, si) => (
          <div key={section._id} style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
              Section {si + 1}: {section.title}
            </div>
            {section.lessons?.map((lesson, li) => (
              <div key={lesson._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', fontSize: '13px', color: 'var(--muted)' }}>
                <span>▶️</span>
                <span style={{ flex: 1 }}>{li + 1}. {lesson.title}</span>
                {lesson.duration > 0 && <span>{lesson.duration} min</span>}
                {lesson.isFree && <span className="badge badge-success">Free</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
