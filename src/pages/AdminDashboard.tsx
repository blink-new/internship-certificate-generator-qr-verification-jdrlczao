import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { Shield, Eye, Edit, Check, X, Trash2, Download, Users, Clock, CheckCircle, XCircle, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import Certificate from '../components/Certificate'
import { generateCertificatePDF } from '../utils/certificateUtils'

interface Application {
  id: string
  userId: string
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
  updatedAt: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<Application>>({})
  const [filter, setFilter] = useState('all')
  const [isAdmin, setIsAdmin] = useState(false)

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true)
      const apps = await blink.db.applications.list({
        orderBy: { createdAt: 'desc' }
      })
      setApplications(apps)
    } catch (error) {
      console.error('Error loading applications:', error)
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    // Check admin session
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('adminSession')
      if (!adminSession) {
        navigate('/admin')
        return false
      }
      
      try {
        const session = JSON.parse(adminSession)
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - session.loginTime
        if (sessionAge > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('adminSession')
          navigate('/admin')
          return false
        }
        
        setIsAdmin(true)
        return true
      } catch (error) {
        localStorage.removeItem('adminSession')
        navigate('/admin')
        return false
      }
    }

    if (checkAdminSession()) {
      loadApplications()
    }
  }, [navigate, loadApplications])

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      }

      if (newStatus === 'approved') {
        const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        updateData.certificateId = certificateId
        updateData.approvedAt = new Date().toISOString()
        updateData.approvedBy = 'admin' // You can get actual admin user ID here
      }

      await blink.db.applications.update(applicationId, updateData)
      
      toast({
        title: "Status Updated",
        description: `Application ${newStatus} successfully.`,
      })
      
      loadApplications()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedApp) return

    try {
      await blink.db.applications.update(selectedApp.id, {
        ...editData,
        updatedAt: new Date().toISOString()
      })
      
      toast({
        title: "Application Updated",
        description: "Application details have been updated successfully.",
      })
      
      setEditMode(false)
      setSelectedApp(null)
      loadApplications()
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: "Error",
        description: "Failed to update application.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return
    }

    try {
      await blink.db.applications.delete(applicationId)
      toast({
        title: "Application Deleted",
        description: "Application has been deleted successfully.",
      })
      loadApplications()
    } catch (error) {
      console.error('Error deleting application:', error)
      toast({
        title: "Error",
        description: "Failed to delete application.",
        variant: "destructive"
      })
    }
  }

  const handleDownloadPDF = async (application: Application) => {
    try {
      const certificateElement = document.getElementById('certificate-for-pdf')
      if (!certificateElement) {
        toast({
          title: "Error",
          description: "Certificate element not found. Please try again.",
          variant: "destructive"
        })
        return
      }

      const fileName = `${application.name.replace(/\s+/g, '_')}_Certificate.pdf`
      await generateCertificatePDF(certificateElement, fileName)
      
      toast({
        title: "PDF Downloaded",
        description: "Certificate PDF has been downloaded successfully.",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('adminSession')
                navigate('/admin')
              }}
            >
              Logout
            </Button>
          </div>
          <p className="text-lg text-slate-600">
            Manage certificate applications, review submissions, and approve certificates.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.approved}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.rejected}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={filter === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilter('approved')}
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({stats.rejected})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Review and manage certificate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.collegeName}</TableCell>
                        <TableCell>{app.field}</TableCell>
                        <TableCell>{app.duration}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedApp(app)
                                    setEditData(app)
                                    setEditMode(false)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {editMode ? 'Edit Application' : 'Application Details'}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {editMode ? 'Edit the application details below' : 'Review the application details and take action'}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedApp && (
                                  <div className="space-y-6">
                                    {/* Status and Actions */}
                                    {!editMode && (
                                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                          <span className="text-sm font-medium">Status:</span>
                                          {getStatusBadge(selectedApp.status)}
                                          {selectedApp.certificateId && (
                                            <Badge variant="outline">
                                              ID: {selectedApp.certificateId}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex space-x-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditMode(true)}
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                          </Button>
                                          {selectedApp.status === 'pending' && (
                                            <>
                                              <Button
                                                size="sm"
                                                onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <Check className="h-4 w-4 mr-1" />
                                                Approve
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                                              >
                                                <X className="h-4 w-4 mr-1" />
                                                Reject
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Application Details Form */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Full Name</Label>
                                        {editMode ? (
                                          <Input
                                            value={editData.name || ''}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.name}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        {editMode ? (
                                          <Input
                                            value={editData.email || ''}
                                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.email}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>College Name</Label>
                                        {editMode ? (
                                          <Input
                                            value={editData.collegeName || ''}
                                            onChange={(e) => setEditData({...editData, collegeName: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.collegeName}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Field</Label>
                                        {editMode ? (
                                          <Input
                                            value={editData.field || ''}
                                            onChange={(e) => setEditData({...editData, field: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.field}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Duration</Label>
                                        {editMode ? (
                                          <Input
                                            value={editData.duration || ''}
                                            onChange={(e) => setEditData({...editData, duration: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.duration}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Project Status</Label>
                                        {editMode ? (
                                          <Select
                                            value={editData.projectStatus || ''}
                                            onValueChange={(value) => setEditData({...editData, projectStatus: value})}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Completed">Completed</SelectItem>
                                              <SelectItem value="In Progress">In Progress</SelectItem>
                                              <SelectItem value="On Hold">On Hold</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">{selectedApp.projectStatus}</p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Start Date</Label>
                                        {editMode ? (
                                          <Input
                                            type="date"
                                            value={editData.startDate || ''}
                                            onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">
                                            {selectedApp.startDate ? format(new Date(selectedApp.startDate), 'MMM dd, yyyy') : 'Not specified'}
                                          </p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>End Date</Label>
                                        {editMode ? (
                                          <Input
                                            type="date"
                                            value={editData.endDate || ''}
                                            onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                                          />
                                        ) : (
                                          <p className="text-sm text-slate-600 mt-1">
                                            {selectedApp.endDate ? format(new Date(selectedApp.endDate), 'MMM dd, yyyy') : 'Not specified'}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Project Title</Label>
                                      {editMode ? (
                                        <Input
                                          value={editData.projectTitle || ''}
                                          onChange={(e) => setEditData({...editData, projectTitle: e.target.value})}
                                        />
                                      ) : (
                                        <p className="text-sm text-slate-600 mt-1">{selectedApp.projectTitle || 'Not specified'}</p>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Project Description</Label>
                                      {editMode ? (
                                        <Textarea
                                          value={editData.projectDescription || ''}
                                          onChange={(e) => setEditData({...editData, projectDescription: e.target.value})}
                                          rows={3}
                                        />
                                      ) : (
                                        <p className="text-sm text-slate-600 mt-1">{selectedApp.projectDescription || 'Not specified'}</p>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Mentor Feedback</Label>
                                      {editMode ? (
                                        <Textarea
                                          value={editData.mentorFeedback || ''}
                                          onChange={(e) => setEditData({...editData, mentorFeedback: e.target.value})}
                                          rows={3}
                                        />
                                      ) : (
                                        <p className="text-sm text-slate-600 mt-1">{selectedApp.mentorFeedback || 'Not specified'}</p>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Additional Notes</Label>
                                      {editMode ? (
                                        <Textarea
                                          value={editData.additionalNotes || ''}
                                          onChange={(e) => setEditData({...editData, additionalNotes: e.target.value})}
                                          rows={3}
                                        />
                                      ) : (
                                        <p className="text-sm text-slate-600 mt-1">{selectedApp.additionalNotes || 'Not specified'}</p>
                                      )}
                                    </div>

                                    {/* Certificate Preview */}
                                    {selectedApp.status === 'approved' && selectedApp.certificateId && !editMode && (
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h3 className="text-lg font-semibold">Certificate Preview</h3>
                                          <div className="flex space-x-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleDownloadPDF(selectedApp)}
                                            >
                                              <Download className="h-4 w-4 mr-1" />
                                              Download PDF
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => window.open(`/certificate/${selectedApp.certificateId}`, '_blank')}
                                            >
                                              <QrCode className="h-4 w-4 mr-1" />
                                              View QR Page
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="border rounded-lg p-4 bg-white">
                                          <div id="certificate-for-pdf">
                                            <Certificate 
                                              application={selectedApp} 
                                              showQR={true}
                                              className="scale-50 origin-top-left"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {editMode && (
                                      <div className="flex justify-end space-x-4 pt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setEditMode(false)
                                            setEditData(selectedApp)
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={handleEdit}
                                          className="bg-blue-600 hover:bg-blue-700"
                                        >
                                          Save Changes
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(app.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            {app.status === 'approved' && app.certificateId && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/certificate/${app.certificateId}`, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}