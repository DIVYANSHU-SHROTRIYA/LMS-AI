export function Loader({ size = 36 }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )
}
