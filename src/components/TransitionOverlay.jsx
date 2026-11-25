import { motion, AnimatePresence } from 'framer-motion'

const dots = Array.from({ length: 28 }, (_, i) => i)

// Anime collections: rising energy particles. Series and films: warm film fade with letterbox bars.
export default function TransitionOverlay({ fx, onSkip }) {
  return (
    <AnimatePresence>
      {fx && (
        <motion.div
          className={`fx fx--${fx.kind}`}
          style={{ '--accent': fx.accent, '--panel': fx.panel }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          onClick={onSkip}
          aria-hidden="true"
        >
          {fx.kind === 'energy' ? (
            dots.map((i) => (
              <motion.span
                key={i} className="fx__dot"
                style={{ left: `${(i * 37) % 100}%` }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: '-110vh', opacity: [0, 1, 0] }}
                transition={{ duration: 0.9 + (i % 5) * 0.1, delay: (i % 7) * 0.04, ease: 'easeOut' }}
              />
            ))
          ) : (
            <>
              <motion.span className="fx__bar fx__bar--top" initial={{ height: 0 }} animate={{ height: '16vh' }} transition={{ duration: 0.5 }} />
              <motion.span className="fx__bar fx__bar--bottom" initial={{ height: 0 }} animate={{ height: '16vh' }} transition={{ duration: 0.5 }} />
            </>
          )}
          <motion.p className="fx__title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
            {fx.name}
          </motion.p>
          <span className="fx__skip">Click or press Esc to skip</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
