import { GraduationCap } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Loading Certificate Generator
        </h2>
        <p className="text-slate-600">Please wait while we set things up...</p>
      </div>
    </div>
  )
}