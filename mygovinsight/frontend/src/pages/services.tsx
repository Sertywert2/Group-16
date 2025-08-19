import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Heart,
  Car,
  Shield,
  Briefcase,
  Home,
  Users,
  Zap,
  TreePine,
  Gavel,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    id: "health",
    title: "Health Services",
    description: "Hospitals, clinics, public health programs, and medical facilities",
    icon: Heart,
    color: "bg-red-50 text-red-600",
    institutions: ["Ministry of Health", "Public Hospitals", "Health Centers"],
  },
  {
    id: "education",
    title: "Education",
    description: "Schools, universities, educational programs, and learning resources",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600",
    institutions: ["Ministry of Education", "Public Schools", "Universities"],
  },
  {
    id: "transportation",
    title: "Transportation",
    description: "Public transit, roads, traffic management, and infrastructure",
    icon: Car,
    color: "bg-green-50 text-green-600",
    institutions: ["Transport Authority", "Traffic Police", "Public Transit"],
  },
  {
    id: "public-safety",
    title: "Public Safety",
    description: "Police services, emergency response, and community safety",
    icon: Shield,
    color: "bg-orange-50 text-orange-600",
    institutions: ["Police Department", "Fire Department", "Emergency Services"],
  },
  {
    id: "employment",
    title: "Employment Services",
    description: "Job placement, unemployment benefits, and workforce development",
    icon: Briefcase,
    color: "bg-purple-50 text-purple-600",
    institutions: ["Labor Department", "Employment Centers", "Skills Development"],
  },
  {
    id: "housing",
    title: "Housing & Urban Planning",
    description: "Public housing, urban development, and city planning services",
    icon: Home,
    color: "bg-indigo-50 text-indigo-600",
    institutions: ["Housing Authority", "Urban Planning", "Building Permits"],
  },
  {
    id: "social-services",
    title: "Social Services",
    description: "Welfare programs, social assistance, and community support",
    icon: Users,
    color: "bg-pink-50 text-pink-600",
    institutions: ["Social Welfare", "Community Centers", "Support Programs"],
  },
  {
    id: "utilities",
    title: "Public Utilities",
    description: "Water, electricity, waste management, and utility services",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    institutions: ["Water Authority", "Electric Company", "Waste Management"],
  },
  {
    id: "environment",
    title: "Environment",
    description: "Environmental protection, parks, and conservation programs",
    icon: TreePine,
    color: "bg-emerald-50 text-emerald-600",
    institutions: ["Environmental Agency", "Parks Department", "Conservation"],
  },
  {
    id: "legal",
    title: "Legal & Justice",
    description: "Courts, legal aid, and justice system services",
    icon: Gavel,
    color: "bg-slate-50 text-slate-600",
    institutions: ["Court System", "Legal Aid", "Justice Department"],
  },
  {
    id: "municipal",
    title: "Municipal Services",
    description: "Local government services, permits, and administrative functions",
    icon: Building2,
    color: "bg-cyan-50 text-cyan-600",
    institutions: ["City Hall", "Municipal Offices", "Local Government"],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to home</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">English En</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">GovInsight</span>
            <span className="text-2xl font-bold text-blue-600">Pro</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select a Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the government service or sector you'd like to provide feedback on. Your input helps improve public
            services for everyone.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Link key={service.id} to={`/feedback?service=${service.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Related Institutions:</p>
                      <div className="flex flex-wrap gap-2">
                        {service.institutions.slice(0, 2).map((institution, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {institution}
                          </span>
                        ))}
                        {service.institutions.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{service.institutions.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-6">
              If your concern doesn't fit into any of the categories above, you can still submit general feedback.
            </p>
            <Link to="/feedback">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
                Submit General Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
