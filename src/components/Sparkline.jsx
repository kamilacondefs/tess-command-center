export default function Sparkline({ data, color, width = 110, height = 24 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pad = 2

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      className="sparkline-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ opacity: 0.5 }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
