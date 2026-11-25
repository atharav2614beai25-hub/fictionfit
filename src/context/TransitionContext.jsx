import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import TransitionOverlay from '../components/TransitionOverlay.jsx'

const TransitionContext = createContext(null)
export const usePageTransition = () => useContext(TransitionContext)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [fx, setFx] = useState(null)            // null = no transition running
  const timers = useRef([])

  const stopTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  // Play the collection's transition, change page in the middle, then fade out.
  const openPage = useCallback((path, collection) => {
    if (reduce || !collection) { navigate(path); return }       // reduced motion: no effect
    setFx({
      path, name: collection.name, accent: collection.accent, panel: collection.panel,
      kind: collection.kind === 'Anime' ? 'energy' : 'film',    // anime = particles, others = film
    })
    timers.current.push(setTimeout(() => navigate(path), 650))
    timers.current.push(setTimeout(() => setFx(null), 1300))
  }, [navigate, reduce])

  // Skip: go to the page straight away and remove the overlay.
  const skip = useCallback(() => {
    if (!fx) return
    stopTimers()
    navigate(fx.path)
    setFx(null)
  }, [fx, navigate])

  useEffect(() => {
    if (!fx) return
    const onKey = (e) => { if (e.key === 'Escape') skip() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fx, skip])

  return (
    <TransitionContext.Provider value={{ openPage }}>
      {children}
      <TransitionOverlay fx={fx} onSkip={skip} />
    </TransitionContext.Provider>
  )
}
