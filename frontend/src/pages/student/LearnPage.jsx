import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCourse } from '../../services/courseService'
import { getEnrollment } from '../../services/enrollmentService'
import { markLessonComplete } from '../../services/progressService'
import { getCourseQuizzes } from '../../services/quizService'
import LessonSidebar from '../../components/course/LessonSidebar'
import AIChatbot from '../../components/chat/AIChatbot'
import ProgressBar from '../../components/course/ProgressBar'
import { Loader } from '../../components/common/Loader'

export default function LearnPage() {
  const { courseId }                = useParams()
  const navigate                    = useNavigate()
  const [course, setCourse]         = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [quizzes, setQuizzes]       = useState([])
  const [showChat, setShowChat]     = useState(false)
  const [loading, setLoading]       = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    Promise.all([
      getCourse(courseId),
      getEnrollment(courseId),
      getCourseQuizzes(courseId),
    ]).then(([courseRes, enrollRes, quizRes]) => {
      setCourse(courseRes.data)
      setEnrollment(enrollRes.data)
      setQuizzes(quizRes.data)
      const firstSection = courseRes.data.sections?.[0]
      if (firstSection?.lessons?.[0]) setCurrentLesson(firstSection.lessons[0])
    }).catch(() => navigate('/my-courses'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleMarkComplete = async () => {
    if (!currentLesson) return
    setCompleting(true)
    try {
      const res = await markLessonComplete(courseId, currentLesson._id, { watchedPercent: 100 })
      setEnrollment(prev => ({
        ...prev,
        completionPercent: res.data.completionPercent,
        progress: res.data.enrollment.progress,
      }))
      toast.success('Lesson complete! ✅')
      if (res.data.completionPercent === 100) {
        toast.success('🎉 Course completed! Claim your certificate.')
        setTimeout(() => navigate('/certificates'), 2000)
      }
    } catch { toast.error('Could not update progress') }
    finally { setCompleting(false) }
  }

  const isCompleted = (lessonId) =>
    enrollment?.progress?.some(p => p.lessonId === lessonId && p.completedAt)

  if (loading) return <Loader />
  if (!course)  return null

  const completedCount = enrollment?.progress?.filter(p => p.completedAt).length || 0
  const totalCount     = course.totalLessons || 0

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-courses')}>← My Courses</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{course.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <ProgressBar percent={enrollment?.completionPercent || 0} showLabel={false} height={4} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              {completedCount}/{totalCount} lessons · {enrollment?.completionPercent || 0}%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {quizzes.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/quiz/${courseId}/${quizzes[0]._id}`)}>
              📝 Take Quiz
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setShowChat(p => !p)}>
            {showChat ? '📹 Video' : '🤖 AI Tutor'}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Video / Chat */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!showChat ? (
            <div>
              {/* Video */}
              <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {currentLesson?.videoUrl
                  ? <video key={currentLesson.videoUrl} controls style={{ width: '100%', height: '100%' }} src={currentLesson.videoUrl} />
                  : <div style={{ color: '#fff', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎥</div>
                      <div style={{ fontSize: '14px', color: '#94A3B8' }}>
                        {currentLesson ? 'No video uploaded for this lesson' : 'Select a lesson to start'}
                      </div>
                    </div>
                }
              </div>

              {/* Lesson info */}
              {currentLesson && (
                <div className="card">
                  <div className="flex-between">
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{currentLesson.title}</h3>
                      {currentLesson.description && (
                        <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px', lineHeight: 1.6 }}>
                          {currentLesson.description}
                        </p>
                      )}
                    </div>
                    <button
                      className={`btn btn-sm ${isCompleted(currentLesson._id) ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={handleMarkComplete}
                      disabled={completing || isCompleted(currentLesson._id)}
                      style={{ flexShrink: 0, marginLeft: '16px' }}
                    >
                      {isCompleted(currentLesson._id) ? '✅ Completed' : completing ? 'Saving...' : 'Mark Complete'}
                    </button>
                  </div>

                  {currentLesson.resources?.length > 0 && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>📎 Resources</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {currentLesson.resources.map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noreferrer"
                            style={{ fontSize: '13px', color: '#2563EB', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                            📄 {r.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quizzes section */}
              {quizzes.length > 0 && (
                <div className="card" style={{ marginTop: '16px' }}>
                  <div className="section-title mb-12">📝 Course Quizzes</div>
                  {quizzes.map(quiz => (
                    <div key={quiz._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>📝</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{quiz.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          {quiz.questions?.length} questions · Pass: {quiz.passingScore}%
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/quiz/${courseId}/${quiz._id}`)}>
                        Take Quiz →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <AIChatbot courseId={courseId} courseName={course.title} />
          )}
        </div>

        {/* Lesson Sidebar */}
        <LessonSidebar
          course={course}
          progress={enrollment?.progress || []}
          currentLessonId={currentLesson?._id}
          onSelectLesson={(sectionId, lesson) => { setCurrentLesson(lesson); setShowChat(false) }}
        />
      </div>
    </div>
  )
}