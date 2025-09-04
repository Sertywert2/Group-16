import { useState, useEffect } from "react"
import { Link, useSearchParams, useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, Upload, Star } from "lucide-react"
import { FeedbackApi } from "@/lib/api"
import { auth } from "@/lib/auth"

const serviceData = {
  health: {
    name: "Health Services",
    institutions: ["Ministry of Health", "Public Hospitals", "Health Centers", "Medical Clinics"],
  },
  education: {
    name: "Education",
    institutions: ["Ministry of Education", "Public Schools", "Universities", "Technical Colleges"],
  },
  transportation: {
    name: "Transportation",
    institutions: ["Transport Authority", "Traffic Police", "Public Transit", "Road Maintenance"],
  },
  "public-safety": {
    name: "Public Safety",
    institutions: ["Police Department", "Fire Department", "Emergency Services", "Security Forces"],
  },
  employment: {
    name: "Employment Services",
    institutions: ["Labor Department", "Employment Centers", "Skills Development", "Job Placement"],
  },
  housing: {
    name: "Housing & Urban Planning",
    institutions: ["Housing Authority", "Urban Planning", "Building Permits", "City Council"],
  },
  "social-services": {
    name: "Social Services",
    institutions: ["Social Welfare", "Community Centers", "Support Programs", "Family Services"],
  },
  utilities: {
    name: "Public Utilities",
    institutions: ["Water Authority", "Electric Company", "Waste Management", "Gas Services"],
  },
  environment: {
    name: "Environment",
    institutions: ["Environmental Agency", "Parks Department", "Conservation", "Wildlife Protection"],
  },
  legal: {
    name: "Legal & Justice",
    institutions: ["Court System", "Legal Aid", "Justice Department", "Public Prosecutor"],
  },
  municipal: {
    name: "Municipal Services",
    institutions: ["City Hall", "Municipal Offices", "Local Government", "Public Works"],
  },
}

export default function FeedbackPage() {
  const [searchParams] = useSearchParams()
  const { service: serviceParam } = useParams()
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [comment, setComment] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Read service parameter from URL (both query param and path param) and set initial sector
  useEffect(() => {
    // First try to get from URL path parameter (e.g., /feedback-on-police-abuse)
    let service = serviceParam
    
    // If not found, try query parameter (e.g., /feedback?service=public-safety)
    if (!service) {
      service = searchParams.get('service')
    }
    
    // Convert URL-friendly names to service IDs
    const serviceMapping: Record<string, string> = {
      'police-abuse': 'public-safety',
      'health-services': 'health',
      'education-services': 'education',
      'transport-issues': 'transportation',
      'employment-services': 'employment',
      'housing-issues': 'housing',
      'social-services': 'social-services',
      'utility-issues': 'utilities',
      'environmental-issues': 'environment',
      'legal-issues': 'legal',
      'municipal-services': 'municipal'
    }
    
    // Map URL parameter to service ID
    const mappedService = service ? (serviceMapping[service] || service) : null
    
    console.log('URL service parameter:', service)
    console.log('Mapped service:', mappedService)
    console.log('Available services:', Object.keys(serviceData))
    console.log('Current selectedSector state before update:', selectedSector)
    
    if (mappedService && serviceData[mappedService as keyof typeof serviceData]) {
      console.log('Setting selected sector to:', mappedService)
      // Force re-render by using a timeout to ensure state update is processed
      setTimeout(() => {
        setSelectedSector(mappedService)
      }, 0)
    } else {
      console.log('Service parameter not found or invalid')
    }
  }, [searchParams, serviceParam])

  

  const availableInstitutions = selectedSector
    ? serviceData[selectedSector as keyof typeof serviceData]?.institutions || []
    : []

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const token = auth.getToken()
    if (!token) {
      setError("You need to be logged in to submit feedback.")
      return
    }
    if (!selectedSector || !selectedInstitution || rating === 0 || !comment.trim()) {
      setError("Please fill all required fields and provide a rating.")
      return
    }
    const form = new FormData()
    form.append("comment", comment)
    form.append("rating", String(rating))
    // Optionally include sector/institution if backend later supports
    form.append("sector", selectedSector)
    form.append("institution", selectedInstitution)
    if (files) {
      Array.from(files).forEach((f) => form.append("feedbackFiles", f))
    }
    setSubmitting(true)
    try {
      await FeedbackApi.submit(form, token)
      setSuccess("Feedback submitted successfully.")
      // reset minimal fields
      setComment("")
      setFiles(null)
      setRating(0)
    } catch (err: any) {
      setError(err?.message || "Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between p-4 mb-4">
        <Link to="/listings" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to services</span>
        </Link>
        <span className="text-sm text-gray-500">English En</span>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">CivicVoice </span>
              <span className="text-2xl font-bold text-blue-600">Et</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Feedback</h2>
            <p className="text-gray-600">Share your conversation with gov't institution</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Sector <span className="text-red-500">*</span>
              </label>
              {selectedSector && serviceData[selectedSector as keyof typeof serviceData] && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Selected: {serviceData[selectedSector as keyof typeof serviceData].name}
                    </span>
                  </div>
                </div>
              )}
              <Select
                key={selectedSector} // Force re-render when selectedSector changes
                value={selectedSector}
                onValueChange={(value) => {
                  setSelectedSector(value)
                  setSelectedInstitution("") // Reset institution when sector changes
                }}
              >
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(serviceData).map(([key, service]) => (
                    <SelectItem key={key} value={key}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Institution <span className="text-red-500">*</span>
              </label>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution} disabled={!selectedSector}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
                  <SelectValue placeholder={selectedSector ? "Select an institution" : "Select a sector first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableInstitutions.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue in detail <span className="text-red-500">*</span>
              </label>
              <Textarea
                className="w-full h-32 bg-gray-50 border-gray-200 rounded-lg resize-none"
                placeholder="Describe the issue..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 h-12 px-6 border border-gray-300 rounded-lg bg-transparent cursor-pointer w-fit">
                <Upload className="h-4 w-4" />
                <span>Select files</span>
                <input type="file" multiple className="hidden" onChange={(e) => setFiles(e.target.files)} />
              </label>
              {files && files.length > 0 && (
                <div className="text-sm text-gray-600 mt-2">{files.length} file(s) selected</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate your experience <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= (hoveredStar || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="pt-4">
              <Button type="submit" disabled={submitting} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                {submitting ? "Submitting..." : "Submit feedback"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
