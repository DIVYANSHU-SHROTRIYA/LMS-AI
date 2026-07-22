import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login as loginAPI } from '../../services/authService'
import useAuth from '../../hooks/useAuth'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Fill in all fields')
    setLoading(true)
    try {
      const res = await loginAPI(form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name}!`)
      const redirect = { student: '/dashboard', instructor: '/instructor/dashboard', admin: '/admin/dashboard' }
      navigate(redirect[res.data.role] || '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px', margin: '0 auto 12px' }}>L</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>Sign in to LearnFlow</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: '16px', background: 'var(--primary-light)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1D4ED8' }}>
          <strong>Demo:</strong> Register as Student or Instructor to explore the app.
        </div>
      </div>
    </div>
  )
}
