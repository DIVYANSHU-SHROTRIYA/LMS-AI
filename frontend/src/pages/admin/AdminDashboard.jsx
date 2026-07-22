import { useState, useEffect } from 'react'
import api from '../../services/api'
import StatCard from '../../components/dashboard/StatCard'
import { Loader } from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [users, setUsers]     = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('users')

  useEffect(() => {
    Promise.all([
      api.get('/auth/admin/users'),
      api.get('/courses'),
    ]).then(([usersRes, coursesRes]) => {
      setUsers(usersRes.data)
      setCourses(coursesRes.data)
      setStats({
        total:       usersRes.data.length,
        students:    usersRes.data.filter(u => u.role === 'student').length,
        instructors: usersRes.data.filter(u => u.role === 'instructor').length,
        courses:     coursesRes.data.length,
      })
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return
    try {
      await api.delete(`/auth/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Could not delete user')
    }
  }

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(prev => prev.filter(c => c._id !== id))
      toast.success('Course deleted')
    } catch {
      toast.error('Could not delete course')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-24">
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '3px' }}>
          Platform overview and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        <StatCard label="Total Users"    value={stats?.total       || 0} icon="👥" />
        <StatCard label="Students"       value={stats?.students    || 0} icon="🎓" />
        <StatCard label="Instructors"    value={stats?.instructors || 0} icon="🧑‍🏫" />
        <StatCard label="Total Courses"  value={stats?.courses     || 0} icon="📚" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {[
          { key: 'users',   label: `Users (${users.length})` },
          { key: 'courses', label: `Courses (${courses.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '7px 20px', borderRadius: '7px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              background: tab === t.key ? '#2563EB' : 'transparent',
              color:      tab === t.key ? '#fff'    : 'var(--muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                        {user.avatar
                          ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          : user.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'instructor' ? 'badge-warning' : 'badge-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {user.role !== 'admin' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        style={{ color: 'var(--error)', borderColor: 'var(--error)', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Courses tab */}
      {tab === 'courses' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Course', 'Instructor', 'Category', 'Students', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => (
                <tr key={course._id} style={{ borderBottom: i < courses.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.title}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{course.instructor?.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-primary">{course.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{course.enrolledCount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-gray'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      style={{ color: 'var(--error)', borderColor: 'var(--error)', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
