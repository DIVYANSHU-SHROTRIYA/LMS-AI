import { useNavigate } from 'react-router-dom'

const CATEGORY_COLORS = {
  'Web Dev':      { bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', emoji: '💻' },
  'Data Science': { bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', emoji: '📊' },
  'Cloud':        { bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', emoji: '☁️' },
  'Design':       { bg: 'linear-gradient(135deg,#FDF4FF,#FAE8FF)', emoji: '🎨' },
  'Mobile':       { bg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', emoji: '📱' },
  'DevOps':       { bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', emoji: '⚙️' },
  'AI/ML':        { bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', emoji: '🤖' },
  'Other':        { bg: 'linear-gradient(135deg,#F8F9FB,#F1F5F9)', emoji: '📚' },
}

export default function CourseCard({ course, progress, showProgress = false }) {
  const navigate = useNavigate()
  const meta = CATEGORY_COLORS[course.category] || CATEGORY_COLORS['Other']

  const handleClick = () => {
    navigate(showProgress
      ? `/learn/${course._id}`
      : `/courses/${course._id}`)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        transition: 'all .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '140px', background: course.thumbnail ? 'none' : meta.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '44px', position: 'relative',
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{meta.emoji}</span>
        }
        {showProgress && progress !== undefined && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'white', border: '1px solid var(--border)',
            fontSize: '11px', fontWeight: '600', padding: '3px 8px',
            borderRadius: '20px', color: 'var(--text)',
          }}>
            {progress}%
          </span>
        )}
        {!showProgress && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'white', border: '1px solid var(--border)',
            fontSize: '11px', fontWeight: '600', padding: '3px 8px',
            borderRadius: '20px', color: '#2563EB',
          }}>
            Free
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>
          {course.category}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: showProgress ? '10px' : '0' }}>
          <span>👤 {course.instructor?.name || 'Instructor'}</span>
          <span>{course.totalLessons || 0} lessons</span>
        </div>

        {showProgress && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress || 0}%` }} />
          </div>
        )}
      </div>
    </div>
  )
}
