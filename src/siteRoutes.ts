import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const loadHome = () => import('./pages/Home')
const loadAbout = () => import('./pages/About')
const loadSkills = () => import('./pages/Skills')
const loadExperience = () => import('./pages/Experience')
const loadProjects = () => import('./pages/Projects')
const loadEducation = () => import('./pages/Education')
const loadAIPhilosophy = () => import('./pages/AIPhilosophy')
const loadDevelopmentLog = () => import('./pages/DevelopmentLog')
const loadVibeJournal = () => import('./pages/VibeJournal')

function preloadVibeJournal(): Promise<unknown> {
  return Promise.all([
    loadVibeJournal(),
    import('./lib/vibeData').then(({ loadJournalSnapshot }) => loadJournalSnapshot()),
  ])
}

export interface SiteRoute {
  path: string
  label: string
  englishLabel: string
  showInFooter: boolean
  Component: LazyExoticComponent<ComponentType>
  preload: () => Promise<unknown>
}

export const siteRoutes: SiteRoute[] = [
  {
    path: '/',
    label: '首页',
    englishLabel: 'Home',
    showInFooter: true,
    Component: lazy(loadHome),
    preload: loadHome,
  },
  {
    path: '/about',
    label: '关于',
    englishLabel: 'About',
    showInFooter: true,
    Component: lazy(loadAbout),
    preload: loadAbout,
  },
  {
    path: '/skills',
    label: '技能',
    englishLabel: 'Skills',
    showInFooter: true,
    Component: lazy(loadSkills),
    preload: loadSkills,
  },
  {
    path: '/experience',
    label: '经历',
    englishLabel: 'Experience',
    showInFooter: true,
    Component: lazy(loadExperience),
    preload: loadExperience,
  },
  {
    path: '/projects',
    label: '项目',
    englishLabel: 'Projects',
    showInFooter: true,
    Component: lazy(loadProjects),
    preload: loadProjects,
  },
  {
    path: '/education',
    label: '教育',
    englishLabel: 'Education',
    showInFooter: true,
    Component: lazy(loadEducation),
    preload: loadEducation,
  },
  {
    path: '/ai-philosophy',
    label: 'AI思考',
    englishLabel: 'AI Thinking',
    showInFooter: true,
    Component: lazy(loadAIPhilosophy),
    preload: loadAIPhilosophy,
  },
  {
    path: '/development-log',
    label: 'Agent工程',
    englishLabel: 'Agent Engineering',
    showInFooter: false,
    Component: lazy(loadDevelopmentLog),
    preload: loadDevelopmentLog,
  },
  {
    path: '/vibe-journal',
    label: '实践日志',
    englishLabel: 'Practice Journal',
    showInFooter: false,
    Component: lazy(loadVibeJournal),
    preload: preloadVibeJournal,
  },
]

export const footerRoutes = siteRoutes.filter((route) => route.showInFooter)

export function preloadSiteRoute(route: SiteRoute): void {
  void route.preload().catch(() => {
    // A speculative fetch failure must not create an unhandled rejection before navigation.
  })
}
