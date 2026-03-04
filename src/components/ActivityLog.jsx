import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHO_COLOR = {
  executing: '#6C63FF',
  thinking:  '#F4B942',
  done:      '#00C896',
  idle:      '#30303E',
  error:     '#FF5A5A',
  system:    '#30303E',
  user:      '#A78BFA',
}

export default function ActivityLog({ logs }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [logs])

  return (
    <div className="log-panel">
      <div className="section-label">Activity Stream</div>
      <div className="log-scroll">
        <AnimatePresence initial={false}>
          {logs.map(entry => (
            <motion.div
              key={entry.id}
              className="log-row"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <span className="log-time">{entry.time}</span>
              <span
                className="log-who"
                style={{ color: WHO_COLOR[entry.status] || '#60607A' }}
              >
                {entry.who}
              </span>
              <span className="log-msg">{entry.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* blinking cursor at the end */}
        <span className="blink-cursor" />
        <div ref={endRef} />
      </div>
    </div>
  )
}
