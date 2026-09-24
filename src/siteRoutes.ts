import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface SiteRoute {
  path: string
  label: string
  englishLabel: string
  showInFooter: boolean
  Component: LazyExoticComponent<ComponentType>
}

export const siteRoutes: SiteRoute[] = [
  {
    path: '/',
    label: '首页',
    englishLabel: 'Home',
    showInFooter: true,
    Component: lazy(() => import('./pages/Home')),
  },
  {
    path: '/about',
    label: '关于',
    englishLabel: 'About',
    showInFooter: true,
    Component: lazy(() => import('./pages/About')),
  },
  {
    path: '/skills',
    label: '技能',
    englishLabel: 'Skills',
    showInFooter: true,
    Component: lazy(() => import('./pages/Skills')),
  },
  {
    path: '/experience',
    label: '经历',
    englishLabel: 'Experience',
    showInFooter: true,
    Component: lazy(() => import('./pages/Experience')),
  },
  {
    path: '/projects',
    label: '项目',
    englishLabel: 'Projects',
    showInFooter: true,
    Component: lazy(() => import('./pages/Projects')),
  },
  {
    path: '/education',
    label: '教育',
    englishLabel: 'Education',
    showInFooter: true,
    Component: lazy(() => import('./pages/Education')),
  },
  {
    path: '/ai-philosophy',
    label: 'AI思考',
    englishLabel: 'AI Thinking',
    showInFooter: true,
    Component: lazy(() => import('./pages/AIPhilosophy')),
  },
  {
    path: '/development-log',
    label: 'Agent工程',
    englishLabel: 'Agent Engineering',
    showInFooter: false,
    Component: lazy(() => import('./pages/DevelopmentLog')),
  },
  {
    path: '/vibe-journal',
    label: '实践日志',
    englishLabel: 'Practice Journal',
    showInFooter: false,
    Component: lazy(() => import('./pages/VibeJournal')),
  },
]

export const footerRoutes = siteRoutes.filter((route) => route.showInFooter)
