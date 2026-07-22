import { useState, useEffect } from 'react'
import { getAllCourses } from '../../services/courseService'
import CourseGrid from '../../components/course/CourseGrid'
import { Loader } from '../../components/common/Loader'

const CATEGORIES = ['All', 'Web Dev', 'Data Science', 'Cloud', 'Design', 'Mobile', 'DevOps', 'AI/ML']
const LEVELS     = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function ExploreCourses() {
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [level,    setLevel]    = useState('All')

  useEffect(() => {
    const params = {}
    if (search)             params.search   = search
    if (category !== 'All') params.category = category
    if (level    !== 'All') params.level    = level

    setLoading(true)
    getAllCourses(params)
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, category, level])

  return (
    <div>
      <div className="mb-24">
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Explore Courses</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>
          {courses.length} courses available — free to enrol
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ maxWidth: '300px' }}
          placeholder="🔍 Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select className="form-select" style={{ width: 'auto' }}
          value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select className="form-select" style={{ width: 'auto' }}
          value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>

        {(category !== 'All' || level !== 'All' || search) && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => { setSearch(''); setCategory('All'); setLevel('All') }}>
            Clear filters
          </button>
        )}
      </div>

      {loading
        ? <Loader />
        : <CourseGrid courses={courses} emptyText="No courses match your filters" />
      }
    </div>
  )
}
