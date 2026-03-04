import { AnimatePresence, motion } from 'framer-motion'

export default function Toasts({ items }) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {items.map(t => (
          <motion.div
            key={t.id}
            className={`toast ${t.type}`}
            initial={{ opacity: 0, x: 18, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.94 }}
            transition={{ duration: 0.22 }}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
