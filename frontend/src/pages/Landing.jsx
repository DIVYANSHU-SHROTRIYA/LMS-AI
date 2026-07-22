import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const COURSES = [
  { icon: '⚛️', title: 'React & Node.js Full Stack', category: 'Web Dev', lessons: 24, students: 1200, color: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)' },
  { icon: '🐍', title: 'Python for Data Analysis', category: 'Data Science', lessons: 20, students: 980, color: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' },
  { icon: '☁️', title: 'AWS Solutions Architect', category: 'Cloud', lessons: 25, students: 750, color: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)' },
  { icon: '🤖', title: 'Machine Learning Basics', category: 'AI/ML', lessons: 18, students: 640, color: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)' },
  { icon: '📱', title: 'React Native Mobile Dev', category: 'Mobile', lessons: 22, students: 510, color: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)' },
  { icon: '🎨', title: 'UI/UX Design Fundamentals', category: 'Design', lessons: 16, students: 890, color: 'linear-gradient(135deg,#FDF4FF,#FAE8FF)' },
]

const STATS = [
  { value: '10,000+', label: 'Students Enrolled' },
  { value: '150+',    label: 'Expert Instructors' },
  { value: '500+',    label: 'Courses Available' },
  { value: '4.8★',   label: 'Average Rating' },
]

const FEATURES = [
  { icon: '🤖', title: 'AI Tutor', desc: 'Get instant answers to your doubts from our AI tutor, available 24/7 for every course.' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn verified certificates on course completion to showcase your skills.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Track your learning journey with detailed progress analytics per course.' },
  { icon: '🎯', title: 'Quizzes & Eval', desc: 'Test your knowledge with auto-evaluated quizzes and get instant feedback.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : 'none',
        transition: 'all .3s',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px' }}>L</div>
          <span style={{ fontWeight: '800', fontSize: '18px' }}>Learn<span style={{ color: '#2563EB' }}>Flow</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="#courses" style={{ padding: '8px 16px', fontSize: '14px', fontWeight: '500', color: '#64748B', textDecoration: 'none' }}>Courses</a>
          <a href="#features" style={{ padding: '8px 16px', fontSize: '14px', fontWeight: '500', color: '#64748B', textDecoration: 'none' }}>Features</a>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'transparent', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#0F172A' }}>
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 50%, #FFF7ED 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 5% 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(37,99,235,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#2563EB', marginBottom: '24px' }}>
            🚀 AI-powered learning platform
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Build Skills That
            <span style={{ display: 'block', background: 'linear-gradient(90deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Get You Hired
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', lineHeight: 1.7, marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px' }}>
            Learn from expert instructors, get instant help from our AI tutor, and earn verified certificates — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
              Start Learning Free →
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', background: '#fff', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            <div style={{ display: 'flex' }}>
              {['👨‍💻','👩‍💻','🧑‍💻','👩‍🎓'].map((e, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `hsl(${i*60},70%,80%)`, border: '2px solid #fff', marginLeft: i > 0 ? '-8px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{e}</div>
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#64748B' }}><strong style={{ color: '#0F172A' }}>10,000+</strong> students already learning</span>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 5%' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#2563EB', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '14px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section id="features" style={{ background: '#F8F9FB', padding: '80px 5%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '10px' }}>Why LearnFlow</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: '800', marginBottom: '12px' }}>Everything you need to learn faster</h2>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Designed for students who want results, not just content.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: '14px', padding: '28px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>{f.title}</div>
                  <div style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ────────────────────────────── */}
      <section id="courses" style={{ background: '#fff', padding: '80px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>Popular Courses</div>
              <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: '800' }}>Start with what interests you</h2>
            </div>
            <button onClick={() => navigate('/register')} style={{ padding: '10px 22px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              View all courses →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {COURSES.map(c => (
              <div key={c.title}
                onClick={() => navigate('/register')}
                style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ height: '130px', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>{c.icon}</div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>{c.category}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', lineHeight: 1.4 }}>{c.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                    <span>📚 {c.lessons} lessons</span>
                    <span>👥 {c.students.toLocaleString()} students</span>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: '#F0FDF4', color: '#16A34A', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>Free</span>
                    <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600' }}>Enrol →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A, #312E81)', padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
            Ready to start your learning journey?
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            Join thousands of students already learning on LearnFlow. Free to get started.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', background: '#fff', color: '#1E3A8A', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Create Free Account →
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={{ background: '#0F172A', padding: '32px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '13px' }}>L</div>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>Learn<span style={{ color: '#60A5FA' }}>Flow</span></span>
        </div>
        <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>© 2025 LearnFlow. Built with MERN + AI.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px', cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px', cursor: 'pointer' }}>Register</button>
        </div>
      </footer>
    </div>
  )
}