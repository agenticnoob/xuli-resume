import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { siteRoutes } from '../siteRoutes'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`site-navbar fixed top-0 left-0 right-0 z-50 isolate ${scrolled ? 'site-navbar--scrolled' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg font-semibold text-primary hidden sm:block">
              AXMORF<span className="text-accent">·工作手账</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {siteRoutes.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                className={`relative px-3 py-2 group transition-colors duration-200 ${
                  location.pathname === item.path ? 'text-accent' : 'text-secondary hover:text-primary'
                }`}
              >
                <span className="font-body text-sm tracking-wide">{item.label}</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent transition-all duration-200 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? '关闭导航菜单' : '打开导航菜单'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-[46%_54%_48%_52%] border-2 border-[var(--xuli-border)]/70 bg-[var(--xuli-bg-tertiary)] text-primary shadow-[2px_3px_0_rgba(47,55,48,0.12)]"
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-text-primary block rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-text-primary block rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-text-primary block rounded-full"
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full z-40 lg:hidden border-y border-[var(--xuli-border)]/45 bg-[var(--xuli-bg-primary)] shadow-[0_8px_0_rgba(47,55,48,0.08)]"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {siteRoutes.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-accent/10 text-accent'
                        : 'text-secondary hover:bg-card hover:text-primary'
                    }`}
                  >
                    <span className="font-body">{item.label}</span>
                    <span className="text-xs text-tertiary font-mono">{item.englishLabel}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
