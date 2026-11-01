import { useState, useEffect, useRef } from 'react'

/**
 * Simple count-up hook — no external dependency needed
 * @param {number} end   - target number
 * @param {number} duration - ms
 */
export function useCountUp(end, duration = 1800) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    let startTime = null
    const startVal = 0

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * (end - startVal) + startVal))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [end, duration])

  return count
}

/**
 * AnimatedNumber component — drop-in replacement for CountUp
 */
export default function AnimatedNumber({ end, prefix = '', suffix = '', duration = 1800, separator = true }) {
  const count = useCountUp(end, duration)
  const formatted = separator ? count.toLocaleString() : count.toString()
  return <>{prefix}{formatted}{suffix}</>
}
