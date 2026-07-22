import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCourse } from '../../services/courseService'
import { getCourseQuizzes, createQuiz, deleteQuiz } from '../../services/quizService'
import { Loader } from '../../components/common/Loader'

const emptyQuestion = { question: '', options: ['', '', '', ''], correctIndex: 0, topic: '', explanation: '' }

export default function ManageQuiz() {
  const { courseId }          = useParams()
  const navigate              = useNavigate()
  const [course, setCourse]   = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [quizForm, setQuizForm] = useState({ title: '', description: '', passingScore: 60 })
  const [questions, setQuestions] = useState([{ ...emptyQuestion, options: ['', '', '', ''] }])
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    Promise.all([getCourse(courseId), getCourseQuizzes(courseId)])
      .then(([cRes, qRes]) => { setCourse(cRes.data); setQuizzes(qRes.data) })
      .catch(() => navigate('/instructor/dashboard'))
      .finally(() => setLoading(false))
  }, [courseId])

  const addQuestion = () => setQuestions(prev => [...prev, { ...emptyQuestion, options: ['', '', '', ''] }])

  const updateQuestion = (qi, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q))
  }

  const updateOption = (qi, oi, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q
      const options = [...q.options]
      options[oi] = value
      return { ...q, options }
    }))
  }

  const removeQuestion = (qi) => {
    if (questions.length === 1) return toast.error('Need at least 1 question')
    setQuestions(prev => prev.filter((_, i) => i !== qi))
  }

  const handleSaveQuiz = async () => {
    if (!quizForm.title.trim()) return toast.error('Quiz title required')
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) return toast.error(`Question ${i + 1} text is empty`)
      if (q.options.some(o => !o.trim())) return toast.error(`All options required for Q${i + 1}`)
    }
    setSaving(true)
    try {
      const res = await createQuiz({ courseId, ...quizForm, questions })
      setQuizzes(prev => [...prev, res.data])
      setShowForm(false)
      setQuizForm({ title: '', description: '', passingScore: 60 })
      setQuestions([{ ...emptyQuestion, options: ['', '', '', ''] }])
      toast.success('Quiz created!')
    } catch { toast.error('Failed to create quiz') }
    finally { setSaving(false) }
  }

  const handleDeleteQuiz = async (id, title) => {
    if (!window.confirm(`Delete quiz "${title}"?`)) return
    try {
      await deleteQuiz(id)
      setQuizzes(prev => prev.filter(q => q._id !== id))
      toast.success('Quiz deleted')
    } catch { toast.error('Failed to delete quiz') }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex-between mb-24">
        <div className="flex-center gap-12">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/instructor/dashboard')}>← Back</button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Quizzes — {course?.title}</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} created</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Create Quiz'}
        </button>
      </div>

      {/* Create Quiz Form */}
      {showForm && (
        <div className="card mb-24" style={{ border: '2px solid #BFDBFE' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: '#2563EB' }}>New Quiz</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Quiz Title *</label>
              <input className="form-input" placeholder="e.g. React Basics Quiz"
                value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description</label>
              <input className="form-input" placeholder="Optional description"
                value={quizForm.description} onChange={e => setQuizForm({ ...quizForm, description: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Passing Score %</label>
              <input className="form-input" type="number" min="0" max="100" style={{ width: '100px' }}
                value={quizForm.passingScore} onChange={e => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })} />
            </div>
          </div>

          {/* Questions */}
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Questions</div>
          {questions.map((q, qi) => (
            <div key={qi} style={{ background: 'var(--bg)', borderRadius: '10px', padding: '16px', marginBottom: '12px', border: '1px solid var(--border)' }}>
              <div className="flex-between mb-12">
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563EB' }}>Question {qi + 1}</span>
                <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>

              <div className="form-group">
                <input className="form-input" placeholder="Enter your question *"
                  value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio" name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                      style={{ cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                    <input
                      className="form-input"
                      placeholder={`Option ${String.fromCharCode(65 + oi)} ${oi === q.correctIndex ? '✓ Correct' : ''}`}
                      value={opt}
                      onChange={e => updateOption(qi, oi, e.target.value)}
                      style={{ borderColor: q.correctIndex === oi ? '#10B981' : 'var(--border)' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input className="form-input" placeholder="Topic (for weak topic detection)"
                  value={q.topic} onChange={e => updateQuestion(qi, 'topic', e.target.value)} />
                <input className="form-input" placeholder="Explanation (shown after answer)"
                  value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} />
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button className="btn btn-ghost" onClick={addQuestion}>+ Add Question</button>
            <button className="btn btn-primary" onClick={handleSaveQuiz} disabled={saving}>
              {saving ? 'Saving...' : `Save Quiz (${questions.length} questions)`}
            </button>
          </div>
        </div>
      )}

      {/* Existing Quizzes */}
      {quizzes.length === 0 && !showForm ? (
        <div className="empty">
          <div className="empty-icon">📝</div>
          <div className="empty-title">No quizzes yet</div>
          <div className="empty-sub">Create a quiz so students can test their knowledge</div>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setShowForm(true)}>Create Quiz</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quizzes.map(quiz => (
            <div key={quiz._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>📝</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{quiz.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '3px' }}>
                  {quiz.questions?.length} questions · Passing score: {quiz.passingScore}%
                  {quiz.description && ` · ${quiz.description}`}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
