import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getQuiz, submitQuiz } from '../../services/quizService'
import QuizCard from '../../components/quiz/QuizCard'
import QuizResult from '../../components/quiz/QuizResult'
import { Loader } from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function QuizPage() {
  const { quizId, courseId } = useParams()
  const [quiz, setQuiz]       = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getQuiz(quizId)
      .then(res => setQuiz(res.data))
      .finally(() => setLoading(false))
  }, [quizId])

  const handleAnswer = (questionId, selectedIndex) => {
    if (result) return
    setAnswers(prev => ({ ...prev, [questionId]: selectedIndex }))
  }

  const handleSubmit = async () => {
    const unanswered = quiz.questions.filter(q => answers[q._id] === undefined)
    if (unanswered.length > 0) {
      return toast.error(`Please answer all questions (${unanswered.length} remaining)`)
    }
    setSubmitting(true)
    try {
      const payload = quiz.questions.map(q => ({
        questionId:    q._id,
        selectedIndex: answers[q._id],
      }))
      const res = await submitQuiz(quizId, { answers: payload })
      setResult(res.data)
    } catch (err) {
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
  }

  if (loading) return <Loader />
  if (!quiz)   return <div className="empty"><div className="empty-title">Quiz not found</div></div>
  if (result)  return <QuizResult result={result} onRetry={handleRetry} courseId={courseId} />

  const answered = Object.keys(answers).length

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <div className="card mb-16">
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{quiz.title}</h2>
            {quiz.description && <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>{quiz.description}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#2563EB' }}>{answered}/{quiz.questions.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Answered</div>
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ background: 'var(--border)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(answered / quiz.questions.length) * 100}%`, height: '100%', background: '#2563EB', borderRadius: '4px', transition: 'width .3s' }} />
          </div>
        </div>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, i) => (
        <QuizCard
          key={q._id}
          question={q}
          index={i}
          onAnswer={(idx) => handleAnswer(q._id, idx)}
          selectedIndex={answers[q._id]}
          showResult={false}
        />
      ))}

      {/* Submit */}
      <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '32px' }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ padding: '12px 40px', fontSize: '15px' }}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
          Passing score: {quiz.passingScore}%
        </p>
      </div>
    </div>
  )
}
