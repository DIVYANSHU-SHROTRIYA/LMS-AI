import { useState } from 'react'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { updateMe } from '../../services/authService'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [form, setForm]      = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [avatar, setAvatar]  = useState(null)
  const [preview, setPreview]= useState(user?.avatar || null)
  const [saving, setSaving]  = useState(false)

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('bio', form.bio)
      if (avatar) fd.append('thumbnail', avatar)
      const res = await updateMe(fd)
      updateUser(res.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ maxWidth: '520px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Settings</h1>

      <div className="card">
        <form onSubmit={handleSave}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', overflow: 'hidden', flexShrink: 0 }}>
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <div>
              <label style={{ cursor: 'pointer' }}>
                <span className="btn btn-ghost btn-sm">Change Photo</span>
                <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
              </label>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                JPG, PNG up to 5MB
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email || ''} disabled
              style={{ opacity: .6, cursor: 'not-allowed' }} />
            <div className="form-error" style={{ color: 'var(--muted)' }}>Email cannot be changed</div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" placeholder="Tell us about yourself..."
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: '8px', fontSize: '14px', textTransform: 'capitalize', color: 'var(--muted)' }}>
              {user?.role} — <span style={{ fontSize: '12px' }}>Contact admin to change</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
