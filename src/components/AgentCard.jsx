import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MODELS, STATUS, elapsed, makeSpark } from '../data.js'
import Sparkline from './Sparkline.jsx'

export default function AgentCard({ agent, selected, onClick }) {
  const model  = MODELS[agent.model]
  const status = STATUS[agent.status] || STATUS.idle
  const [tick, setTick] = useState(0)
  const spark  = useRef(makeSpark(agent.sparkSeed))

  // Clock tick for elapsed time
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const isLive     = agent.status === 'executing' || agent.status === 'thinking'
  const isExecing  = agent.status === 'executing'

  // Stripe color map
  const stripeColor = {
    thinking:  'linear-gradient(90deg, #F4B942, #FFDA8A)',
    executing: `linear-gradient(90deg, ${model.color}, #6C63FF)`,
    done:      'linear-gradient(90deg, #00C896, #00E5B0)',
    idle:      'rgba(255,255,255,0.04)',
    error:     'linear-gradient(90deg, #FF5A5A, #FF8A8A)',
  }[agent.status] || 'transparent'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`agent-card${selected ? ' selected' : ''}${isExecing ? ' card-scan' : ''}`}
      onClick={onClick}
    >
      {/* Animated top stripe */}
      <div
        className="card-stripe"
        style={{
          background: stripeColor,
          boxShadow: isLive ? `0 0 12px ${status.color}55` : 'none',
        }}
      />

      <div className="card-body">
        {/* Header */}
        <div className="card-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="card-name">{agent.name}</div>
            <div className="card-task">{agent.task}</div>
          </div>

          {/* Model badge */}
          <div
            className="model-badge"
            style={{
              background: model.bg,
              border: `1px solid ${model.border}`,
              color: model.color,
              marginLeft: 10,
            }}
          >
            <span style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: model.color,
              display: 'inline-block',
              flexShrink: 0,
            }} />
            {model.label}
          </div>
        </div>

        {/* Status row */}
        <div className="card-status-row">
          <div className="status-chip" style={{ color: status.color }}>
            <motion.span
              className="status-dot"
              style={{ background: status.color }}
              animate={status.pulse
                ? { opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }
                : { opacity: 1, scale: 1 }
              }
              transition={status.pulse
                ? { repeat: Infinity, duration: agent.status === 'executing' ? 0.75 : 1.3 }
                : {}
              }
            />
            {status.label}
          </div>
          <span className="card-elapsed">{elapsed(agent.startedAt)}</span>
        </div>

        {/* Progress bar */}
        <div className="progress-wrap">
          <motion.div
            className="progress-fill"
            style={{ background: stripeColor }}
            initial={{ width: '0%' }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {agent.status !== 'idle' && agent.status !== 'done' && (
              <motion.div
                className="progress-tip"
                style={{ background: status.color }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            )}
          </motion.div>
        </div>

        {/* Latest log line */}
        <div className="card-log">
          <span className="card-log-arrow">❯</span>
          <span className="card-log-text">{agent.latestLog}</span>
        </div>

        {/* Footer: sparkline + token count */}
        <div className="card-footer">
          <Sparkline data={spark.current} color={model.color} />
          <div className="token-counter">
            <div className="token-val">{agent.tokens > 0 ? `${(agent.tokens / 1000).toFixed(1)}k` : '—'}</div>
            <div className="token-label">tokens</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
