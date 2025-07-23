import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'

// Pages
import UserApplicationForm from '@/pages/UserApplicationForm'
import AdminDashboard from '@/pages/AdminDashboard'
import CertificateVerification from '@/pages/CertificateVerification'
import AdminLogin from '@/pages/AdminLogin'
import HomePage from '@/pages/HomePage'

// Components
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async (userId: string) => {
    try {
      const adminUsers = await blink.db.adminUsers.list({
        where: { userId: userId }
      })
      setIsAdmin(adminUsers.length > 0)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Check if user is admin
      if (state.user) {
        checkAdminStatus(state.user.id)
      } else {
        setIsAdmin(false)
      }
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} isAdmin={isAdmin} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<UserApplicationForm user={user} />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard isAdmin={isAdmin} />} />
            <Route path="/certificate/:certificateId" element={<CertificateVerification />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App