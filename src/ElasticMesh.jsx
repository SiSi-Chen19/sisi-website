import './ElasticMesh.css'

function ElasticMesh({
  color1 = '#f17fa3',
  color2 = '#7ecce4',
  gridColor = '#ffffff',
  gridOpacity = 0.3,
  borderRadius = 25,
  className = '',
  style,
}) {
  return (
    <div
      className={`elastic-mesh ${className}`.trim()}
      style={{
        '--mesh-color-1': color1,
        '--mesh-color-2': color2,
        '--mesh-grid-color': gridColor,
        '--mesh-grid-opacity': gridOpacity,
        '--mesh-radius': `${borderRadius}px`,
        ...style,
      }}
    >
      <span className="elastic-mesh__surface" />
    </div>
  )
}

export default ElasticMesh
