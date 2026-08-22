import { useEffect, useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import HomePage from './components/HomePage'
import WorkerManagement from './components/WorkerManagement'
import './App.css'

function App() {
  const [view, setView] = useState(window.location.hash === '#workers' ? 'workers' : 'home')
  useEffect(() => {
    const syncView = () => setView(window.location.hash === '#workers' ? 'workers' : 'dashboard')
    window.addEventListener('hashchange', syncView)
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  if (view === 'home') return <HomePage onOpenDashboard={() => setView('dashboard')} />
  if (view === 'workers') return <WorkerManagement onBack={() => { window.location.hash = '#dashboard'; setView('dashboard') }} />
  return <AdminDashboard onOpenWebsite={() => setView('home')} />
}

export default App
