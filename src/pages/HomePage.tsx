import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, FileCheck, QrCode, Shield, Users, Award } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Professional Internship
              <span className="text-blue-600"> Certificate Generator</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Apply for your internship certificate and get it verified with QR codes. 
              A professional, secure, and efficient way to manage internship certifications.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Apply for Certificate
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple, secure, and professional certificate management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>1. Apply</CardTitle>
                <CardDescription>
                  Submit your internship details including project information, 
                  duration, and mentor feedback
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>2. Admin Review</CardTitle>
                <CardDescription>
                  Admins review, edit if needed, and approve your application 
                  to generate the official certificate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>3. Get Certificate</CardTitle>
                <CardDescription>
                  Receive your professional certificate with QR code 
                  for instant verification and download
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Key Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <FileCheck className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Professional Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Beautiful, professional certificate templates that look great in print and digital formats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <QrCode className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">QR Code Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Each certificate includes a unique QR code for instant verification and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Secure database storage with admin approval workflow ensures certificate authenticity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Comprehensive admin interface for managing applications, editing details, and approvals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileCheck className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">PDF Download</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Download high-quality PDF certificates for printing or digital sharing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Project Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Include project details, photos, and mentor feedback in the verification page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Your Certificate?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your application today and get your professional internship certificate.
          </p>
          <Link to="/apply">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}