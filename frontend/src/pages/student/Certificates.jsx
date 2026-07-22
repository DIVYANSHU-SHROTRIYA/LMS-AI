import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getMyCertificates, generateCertificate } from '../../services/certificateService'
import { getMyEnrollments } from '../../services/enrollmentService'
import { Loader } from '../../components/common/Loader'

export default function Certificates() {
  const [certs, setCerts]         = useState([])
  const [eligible, setEligible]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [generating, setGenerating] = useState(null)

  useEffect(() => {
    Promise.all([getMyCertificates(), getMyEnrollments()])
      .then(([certRes, enrollRes]) => {
        setCerts(certRes.data)
        const certCourseIds = new Set(certRes.data.map(c => c.course?._id))
        setEligible(enrollRes.data.filter(e =>
          e.completionPercent === 100 && !certCourseIds.has(e.course?._id)
        ))
      })
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async (courseId, courseName) => {
    setGenerating(courseId)
    try {
      const res = await generateCertificate(courseId)
      setCerts(prev => [res.data, ...prev])
      setEligible(prev => prev.filter(e => e.course?._id !== courseId))
      toast.success(`Certificate for "${courseName}" generated!`)
    } catch (err) {
      toast.error('Could not generate certificate')
    } finally {
      setGenerating(null)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>My Certificates</h1>

      {/* Eligible to claim */}
      {eligible.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div className="section-title mb-16">🎉 Ready to claim</div>
          <div className="grid-2">
            {eligible.map(e => (
              <div key={e._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🏆</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{e.course?.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--success)' }}>✅ 100% Complete</div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleGenerate(e.course?._id, e.course?.title)}
                  disabled={generating === e.course?._id}
                >
                  {generating === e.course?._id ? 'Generating...' : 'Claim'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earned certificates */}
      {certs.length === 0 && eligible.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏆</div>
          <div className="empty-title">No certificates yet</div>
          <div className="empty-sub">Complete a course to earn your first certificate</div>
        </div>
      ) : (
        <div>
          {certs.length > 0 && <div className="section-title mb-16">Earned Certificates</div>}
          <div className="grid-2">
            {certs.map(cert => (
              <div key={cert._id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#FFF7ED', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🏅</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '3px' }}>{cert.course?.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
                      Issued {new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px', fontFamily: 'monospace' }}>
                      ID: {cert.certificateId}
                    </div>
                    {cert.pdfUrl && (
                      <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
                        className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                        ⬇️ Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
