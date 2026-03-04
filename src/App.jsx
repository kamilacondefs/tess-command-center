import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentCard from './components/AgentCard.jsx'
import ActivityLog from './components/ActivityLog.jsx'
import PromptInput from './components/PromptInput.jsx'
import Toasts from './components/Toasts.jsx'
import {
  INITIAL_AGENTS, MODELS, STATUS,
  LOG_MSGS, SYS_MSGS, nowHMS
} from './data.js'

// ── Hex logo SVG ──────────────────────────────────────
function HexLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <polygon
        points="17,2 30,9.5 30,24.5 17,32 4,24.5 4,9.5"
        stroke="#6C63FF"
        strokeWidth="1.4"
        fill="rgba(108,99,255,0.07)"
      />
      <circle cx="17" cy="17" r="4.5" fill="#6C63FF" />
      {/* 6 satellite dots */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = 10.5
        const x = 17 + r * Math.cos((deg - 90) * Math.PI / 180)
        const y = 17 + r * Math.sin((deg - 90) * Math.PI / 180)
        return (
          <circle key={i} cx={x} cy={y} r="1.6"
            fill="#6C63FF" opacity={0.4 + (i % 3) * 0.1}
          />
        )
      })}
      {/* Connecting lines */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = 10.5
        const x = 17 + r * Math.cos((deg - 90) * Math.PI / 180)
        const y = 17 + r * Math.sin((deg - 90) * Math.PI / 180)
        return (
          <line key={i} x1="17" y1="17" x2={x} y2={y}
            stroke="#6C63FF" strokeWidth="0.5" opacity="0.2"
          />
        )
      })}
    </svg>
  )
}

