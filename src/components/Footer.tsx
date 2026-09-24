import { Link } from 'react-router-dom'
import Logo from './Logo'
import { footerRoutes, preloadSiteRoute } from '../siteRoutes'

const socialLinks = [
  { href: 'https://blog.zzzxc.com/', label: '博客', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { href: 'https://github.com/agenticnoob', label: 'GitHub', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' },
  { href: 'https://leetcode.cn/u/skedush/', label: 'LeetCode', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[var(--xuli-bg-secondary)]/70 border-t-2 border-dashed border-[var(--xuli-border)]/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <p className="text-primary font-display font-bold">AXMORF · 工程师工作手账</p>
              <p className="text-tertiary text-sm">把问题、过程与作品留在纸面上</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerRoutes.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => preloadSiteRoute(link)}
                onFocus={() => preloadSiteRoute(link)}
                className="text-tertiary hover:text-secondary transition-colors duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary hover:text-accent transition-colors duration-200"
                aria-label={link.label}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--xuli-border)] text-center">
          <p className="text-tertiary text-xs">
            © {new Date().getFullYear()} AXMORF · 用 React + TypeScript 写下这本手账。
          </p>
        </div>
      </div>
    </footer>
  )
}
