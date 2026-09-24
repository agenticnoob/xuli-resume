import { Suspense, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundEffects from './components/BackgroundEffects'
import PageTransition from './components/PageTransition'
import { siteRoutes } from './siteRoutes'

function RouteStatus({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" role="status">
      <div className="paper-note bg-card px-6 py-4 text-sm text-tertiary">{message}</div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="sketch-card bg-card max-w-lg p-8 text-center">
        <span className="eyebrow-note">404</span>
        <h1 className="font-display text-3xl text-primary mt-3 mb-3">这页手记还没有写</h1>
        <p className="text-secondary mb-6">请检查地址，或回到首页继续查看。</p>
        <Link to="/" className="btn btn-primary">
          返回首页
        </Link>
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-bg layout-shell">
      <div className="fixed inset-0 paper-grid pointer-events-none" aria-hidden="true" />
      <BackgroundEffects />
      <Navbar />
      <main className="relative z-10 layout-content">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Suspense fallback={<RouteStatus message="正在翻开手记…" />}>
              <Routes location={location}>
                {siteRoutes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
