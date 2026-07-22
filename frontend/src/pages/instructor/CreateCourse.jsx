import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createCourse } from '../../services/courseService'

const CATEGORIES = ['Web Dev', 'Data Science', 'Cloud', 'Design', 'Mobile', 'DevOps', 'AI/ML', 'Other']
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced']

export default function CreateCourse() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ title: '', description: '', category: 'Web Dev', level: 'Beginner' })
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) return toast.error('Title and description are required')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (thumbnail) fd.append('thumbnail', thumbnail)
      const res = await createCourse(fd)
      toast.success('Course created! Now add sections and lessons.')
      navigate(`/instructor/courses/${res.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="flex-center gap-12 mb-24">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/instructor/dashboard')}>← Back</button>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Create New Course</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input className="form-input" placeholder="e.g. Complete React & Node.js Bootcamp"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="What will students learn? What's covered?"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Image</label>
            <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: '13px' }} />
            {preview && <img src={preview} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating...' : 'Create Course & Add Content →'}
          </button>
        </form>
      </div>
    </div>
  )
}
