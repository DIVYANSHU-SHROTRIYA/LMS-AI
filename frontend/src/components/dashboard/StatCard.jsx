export default function StatCard({ label, value, change, changeType = 'success', icon }) {
  const changeColor = {
    success: '#10B981',
    warning: '#F59E0B',
    error:   '#EF4444',
  }[changeType]

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>{label}</span>
        {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', lineHeight: 1 }}>{value}</div>
      {change && (
        <div style={{ fontSize: '12px', color: changeColor, marginTop: '8px', fontWeight: '500' }}>
          {change}
        </div>
      )}
    </div>
  )
}
