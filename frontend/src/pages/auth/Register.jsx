import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register as registerAPI } from '../../services/authService'
import useAuth from '../../hooks/useAuth'

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await registerAPI(form)
      login(res.data)
      toast.success(`Welcome to LearnFlow, ${res.data.name}!`)
      const redirect = { student: '/dashboard', instructor: '/instructor/dashboard' }
      navigate(redirect[res.data.role] || '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px', margin: '0 auto 12px' }}>L</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Create account</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>Join LearnFlow today — it's free</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Rahul Kumar"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">I want to join as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { value: 'student', label: '🎓 Student', sub: 'Learn courses' }
                  ,
                ].map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    style={{
                      padding: '12px', borderRadius: '8px', cursor: 'pointer',
                      border: `2px solid ${form.role === opt.value ? '#2563EB' : 'var(--border)'}`,
                      background: form.role === opt.value ? 'var(--primary-light)' : 'var(--bg)',
                      textAlign: 'center', transition: 'all .15s',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: '600', color: form.role === opt.value ? '#2563EB' : 'var(--text)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{opt.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
