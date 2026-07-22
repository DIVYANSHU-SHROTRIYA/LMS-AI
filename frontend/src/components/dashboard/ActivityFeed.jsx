export default function ActivityFeed({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="empty">
        <div className="empty-icon">📋</div>
        <div className="empty-title">No activity yet</div>
        <div className="empty-sub">Start a course to see activity here</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {activities.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: item.bg || '#EFF6FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
          }}>
            {item.icon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', lineHeight: 1.4 }}>{item.text}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
