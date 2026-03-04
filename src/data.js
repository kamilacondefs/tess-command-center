// ── Models ────────────────────────────────────────────
export const MODELS = {
  gpt4:    { id: 'gpt4',    label: 'GPT-4o',       color: '#10A37F', bg: 'rgba(16,163,127,0.1)',  border: 'rgba(16,163,127,0.22)' },
  claude:  { id: 'claude',  label: 'Claude 3.5',   color: '#D97706', bg: 'rgba(217,119,6,0.1)',   border: 'rgba(217,119,6,0.22)'  },
  gemini:  { id: 'gemini',  label: 'Gemini 1.5',   color: '#4285F4', bg: 'rgba(66,133,244,0.1)',  border: 'rgba(66,133,244,0.22)' },
  llama:   { id: 'llama',   label: 'Llama 3.3',    color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.22)' },
  mistral: { id: 'mistral', label: 'Mistral L',    color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.22)'  },
  grok:    { id: 'grok',    label: 'Grok 2',       color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
  cohere:  { id: 'cohere',  label: 'Command R+',   color: '#39C3C3', bg: 'rgba(57,195,195,0.1)',  border: 'rgba(57,195,195,0.22)' },
  command: { id: 'command', label: 'DeepSeek R1',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.22)' },
}

// ── Status config ─────────────────────────────────────
export const STATUS = {
  thinking:  { label: 'Thinking',  color: '#F4B942', pulse: true  },
  executing: { label: 'Executing', color: '#6C63FF', pulse: true  },
  done:      { label: 'Done',      color: '#00C896', pulse: false },
  idle:      { label: 'Idle',      color: '#30303E', pulse: false },
  error:     { label: 'Error',     color: '#FF5A5A', pulse: true  },
}

// ── Initial agents ────────────────────────────────────
export const INITIAL_AGENTS = [
  {
    id: 'ag-001',
    name: 'DATAWVR',
    task: 'Analyzing Q4 financial reports & projections',
    model: 'gpt4',
    status: 'executing',
    progress: 67,
    tokens: 12840,
    startedAt: Date.now() - 142_000,
    latestLog: 'Parsing revenue breakdown by segment...',
    sparkSeed: 1,
  },
  {
    id: 'ag-002',
    name: 'RSRCHBOT',
    task: 'Competitive landscape analysis — 18 companies',
    model: 'claude',
    status: 'thinking',
    progress: 32,
    tokens: 5210,
    startedAt: Date.now() - 88_000,
    latestLog: 'Evaluating market share dynamics Q3→Q4...',
    sparkSeed: 2,
  },
  {
    id: 'ag-003',
    name: 'CODEFRGE',
    task: 'Refactoring auth module + unit tests',
    model: 'llama',
    status: 'executing',
    progress: 85,
    tokens: 22100,
    startedAt: Date.now() - 310_000,
    latestLog: 'Writing tests for OAuth2 PKCE handler...',
    sparkSeed: 3,
  },
  {
    id: 'ag-004',
    name: 'SUMMRYAI',
    task: 'Digest of 47 user research interviews',
    model: 'gemini',
    status: 'done',
    progress: 100,
    tokens: 18450,
    startedAt: Date.now() - 520_000,
    latestLog: 'Report complete — 12 key themes extracted.',
    sparkSeed: 4,
  },
  {
    id: 'ag-005',
    name: 'TRNSLTRX',
    task: 'Localizing product docs to 6 languages',
    model: 'mistral',
    status: 'thinking',
    progress: 48,
    tokens: 8800,
    startedAt: Date.now() - 201_000,
    latestLog: 'Aligning terminology in PT-BR locale...',
    sparkSeed: 5,
  },
  {
    id: 'ag-006',
    name: 'SEOSNTL',
    task: 'Keyword gap analysis — 3,200 target URLs',
    model: 'grok',
    status: 'idle',
    progress: 0,
    tokens: 0,
    startedAt: Date.now() - 5_000,
    latestLog: 'Awaiting crawl job completion signal...',
    sparkSeed: 6,
  },
  {
    id: 'ag-007',
    name: 'CTXTCMPR',
    task: 'Long-context compression pipeline test',
    model: 'cohere',
    status: 'executing',
    progress: 54,
    tokens: 34200,
    startedAt: Date.now() - 440_000,
    latestLog: 'Compressing context window chunk #7/12...',
    sparkSeed: 7,
  },
  {
    id: 'ag-008',
    name: 'REASONR1',
    task: 'Multi-step reasoning over legal corpus',
    model: 'command',
    status: 'thinking',
    progress: 18,
    tokens: 3100,
    startedAt: Date.now() - 62_000,
    latestLog: 'Chain-of-thought: step 3 of ~14...',
    sparkSeed: 8,
  },
]

// ── Log message templates ─────────────────────────────
export const LOG_MSGS = [
  n => `Running inference batch #${Math.floor(Math.random()*200+1)}`,
  n => `Confidence score: ${(Math.random()*15+82).toFixed(2)}%`,
  n => `Writing ${Math.floor(Math.random()*400+200)} tokens to context`,
  n => `Cross-referencing knowledge index`,
  n => `Tool call → web_fetch() → ${Math.floor(Math.random()*10+2)} results`,
  n => `Spawning sub-task for deeper analysis`,
  n => `Generating structured output schema`,
  n => `Validating response format`,
  n => `Retrying with temperature ${(Math.random()*0.4+0.4).toFixed(2)}`,
  n => `Document chunk ${Math.floor(Math.random()*8+1)}/${Math.floor(Math.random()*4+8)} processed`,
  n => `Embedding similarity: ${(Math.random()*0.2+0.78).toFixed(4)}`,
  n => `Context window ${Math.floor(Math.random()*30+50)}% — headroom OK`,
]

export const SYS_MSGS = [
  `Routing optimized → latency ${Math.floor(Math.random()*20+40)}ms`,
  `Cache hit rate ${(Math.random()*10+88).toFixed(1)}%`,
  `Memory pressure nominal · ${Math.floor(Math.random()*3+3)} active contexts`,
  `LLM gateway healthy · 270 providers reachable`,
  `Token quota refresh in ${Math.floor(Math.random()*50+10)}min`,
  `Replica ${['us-east-1','eu-west-2','ap-southeast-1'][Math.floor(Math.random()*3)]} serving`,
]

// ── Time formatting ───────────────────────────────────
export function nowHMS() {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join(':')
}

export function elapsed(startedAt) {
  const s = Math.floor((Date.now() - startedAt) / 1000)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s/60)}m ${String(s%60).padStart(2,'0')}s`
  return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`
}

// ── Deterministic sparkline from seed ────────────────
export function makeSpark(seed, length = 14) {
  const out = []
  let v = 40 + (seed * 17) % 30
  for (let i = 0; i < length; i++) {
    v += ((seed * (i+1) * 7919) % 30) - 14
    v  = Math.max(10, Math.min(90, v))
    out.push(v)
  }
  return out
}
