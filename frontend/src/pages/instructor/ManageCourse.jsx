import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getCourse, addSection, deleteSection,
  addLesson, deleteLesson, updateCourse
} from '../../services/courseService'
import { Loader } from '../../components/common/Loader'

export default function ManageCourse() {
  const { courseId }            = useParams()
  const navigate                = useNavigate()
  const [course, setCourse]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [newSection, setNewSection] = useState('')
  const [addingSec, setAddingSec]   = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', duration: '', isFree: false })
  const [videoFile, setVideoFile]   = useState(null)
  const [uploadingSec, setUploadingSec] = useState(null)

  useEffect(() => {
    getCourse(courseId)
      .then(res => { setCourse(res.data); setExpandedSection(res.data.sections?.[0]?._id || null) })
      .catch(() => navigate('/instructor/dashboard'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleAddSection = async () => {
    if (!newSection.trim()) return toast.error('Section title required')
    setAddingSec(true)
    try {
      const res = await addSection(courseId, { title: newSection })
      setCourse(res.data)
      setNewSection('')
      toast.success('Section added')
    } catch { toast.error('Failed to add section') }
    finally { setAddingSec(false) }
  }

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its lessons?')) return
    try {
      const res = await deleteSection(courseId, sectionId)
      setCourse(res.data)
      toast.success('Section deleted')
    } catch { toast.error('Failed to delete section') }
  }

  const handleAddLesson = async (sectionId) => {
    if (!lessonForm.title.trim()) return toast.error('Lesson title required')
    setUploadingSec(sectionId)
    try {
      const fd = new FormData()
      fd.append('title', lessonForm.title)
      fd.append('description', lessonForm.description)
      fd.append('duration', lessonForm.duration || 0)
      fd.append('isFree', lessonForm.isFree)
      if (videoFile) fd.append('video', videoFile)
      const res = await addLesson(courseId, sectionId, fd)
      setCourse(res.data)
      setLessonForm({ title: '', description: '', duration: '', isFree: false })
      setVideoFile(null)
      toast.success('Lesson added!')
    } catch { toast.error('Failed to add lesson') }
    finally { setUploadingSec(null) }
  }

  const handleDeleteLesson = async (sectionId, lessonId) => {
    if (!window.confirm('Delete this lesson?')) return
    try {
      const res = await deleteLesson(courseId, sectionId, lessonId)
      setCourse(res.data)
      toast.success('Lesson deleted')
    } catch { toast.error('Failed to delete lesson') }
  }

  const handlePublish = async () => {
    try {
      const fd = new FormData()
      fd.append('isPublished', !course.isPublished)
      const res = await updateCourse(courseId, fd)
      setCourse(res.data)
      toast.success(res.data.isPublished ? '🚀 Course published!' : 'Course unpublished')
    } catch { toast.error('Failed to update') }
  }

  if (loading) return <Loader />
  if (!course)  return null

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-24">
        <div className="flex-center gap-12">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/instructor/dashboard')}>← Back</button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700' }}>{course.title}</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
              {course.sections?.length} sections · {course.totalLessons} lessons
            </p>
          </div>
        </div>
        <div className="flex-center gap-8">
          <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-gray'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
          <button className="btn btn-primary btn-sm" onClick={handlePublish}>
            {course.isPublished ? 'Unpublish' : 'Publish Course'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Sections + Lessons */}
        <div>
          {/* Add Section */}
          <div className="card mb-16">
            <div className="section-title mb-12">Add Section</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                placeholder="e.g. Getting Started"
                value={newSection}
                onChange={e => setNewSection(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSection()}
              />
              <button className="btn btn-primary" onClick={handleAddSection} disabled={addingSec} style={{ flexShrink: 0 }}>
                {addingSec ? '...' : '+ Add'}
              </button>
            </div>
          </div>

          {/* Sections list */}
          {course.sections?.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📂</div>
              <div className="empty-title">No sections yet</div>
              <div className="empty-sub">Add a section above to start building your course</div>
            </div>
          )}

          {course.sections?.map((section, si) => (
            <div key={section._id} className="card mb-12">
              {/* Section header */}
              <div className="flex-between mb-12">
                <div
                  className="flex-center gap-8"
                  style={{ cursor: 'pointer', flex: 1 }}
                  onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                >
                  <span style={{ fontSize: '16px' }}>{expandedSection === section._id ? '▾' : '▸'}</span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    Section {si + 1}: {section.title}
                  </span>
                  <span className="badge badge-gray">{section.lessons?.length} lessons</span>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDeleteSection(section._id)}
                  style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                >
                  Delete
                </button>
              </div>

              {expandedSection === section._id && (
                <div>
                  {/* Existing lessons */}
                  {section.lessons?.map((lesson, li) => (
                    <div key={lesson._id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', background: 'var(--bg)',
                      borderRadius: '8px', marginBottom: '6px',
                    }}>
                      <span style={{ color: 'var(--muted)', fontSize: '13px', width: '20px', flexShrink: 0 }}>{li + 1}</span>
                      <span style={{ fontSize: '16px' }}>{lesson.videoUrl ? '▶️' : '📄'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500' }}>{lesson.title}</div>
                        {lesson.duration > 0 && (
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>⏱ {lesson.duration} min</div>
                        )}
                      </div>
                      {lesson.isFree && <span className="badge badge-success">Free</span>}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteLesson(section._id, lesson._id)}
                        style={{ color: 'var(--error)', fontSize: '12px', padding: '4px 10px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add lesson form */}
                  <div style={{ marginTop: '12px', padding: '14px', background: 'var(--primary-light)', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1D4ED8', marginBottom: '10px' }}>+ Add Lesson</div>

                    <div className="form-group">
                      <input className="form-input" placeholder="Lesson title *"
                        value={lessonForm.title}
                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <input className="form-input" placeholder="Description (optional)"
                        value={lessonForm.description}
                        onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                      <input className="form-input" type="number" placeholder="Duration (mins)"
                        value={lessonForm.duration}
                        onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={lessonForm.isFree}
                          onChange={e => setLessonForm({ ...lessonForm, isFree: e.target.checked })} />
                        Mark as Free Preview
                      </label>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                        Upload Video (optional)
                      </label>
                      <input type="file" accept="video/*"
                        onChange={e => setVideoFile(e.target.files[0])}
                        style={{ fontSize: '12px' }} />
                      {videoFile && (
                        <div style={{ fontSize: '12px', color: '#1D4ED8', marginTop: '4px' }}>
                          ✅ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddLesson(section._id)}
                      disabled={uploadingSec === section._id}
                    >
                      {uploadingSec === section._id ? '⏳ Uploading...' : 'Add Lesson'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Course summary sidebar */}
        <div>
          <div className="card mb-12">
            <div className="section-title mb-12">Course Info</div>
            {course.thumbnail && (
              <img src={course.thumbnail} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
            )}
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 2 }}>
              <div>📂 Category: <strong style={{ color: 'var(--text)' }}>{course.category}</strong></div>
              <div>📊 Level: <strong style={{ color: 'var(--text)' }}>{course.level}</strong></div>
              <div>📚 Sections: <strong style={{ color: 'var(--text)' }}>{course.sections?.length}</strong></div>
              <div>🎬 Lessons: <strong style={{ color: 'var(--text)' }}>{course.totalLessons}</strong></div>
              <div>👥 Students: <strong style={{ color: 'var(--text)' }}>{course.enrolledCount}</strong></div>
            </div>
          </div>

          <div className="card">
            <div className="section-title mb-12">Checklist</div>
            {[
              { done: !!course.title,                   label: 'Course title set' },
              { done: !!course.description,             label: 'Description added' },
              { done: !!course.thumbnail,               label: 'Thumbnail uploaded' },
              { done: course.sections?.length > 0,     label: 'At least 1 section' },
              { done: course.totalLessons > 0,         label: 'At least 1 lesson' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: item.done ? '#10B981' : 'var(--border)', fontSize: '16px' }}>
                  {item.done ? '✅' : '⭕'}
                </span>
                <span style={{ color: item.done ? 'var(--text)' : 'var(--muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
