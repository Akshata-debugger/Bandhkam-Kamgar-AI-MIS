import { useEffect, useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import HomePage from './components/HomePage'
import WorkerManagement from './components/WorkerManagement'
import StaffLogin from './components/StaffLogin'
import StaffManagement from './components/StaffManagement'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function Portal() {
  const { session } = useAuth()
  const [view, setView] = useState(window.location.hash === '#workers' ? 'workers' : window.location.hash === '#staff' ? 'staff' : 'home')
  useEffect(() => {
    const syncView = () => setView(window.location.hash === '#workers' ? 'workers' : window.location.hash === '#staff' ? 'staff' : 'dashboard')
    window.addEventListener('hashchange', syncView)
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  if (view === 'home') return <HomePage onOpenDashboard={() => setView(session ? 'dashboard' : 'login')} />
  if (view === 'login') return <StaffLogin onBack={() => setView('home')} onSuccess={() => setView('dashboard')} />
  if (!session) return <StaffLogin onBack={() => setView('home')} onSuccess={() => setView('dashboard')} />
  if (view === 'workers') return <WorkerManagement onBack={() => { window.location.hash = '#dashboard'; setView('dashboard') }} />
  if (view === 'staff') return session.user.role === 'admin' ? <StaffManagement onBack={() => { window.location.hash = '#dashboard'; setView('dashboard') }} /> : <StaffLogin onBack={() => setView('home')} onSuccess={() => setView('dashboard')} />
  return <AdminDashboard onOpenWebsite={() => setView('home')} />
}

function App() { return <AuthProvider><Portal /></AuthProvider> }

export default App
