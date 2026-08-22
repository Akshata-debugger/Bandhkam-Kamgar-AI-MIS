import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import HomePage from './components/HomePage'
import './App.css'

function App() {
  const [view, setView] = useState('home')

  return view === 'home'
    ? <HomePage onOpenDashboard={() => setView('dashboard')} />
    : <AdminDashboard onOpenWebsite={() => setView('home')} />
}

export default App
