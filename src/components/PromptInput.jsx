import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PromptInput({ agents, targetId, onTarget, onSend }) {
  const [text, setText] = useState('')

  const fire = () => {
    const t = text.trim()
    if (!t || !targetId) return
    onSend(targetId, t)
    setText('')
  }

  return (
    <div className="prompt-panel">
      <div className="section-label" style={{ marginBottom: 0 }}>Send Instruction</div>

      <select
        className="prompt-select"
        value={targetId}
        onChange={e => onTarget(e.target.value)}
      >
        <option value="">— choose agent —</option>
        {agents.map(a => (
          <option key={a.id} value={a.id} style={{ background: '#0C0C18' }}>
            {a.name}  ·  {a.status.toUpperCase()}
          </option>
        ))}
      </select>

      <div className="prompt-row">
        <input
          className="prompt-input"
          placeholder="Type a new instruction…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fire()}
        />
        <motion.button
          className="send-btn"
          onClick={fire}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Send arrow icon inline */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M13 7.5L2 2l2.5 5.5L2 13l11-5.5z" fill="white"/>
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
