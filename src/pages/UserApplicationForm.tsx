import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { FileText, Upload, Calendar, User, Building, Code } from 'lucide-react'

interface UserApplicationFormProps {
  user: any
}

export default function UserApplicationForm({ user }: UserApplicationFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    collegeName: '',
    field: '',
    duration: '',
    startDate: '',
    endDate: '',
    projectTitle: '',
    projectDescription: '',
    projectStatus: 'Completed',
    mentorFeedback: '',
    additionalNotes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await blink.db.applications.create({
        id: applicationId,
        userId: user.id,
        name: formData.name,
        email: formData.email,
        collegeName: formData.collegeName,
        field: formData.field,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        projectStatus: formData.projectStatus,
        mentorFeedback: formData.mentorFeedback,
        additionalNotes: formData.additionalNotes,
        status: 'pending'
      })

      toast({
        title: "Application Submitted!",
        description: "Your certificate application has been submitted for admin review.",
      })

      // Reset form
      setFormData({
        name: '',
        email: user?.email || '',
        collegeName: '',
        field: '',
        duration: '',
        startDate: '',
        endDate: '',
        projectTitle: '',
        projectDescription: '',
        projectStatus: 'Completed',
        mentorFeedback: '',
        additionalNotes: ''
      })

    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to submit your certificate application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Apply for Internship Certificate
          </h1>
          <p className="text-lg text-slate-600">
            Fill out the form below to submit your certificate application for admin review.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              Please provide accurate information. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="collegeName">College/University Name *</Label>
                  <Input
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    placeholder="Enter your college or university name"
                    required
                  />
                </div>
              </div>

              {/* Internship Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Internship Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field">Field/Domain *</Label>
                    <Select onValueChange={(value) => handleInputChange('field', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="mobile-development">Mobile Development</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                        <SelectItem value="machine-learning">Machine Learning</SelectItem>
                        <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Select onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="2-months">2 Months</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Project Information
                </h3>
                
                <div>
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                    placeholder="Enter your project title"
                  />
                </div>

                <div>
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    placeholder="Describe your project, technologies used, and key achievements"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="projectStatus">Project Status</Label>
                  <Select 
                    value={formData.projectStatus}
                    onValueChange={(value) => handleInputChange('projectStatus', value)}
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
                </div>

                <div>
                  <Label htmlFor="mentorFeedback">Mentor Feedback</Label>
                  <Textarea
                    id="mentorFeedback"
                    value={formData.mentorFeedback}
                    onChange={(e) => handleInputChange('mentorFeedback', e.target.value)}
                    placeholder="Enter feedback from your mentor or supervisor"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information you'd like to include"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}