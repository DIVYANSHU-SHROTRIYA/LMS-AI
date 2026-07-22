import CourseCard from './CourseCard'

export default function CourseGrid({ courses = [], enrollments = [], showProgress = false, emptyText = 'No courses found' }) {
  if (!courses.length) {
    return (
      <div className="empty">
        <div className="empty-icon">📚</div>
        <div className="empty-title">{emptyText}</div>
      </div>
    )
  }

  const getProgress = (courseId) => {
    const enrollment = enrollments.find(e =>
      (e.course?._id || e.course) === courseId
    )
    return enrollment?.completionPercent || 0
  }

  return (
    <div className="grid-3">
      {courses.map(course => (
        <CourseCard
          key={course._id}
          course={course}
          progress={showProgress ? getProgress(course._id) : undefined}
          showProgress={showProgress}
        />
      ))}
    </div>
  )
}
