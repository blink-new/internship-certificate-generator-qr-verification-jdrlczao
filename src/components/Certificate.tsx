import { useEffect, useState } from 'react'
import { generateQRCode, formatDate } from '../utils/certificateUtils'

interface CertificateProps {
  application: {
    id: string
    certificateId: string
    name: string
    collegeName: string
    field: string
    duration: string
    startDate: string
    endDate: string
    projectTitle?: string
    projectDescription?: string
    mentorFeedback?: string
    status: string
  }
  showQR?: boolean
  className?: string
}

export default function Certificate({ application, showQR = true, className = '' }: CertificateProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (showQR && application.certificateId) {
      generateQRCode(application.certificateId)
        .then(setQrCodeUrl)
        .catch(console.error)
    }
  }, [application.certificateId, showQR])

  return (
    <div className={`bg-white border-8 border-blue-800 p-12 max-w-4xl mx-auto ${className}`} id="certificate">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-20 h-20 bg-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">TADCS</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-800 mb-2">CERTIFICATE OF COMPLETION</h1>
        <p className="text-lg text-gray-600">Internship Program</p>
        <div className="w-32 h-1 bg-amber-500 mx-auto mt-4"></div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-700 mb-6">This is to certify that</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
          {application.name}
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          from <strong>{application.collegeName}</strong>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          has successfully completed the internship program in
        </p>
        <h3 className="text-2xl font-semibold text-blue-800 mb-6">
          {application.field}
        </h3>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-gray-700"><strong>Duration:</strong> {application.duration}</p>
          <p className="text-gray-700"><strong>Start Date:</strong> {formatDate(application.startDate)}</p>
          <p className="text-gray-700"><strong>End Date:</strong> {formatDate(application.endDate)}</p>
        </div>
        <div>
          <p className="text-gray-700"><strong>Certificate ID:</strong> {application.certificateId}</p>
          <p className="text-gray-700"><strong>Status:</strong> 
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {application.status}
            </span>
          </p>
        </div>
      </div>

      {/* Project Details */}
      {application.projectTitle && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h4>
          <p className="text-gray-700 mb-2"><strong>Project:</strong> {application.projectTitle}</p>
          {application.projectDescription && (
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {application.projectDescription}</p>
          )}
          {application.mentorFeedback && (
            <p className="text-gray-700"><strong>Mentor Feedback:</strong> {application.mentorFeedback}</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-end mt-12">
        <div className="text-center">
          <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
          <p className="text-gray-700 font-semibold">Director</p>
          <p className="text-gray-600 text-sm">TADCS Institute</p>
        </div>

        {/* QR Code */}
        {showQR && qrCodeUrl && (
          <div className="text-center">
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Scan to verify</p>
          </div>
        )}

        <div className="text-center">
          <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
          <p className="text-gray-700 font-semibold">Program Coordinator</p>
          <p className="text-gray-600 text-sm">TADCS Institute</p>
        </div>
      </div>

      {/* Issue Date */}
      <div className="text-center mt-8">
        <p className="text-gray-600 text-sm">
          Issued on: {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  )
}