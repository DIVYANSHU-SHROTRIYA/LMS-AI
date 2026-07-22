export default function ProgressBar({ percent = 0, showLabel = true, height = 6, color = '#2563EB' }) {
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          <span>Progress</span>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{percent}%</span>
        </div>
      )}
      <div style={{ background: 'var(--border)', borderRadius: '4px', height, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', borderRadius: '4px', background: color, transition: 'width .4s ease' }} />
      </div>
    </div>
  )
}
