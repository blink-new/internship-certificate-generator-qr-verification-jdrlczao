import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, User, LogOut, Shield } from 'lucide-react'
import { blink } from '@/blink/client'

interface NavbarProps {
  user: any
  isAdmin: boolean
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const location = useLocation()

  const handleLogout = () => {
    blink.auth.logout()
  }

  const handleLogin = () => {
    blink.auth.login()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-slate-900">
              Certificate Generator
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            
            {user && (
              <Link
                to="/apply"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/apply'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Apply for Certificate
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                  location.pathname === '/admin/dashboard'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Admin
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}