// ── Topbar ────────────────────────────────────────────
function Topbar({ agents, totalTokens }) {
  const active = agents.filter(a => a.status === 'executing' || a.status === 'thinking').length
  const done   = agents.filter(a => a.status === 'done').length
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <HexLogo />
        <div className="logo-wordmark">
          <div className="logo-tess">
            <span>TESS</span> COMMAND CENTER
          </div>
          <div className="logo-sub">Agent Orchestration Layer · v2.4.1</div>
        </div>
      </div>

      <div className="topbar-center">
        <div className="live-pill">
          <motion.span
            style={{
              display: 'inline-block',
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#00C896',
            }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          LIVE
        </div>
      </div>

      <div className="topbar-stats">
        {[
          { val: active,                          color: '#6C63FF', label: 'Active'  },
          { val: agents.length,                   color: '#F0F0F8', label: 'Agents'  },
          { val: `${(totalTokens/1000).toFixed(1)}k`, color: '#F0F0F8', label: 'Tokens'  },
          { val: done,                            color: '#00C896', label: 'Done'    },
        ].map(s => (
          <div className="tstat" key={s.label}>
            <div className="tstat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="tstat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </header>
  )
}

// ── Selected agent detail strip ───────────────────────
function DetailStrip({ agent, onClose }) {
  if (!agent) return null
  const model = MODELS[agent.model]
  return (
    <motion.div
      className="detail-strip"
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.22 }}
    >
      <div className="detail-strip-head">
        <div className="detail-strip-name">{agent.name}</div>
        <button className="detail-strip-close" onClick={onClose}>✕</button>
      </div>
      <div className="detail-kv-row">
        {[
          { k: 'Model',    v: model.label },
          { k: 'Progress', v: `${agent.progress.toFixed(0)}%` },
          { k: 'Tokens',   v: agent.tokens > 0 ? `${(agent.tokens/1000).toFixed(1)}k` : '—' },
          { k: 'Status',   v: STATUS[agent.status]?.label || agent.status },
        ].map(s => (
          <div className="dkv" key={s.k}>
            <div className="dkv-val">{s.v}</div>
            <div className="dkv-key">{s.k}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main App ──────────────────────────────────────────
const FILTERS = ['all','executing','thinking','done','idle']

export default function App() {
  const [agents, setAgents]       = useState(INITIAL_AGENTS)
  const [logs, setLogs]           = useState(() => [
    { id: 1, time: '08:41:01', who: '[SYS]',    status: 'system',    msg: 'Command Center initialized · 8 agents loaded' },
    { id: 2, time: '08:41:03', who: 'DATAWVR',  status: 'executing', msg: 'Starting Q4 financial analysis pipeline' },
    { id: 3, time: '08:41:06', who: 'RSRCHBOT', status: 'thinking',  msg: 'Loaded competitive landscape dataset (3.2 MB)' },
    { id: 4, time: '08:41:08', who: 'CODEFRGE', status: 'executing', msg: 'Repository cloned · scanning 1,248 source files' },
    { id: 5, time: '08:41:11', who: '[SYS]',    status: 'system',    msg: 'All LLM gateways healthy · 270 providers online' },
  ])
  const [selectedId, setSelectedId]   = useState(null)
  const [promptTarget, setPromptTarget] = useState('')
  const [filter, setFilter]           = useState('all')
  const [totalTokens, setTotalTokens] = useState(67400)
  const [toasts, setToasts]           = useState([])
  const logId    = useRef(6)
  const toastId  = useRef(1)

  // ── helpers ──────────────────────────────────────
  const pushLog = useCallback((who, status, msg) => {
    setLogs(prev => [...prev.slice(-100), {
      id: logId.current++,
      time: nowHMS(),
      who, status, msg,
    }])
  }, [])

  const pushToast = useCallback((msg, type = 'info') => {
    const id = toastId.current++
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  // ── Live log ticker ───────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      const live = agents.filter(a => a.status !== 'done' && a.status !== 'idle')

      if (Math.random() > 0.82 || live.length === 0) {
        // system message
        const msg = SYS_MSGS[Math.floor(Math.random() * SYS_MSGS.length)]
        pushLog('[SYS]', 'system', msg)
      } else {
        const ag  = live[Math.floor(Math.random() * live.length)]
        const msg = LOG_MSGS[Math.floor(Math.random() * LOG_MSGS.length)](ag.name)
        pushLog(ag.name, ag.status, msg)
        // also update card's latest log
        setAgents(prev => prev.map(a => a.id === ag.id ? { ...a, latestLog: msg } : a))
      }

      setTotalTokens(t => t + Math.floor(Math.random() * 320 + 60))
    }, 1250)
    return () => clearInterval(iv)
  }, [agents, pushLog])

  // ── Progress simulation ───────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev => prev.map(a => {
        if (a.status === 'executing') {
          const np = Math.min(a.progress + Math.random() * 1.6, 99)
          if (np > 93 && Math.random() > 0.94) {
            pushLog(a.name, 'done', 'Task completed successfully ✓')
            pushToast(`✓ ${a.name} finished`, 'success')
            return { ...a, status: 'done', progress: 100 }
          }
          return { ...a, progress: np, tokens: a.tokens + Math.floor(Math.random()*120+30) }
        }
        if (a.status === 'thinking' && Math.random() > 0.96) {
          pushLog(a.name, 'executing', 'Switching from thinking → executing')
          return { ...a, status: 'executing' }
        }
        return a
      }))
    }, 900)
    return () => clearInterval(iv)
  }, [pushLog, pushToast])

  // ── Prompt send ───────────────────────────────────
  const handleSend = useCallback((targetId, text) => {
    const ag = agents.find(a => a.id === targetId)
    if (!ag) return
    pushLog('[YOU]', 'user', `→ ${ag.name}: "${text}"`)
    setAgents(prev => prev.map(a =>
      a.id === targetId
        ? { ...a, status: 'executing', progress: Math.min(a.progress + 5, 99), latestLog: text }
        : a
    ))
    setTimeout(() => pushLog(ag.name, 'executing', 'Received instruction · initiating processing...'), 380)
    pushToast(`Sent to ${ag.name}`, 'info')
  }, [agents, pushLog, pushToast])

  // ── Filtered agents ───────────────────────────────
  const shown = filter === 'all' ? agents : agents.filter(a => a.status === filter)
  const selectedAgent = agents.find(a => a.id === selectedId) ?? null

  return (
    <>
      {/* Ambient */}
      <div className="grid-canvas" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Toast notifications */}
      <Toasts items={toasts} />

      <div className="app-shell">
        {/* ── Topbar ── */}
        <Topbar agents={agents} totalTokens={totalTokens} />

        {/* ── Left panel: agent feed ── */}
        <main className="main-left">

          {/* Section label + filters */}
          <div>
            <div className="section-label">Agent Feed</div>
            <div className="filter-row">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`fpill${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && ` · ${agents.filter(a => a.status === f).length}`}
                </button>
              ))}
            </div>
          </div>

          {/* Selected detail strip */}
          <AnimatePresence>
            {selectedAgent && (
              <DetailStrip
                key={selectedAgent.id}
                agent={selectedAgent}
                onClose={() => setSelectedId(null)}
              />
            )}
          </AnimatePresence>

          {/* Cards grid */}
          <motion.div layout className="agents-grid">
            <AnimatePresence mode="popLayout">
              {shown.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedId === agent.id}
                  onClick={() => {
                    setSelectedId(prev => prev === agent.id ? null : agent.id)
                    setPromptTarget(agent.id)
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {shown.length === 0 && (
            <div className="empty-state">No agents with status "{filter}"</div>
          )}
        </main>

        {/* ── Right panel: log + prompt ── */}
        <aside className="main-right">
          <ActivityLog logs={logs} />

          <div className="divider" />

          <PromptInput
            agents={agents}
            targetId={promptTarget}
            onTarget={id => { setPromptTarget(id); setSelectedId(id || null) }}
            onSend={handleSend}
          />
        </aside>
      </div>
    </>
  )
}
