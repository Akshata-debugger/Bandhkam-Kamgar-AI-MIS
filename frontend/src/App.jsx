import { useEffect, useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import HomePage from './components/HomePage'
import WorkerManagement from './components/WorkerManagement'
import StaffLogin from './components/StaffLogin'
import StaffManagement from './components/StaffManagement'
import ProfileMenu from './components/ProfileMenu'
import PublicCmsPage from './components/PublicCmsPage'
import LeadershipCards from './components/LeadershipCards'
import PublicGallery from './components/PublicGallery'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function Portal() {
  const { session } = useAuth()
  const publicPages = ['about','mission','leadership','schemes','gallery','news','notices','feedback','contact']
  const initialHash = window.location.hash.replace('#','')
  const [view, setView] = useState(initialHash === 'workers' ? 'workers' : initialHash === 'staff' ? 'staff' : publicPages.includes(initialHash) ? 'public' : 'home')
  useEffect(() => {
    const syncView = () => { const hash=window.location.hash.replace('#',''); setView(hash === 'workers' ? 'workers' : hash === 'staff' ? 'staff' : publicPages.includes(hash) ? 'public' : 'dashboard') }
    window.addEventListener('hashchange', syncView)
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  let content
  if (view === 'home') content = <HomePage onOpenDashboard={() => setView(session ? 'dashboard' : 'login')} />
  else if (view === 'public') content = window.location.hash === '#leadership' ? <LeadershipCards /> : window.location.hash === '#gallery' ? <PublicGallery /> : <PublicCmsPage />
  else if (view === 'login' || !session) content = <StaffLogin onBack={() => setView('home')} onSuccess={() => setView('dashboard')} />
  else if (view === 'workers') content = <WorkerManagement onBack={() => { window.location.hash = '#dashboard'; setView('dashboard') }} />
  else if (view === 'staff') content = session.user.role === 'admin' ? <StaffManagement onBack={() => { window.location.hash = '#dashboard'; setView('dashboard') }} /> : <StaffLogin onBack={() => setView('home')} onSuccess={() => setView('dashboard')} />
  else content = <AdminDashboard onOpenWebsite={() => setView('home')} />

  return session && !['home', 'login'].includes(view) ? <><ProfileMenu />{content}</> : content
}

function App() { return <AuthProvider><Portal /></AuthProvider> }

export default App
