import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock } from 'lucide-react'
import { blink } from '@/blink/client'

export default function AdminLogin() {
  const navigate = useNavigate()

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

  const handleLogin = () => {
    blink.auth.login('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard and manage certificate applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Admin Access Only:</strong> This area is restricted to authorized administrators.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Admin Credentials:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> admin@tadcs.in</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Use these credentials to access the admin dashboard for testing purposes.
            </p>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Sign In as Admin
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="text-slate-600"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}