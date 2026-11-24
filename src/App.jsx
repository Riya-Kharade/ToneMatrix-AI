import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Database,
  GitCompare,
  History as HistoryIcon,
  Info,
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  Search,
  Bell,
  Settings as SettingsIcon,
  Smile,
  UserRound,
  X,
} from 'lucide-react'
import Home from './pages/Home'
import Sentiment from './pages/Sentiment'
import Sarcasm from './pages/Sarcasm'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Analyze from './pages/Analyze'
import History from './pages/History'
import Research from './pages/Research'
import Models from './pages/Models'
import Dataset from './pages/Dataset'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import { useLanguage } from './context/LanguageContext'
import './App.css'

function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navGroups = [
    {
      titleKey: 'navMain',
      items: [
        { labelKey: 'navDashboard', to: '/', icon: LayoutDashboard },
        { labelKey: 'navSentiment', to: '/sentiment', icon: Smile },
        { labelKey: 'navSarcasm', to: '/sarcasm', icon: MessageCircleMore },
        { labelKey: 'navAnalyze', to: '/analyze', icon: BrainCircuit },
        { labelKey: 'navHistory', to: '/history', icon: HistoryIcon },
      ],
    },
    {
      titleKey: 'navResearchGroup',
      items: [
        { labelKey: 'navModels', to: '/models', icon: GitCompare },
        { labelKey: 'navDataset', to: '/dataset', icon: Database },
        { labelKey: 'navAnalytics', to: '/analytics', icon: BarChart3 },
        { labelKey: 'navResearchPage', to: '/research', icon: BookOpen },
      ],
    },
    {
      titleKey: 'navSystem',
      items: [
        { labelKey: 'navAbout', to: '/about', icon: Info },
        { labelKey: 'navSettings', to: '/settings', icon: SettingsIcon },
      ],
    },
  ]

  const pageNameKeys = {
    '/': 'pageDashboard',
    '/analyze': 'pageAnalyze',
    '/sentiment': 'pageSentiment',
    '/sarcasm': 'pageSarcasm',
    '/history': 'pageHistory',
    '/research': 'pageResearch',
    '/models': 'pageModels',
    '/dataset': 'pageDataset',
    '/analytics': 'pageAnalytics',
    '/about': 'pageAbout',
    '/settings': 'pageSettings',
  }

  // English page names for search matching
  const pageNamesEn = {
    '/': 'Dashboard',
    '/analyze': 'Analyze Text',
    '/sentiment': 'Sentiment Analysis',
    '/sarcasm': 'Sarcasm Analysis',
    '/history': 'Analysis History',
    '/research': 'Research Results',
    '/models': 'Model Comparison',
    '/dataset': 'Dataset Explorer',
    '/analytics': 'Analytics',
    '/about': 'About',
    '/settings': 'Settings',
  }

  const currentPageKey = pageNameKeys[location.pathname] || 'pageDashboard'
  const currentPage = t(currentPageKey)

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchQuery.trim().toLowerCase()
    if (!query) return

    const match = Object.entries(pageNamesEn).find(([path, label]) =>
      `${label} ${path}`.toLowerCase().includes(query),
    )

    if (match) {
      navigate(match[0])
      setSearchMessage('')
    } else {
      setSearchMessage('No matching workspace found.')
    }
  }

  return (
    <div className="app-shell">
      <button
        className={`sidebar-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
        aria-label="Close navigation menu"
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand-box">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 56 56" role="presentation">
              <path className="brand-mark-t" d="M15 16h26M28 16v25" />
              <path className="brand-mark-line" d="M15 16 10 11M41 16l5-5M28 41l-5 5M28 28l12-7" />
              <circle className="brand-mark-node" cx="10" cy="11" r="2.5" />
              <circle className="brand-mark-node" cx="46" cy="11" r="2.5" />
              <circle className="brand-mark-node" cx="23" cy="46" r="2.5" />
              <circle className="brand-mark-node" cx="40" cy="21" r="2.5" />
            </svg>
          </div>
          <div className="brand-copy">
            <div className="brand-name">TONEMATRIX AI</div>
            <div className="brand-subtitle">Marathi NLP Research</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.titleKey}>
              <div className="nav-group-label">{t(group.titleKey)}</div>
              <div className="nav-group-items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                    end={item.to === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">
                      <item.icon size={18} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span>{t(item.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="profile-box">
          <div className="profile-avatar">RS</div>
          <div className="profile-text">
            <strong>Riya Sunil Kharade</strong>
            <span>Student Researcher</span>
          </div>
          <button className="profile-chevron" aria-label="Profile settings">
            <ChevronRight size={17} strokeWidth={2} />
          </button>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-main">
              <button
                className="mobile-menu-button"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={2} />
            </button>
            <div>
              <h1>{currentPage}</h1>
              <div className="breadcrumb">{t('breadcrumbHome')} <span>/</span> {currentPage}</div>
            </div>
          </div>

          <div className="topbar-actions">
            <form className="search-box" onSubmit={handleSearch} role="search">
              <Search size={17} className="search-icon" aria-hidden="true" />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setSearchMessage('')
                }}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
              />
              {searchMessage && <span className="search-message" role="status">{searchMessage}</span>}
            </form>
            <div className="header-popover-wrap">
              <button className="top-icon" aria-label={t('notifications')} aria-expanded={isNotificationsOpen} onClick={() => {
                setIsNotificationsOpen((open) => !open)
                setIsProfileOpen(false)
              }}>
                <Bell size={18} />
              </button>
              {isNotificationsOpen && (
                <div className="header-popover notification-popover">
                  <div className="popover-heading"><strong>{t('notifications')}</strong><button aria-label="Close notifications" onClick={() => setIsNotificationsOpen(false)}><X size={15} /></button></div>
                  <p>{t('noNotifications')}</p>
                </div>
              )}
            </div>
            <div className="header-popover-wrap">
              <button className="user-pill" aria-label="Profile menu" aria-expanded={isProfileOpen} onClick={() => {
                setIsProfileOpen((open) => !open)
                setIsNotificationsOpen(false)
              }}>
                <span className="user-avatar"><UserRound size={16} /></span>
              </button>
              {isProfileOpen && (
                <div className="header-popover profile-popover">
                  <strong>Riya Sunil Kharade</strong>
                  <span>Student Researcher</span>
                  <button onClick={() => { navigate('/settings'); setIsProfileOpen(false) }}>{t('openSettings')} <ArrowRight size={14} /></button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/sarcasm" element={<Sarcasm />} />
            <Route path="/history" element={<History />} />
            <Route path="/research" element={<Research />} />
            <Route path="/models" element={<Models />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App