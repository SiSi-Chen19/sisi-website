import { useCallback, useEffect, useRef } from 'react'

const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children,
}) => {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.floor(width * dpr))
      const nextHeight = Math.max(1, Math.floor(height * dpr))

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing],
  )

  useEffect(() => {
    const draw = (timestamp) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false

        const progress = elapsed / duration
        const eased = easeFunc(progress)
        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)
        const x1 = (spark.x + distance * Math.cos(spark.angle)) * dpr
        const y1 = (spark.y + distance * Math.sin(spark.angle)) * dpr
        const x2 = (spark.x + (distance + lineLength) * Math.cos(spark.angle)) * dpr
        const y2 = (spark.y + (distance + lineLength) * Math.sin(spark.angle)) * dpr

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      if (sparksRef.current.length) {
        frameRef.current = requestAnimationFrame(draw)
      } else {
        frameRef.current = null
      }
    }

    window.__drawClickSpark = draw

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      delete window.__drawClickSpark
    }
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize])

  const handleClick = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const x = event.clientX
    const y = event.clientY
    const now = performance.now()
    const newSparks = Array.from({ length: sparkCount }, (_, index) => ({
      x,
      y,
      angle: (2 * Math.PI * index) / sparkCount,
      startTime: now,
    }))

    sparksRef.current.push(...newSparks)
    if (!frameRef.current && window.__drawClickSpark) {
      frameRef.current = requestAnimationFrame(window.__drawClickSpark)
    }
  }

  return (
    <div className="click-spark-root" onClick={handleClick}>
      <canvas className="click-spark-canvas" ref={canvasRef} aria-hidden="true" />
      {children}
    </div>
  )
}

export default ClickSpark
