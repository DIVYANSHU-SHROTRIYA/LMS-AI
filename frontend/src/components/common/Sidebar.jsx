import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 12px', borderRadius: '8px',
      fontSize: '14px', fontWeight: '500',
      textDecoration: 'none', marginBottom: '2px',
      color: isActive ? '#2563EB' : '#64748B',
      background: isActive ? '#EFF6FF' : 'transparent',
      transition: 'all .15s',
    })}
  >
    <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{ background: '#2563EB', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>
        {badge}
      </span>
    )}
  </NavLink>
)

const NavLabel = ({ label }) => (
  <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.08em', color: '#94A3B8', padding: '0 12px', margin: '16px 0 6px' }}>
    {label}
  </div>
)

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--white)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', position: 'fixed',
      top: 0, left: 0, height: '100vh', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: '32px', height: '32px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>L</div>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Learn<span style={{ color: '#2563EB' }}>Flow</span></span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        <NavLabel label="Menu" />

        {user?.role === 'student' && <>
          <NavItem to="/dashboard"   icon="🏠" label="Dashboard" />
          <NavItem to="/my-courses"  icon="📚" label="My Courses" />
          <NavItem to="/explore"     icon="🔍" label="Explore" />
          <NavLabel label="Learn" />
          <NavItem to="/ai-tutor"    icon="🤖" label="AI Tutor" />
          <NavItem to="/progress"    icon="📊" label="Progress" />
          <NavItem to="/certificates"icon="🏆" label="Certificates" />
        </>}

        {user?.role === 'instructor' && <>
          <NavItem to="/instructor/dashboard" icon="🏠" label="Dashboard" />
          <NavItem to="/instructor/courses"   icon="📚" label="My Courses" />
          <NavItem to="/instructor/create"    icon="➕" label="New Course" />
          <NavLabel label="Analytics" />
          <NavItem to="/instructor/students"  icon="👥" label="Students" />
        </>}

        {user?.role === 'admin' && <>
          <NavItem to="/admin/dashboard" icon="🏠" label="Dashboard" />
          <NavItem to="/admin/users"     icon="👥" label="Users" />
          <NavItem to="/admin/courses"   icon="📚" label="Courses" />
        </>}

        <NavLabel label="Account" />
        <NavItem to="/settings" icon="⚙️" label="Settings" />
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}
          onClick={handleLogout}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <span style={{ fontSize: '16px', color: '#94A3B8' }}>→</span>
        </div>
      </div>
    </aside>
  )
}
