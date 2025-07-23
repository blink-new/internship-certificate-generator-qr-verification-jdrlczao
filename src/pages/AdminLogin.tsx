import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { blink } from '@/blink/client'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is already logged in and is admin
    const checkAuth = async () => {
      try {
        const user = await blink.auth.me()
        if (user) {
          const adminUsers = await blink.db.adminUsers.list({
            where: { userId: user.id }
          })
          if (adminUsers.length > 0) {
            navigate('/admin/dashboard')
          }
        }
      } catch (error) {
        // User not logged in, stay on login page
      }
    }
    
    checkAuth()
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check admin credentials
      const adminUsers = await blink.db.adminUsers.list({
        where: { email: email }
      })

      if (adminUsers.length === 0) {
        setError('Invalid admin credentials')
        setLoading(false)
        return
      }

      const admin = adminUsers[0]
      console.log('Admin user found:', admin)
      console.log('Entered password:', password)
      console.log('Admin password:', admin.password)
      
      // For demo purposes, we'll check against the stored password
      // In production, you'd want to hash passwords
      if (!admin.password || admin.password !== password) {
        setError('Invalid admin credentials')
        setLoading(false)
        return
      }

      // Create a session by logging in with Blink auth
      // For demo purposes, we'll use the admin email as the login
      localStorage.setItem('adminSession', JSON.stringify({
        adminId: admin.id,
        email: admin.email,
        loginTime: Date.now()
      }))

      // Redirect to admin dashboard
      navigate('/admin/dashboard')
      
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@tadcs.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">Demo Credentials</h3>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Email:</strong> admin@tadcs.in</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Use these credentials for testing the admin dashboard.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="text-slate-600"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}