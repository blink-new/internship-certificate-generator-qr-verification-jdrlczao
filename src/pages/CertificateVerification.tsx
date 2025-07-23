import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { blink } from '@/blink/client'
import { 
  Award, 
  Calendar, 
  User, 
  Building, 
  Code, 
  CheckCircle, 
  Download, 
  ExternalLink,
  AlertCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface CertificateData {
  id: string
  name: string
  email: string
  collegeName: string
  field: string
  duration: string
  startDate: string
  endDate: string
  projectTitle: string
  projectDescription: string
  projectStatus: string
  mentorFeedback: string
  additionalNotes: string
  status: string
  certificateId: string
  createdAt: string
  approvedAt: string
}

export default function CertificateVerification() {
  const { certificateId } = useParams<{ certificateId: string }>()
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCertificate = async (certId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const certificates = await blink.db.applications.list({
        where: { certificateId: certId }
      })

      if (certificates.length === 0) {
        setError('Certificate not found. Please check the certificate ID and try again.')
        return
      }

      const cert = certificates[0]
      if (cert.status !== 'approved') {
        setError('This certificate has not been approved yet.')
        return
      }

      setCertificate(cert)
    } catch (error) {
      console.error('Error loading certificate:', error)
      setError('Failed to load certificate. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (certificateId) {
      loadCertificate(certificateId)
    }
  }, [certificateId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'On Hold':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />On Hold</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Verifying certificate...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-900">Certificate Not Found</CardTitle>
            <CardDescription className="text-red-700">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
              variant="outline"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!certificate) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Certificate Verification
            </h1>
            <p className="text-lg text-slate-600">
              Official internship certificate verification page
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Verified Certificate</span>
          </div>
          
          <Badge variant="outline" className="text-sm">
            Certificate ID: {certificate.certificateId}
          </Badge>
        </div>

        {/* Certificate Details */}
        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name</label>
                  <p className="text-lg font-semibold text-slate-900">{certificate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email Address</label>
                  <p className="text-slate-900">{certificate.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-600">College/University</label>
                  <p className="text-slate-900 flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>{certificate.collegeName}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internship Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Internship Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Field/Domain</label>
                  <p className="text-slate-900 font-medium">{certificate.field}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Duration</label>
                  <p className="text-slate-900">{certificate.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Start Date</label>
                  <p className="text-slate-900">
                    {certificate.startDate ? format(new Date(certificate.startDate), 'MMMM dd, yyyy') : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">End Date</label>
                  <p className="text-slate-900">
                    {certificate.endDate ? format(new Date(certificate.endDate), 'MMMM dd, yyyy') : 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          {certificate.projectTitle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Project Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Project Title</label>
                  <p className="text-lg font-semibold text-slate-900">{certificate.projectTitle}</p>
                </div>
                
                {certificate.projectDescription && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Project Description</label>
                    <p className="text-slate-900 leading-relaxed">{certificate.projectDescription}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-600">Project Status</label>
                  <div className="mt-1">
                    {getStatusBadge(certificate.projectStatus)}
                  </div>
                </div>

                {certificate.mentorFeedback && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Mentor Feedback</label>
                    <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <p className="text-slate-900 italic">"{certificate.mentorFeedback}"</p>
                    </div>
                  </div>
                )}

                {certificate.additionalNotes && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Additional Notes</label>
                    <p className="text-slate-900 leading-relaxed">{certificate.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Certificate Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Application Submitted</label>
                  <p className="text-slate-900">
                    {format(new Date(certificate.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Certificate Approved</label>
                  <p className="text-slate-900">
                    {certificate.approvedAt ? format(new Date(certificate.approvedAt), 'MMMM dd, yyyy') : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">This certificate is authentic and verified</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Print Certificate
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border">
          <p className="text-sm text-slate-600">
            This certificate was generated and verified through our secure certificate management system.
            <br />
            For any questions or concerns, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}