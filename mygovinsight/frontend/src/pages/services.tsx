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
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"

const getServices = (t: (key: string) => string) => [
  {
    id: "health",
    title: t('services.health_title'),
    description: t('services.health_description'),
    icon: Heart,
    color: "bg-red-50 text-red-600",
    institutions: ["Ministry of Health", "Public Hospitals", "Health Centers"],
  },
  {
    id: "education",
    title: t('services.education_title'),
    description: t('services.education_description'),
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600",
    institutions: ["Ministry of Education", "Public Schools", "Universities"],
  },
  {
    id: "transportation",
    title: t('services.transportation_title'),
    description: t('services.transportation_description'),
    icon: Car,
    color: "bg-green-50 text-green-600",
    institutions: ["Transport Authority", "Traffic Police", "Public Transit"],
  },
  {
    id: "public-safety",
    title: t('services.public_safety_title'),
    description: t('services.public_safety_description'),
    icon: Shield,
    color: "bg-orange-50 text-orange-600",
    institutions: ["Police Department", "Fire Department", "Emergency Services"],
  },
  {
    id: "employment",
    title: t('services.employment_title'),
    description: t('services.employment_description'),
    icon: Briefcase,
    color: "bg-purple-50 text-purple-600",
    institutions: ["Labor Department", "Employment Centers", "Skills Development"],
  },
  {
    id: "housing",
    title: t('services.housing_title'),
    description: t('services.housing_description'),
    icon: Home,
    color: "bg-indigo-50 text-indigo-600",
    institutions: ["Housing Authority", "Urban Planning", "Building Permits"],
  },
  {
    id: "social-services",
    title: t('services.social_services_title'),
    description: t('services.social_services_description'),
    icon: Users,
    color: "bg-pink-50 text-pink-600",
    institutions: ["Social Welfare", "Community Centers", "Support Programs"],
  },
  {
    id: "utilities",
    title: t('services.utilities_title'),
    description: t('services.utilities_description'),
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    institutions: ["Water Authority", "Electric Company", "Waste Management"],
  },
  {
    id: "environment",
    title: t('services.environment_title'),
    description: t('services.environment_description'),
    icon: TreePine,
    color: "bg-emerald-50 text-emerald-600",
    institutions: ["Environmental Agency", "Parks Department", "Conservation"],
  },
  {
    id: "legal",
    title: t('services.legal_title'),
    description: t('services.legal_description'),
    icon: Gavel,
    color: "bg-slate-50 text-slate-600",
    institutions: ["Court System", "Legal Aid", "Justice Department"],
  },
  {
    id: "municipal",
    title: t('services.municipal_title'),
    description: t('services.municipal_description'),
    icon: Building2,
    color: "bg-cyan-50 text-cyan-600",
    institutions: ["City Hall", "Municipal Offices", "Local Government"],
  },
]

export default function ServicesPage() {
  const { t, language, setLanguage } = useLanguage()
  const services = getServices(t)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('services.back_to_home')}</span>
            </Link>

            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={(value: 'en' | 'am') => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="am">አማርኛ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl font-bold text-gray-900">{t('landing.title')}</span>
            <span className="text-3xl font-bold text-blue-600">{t('landing.subtitle')}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('services.title')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('services.description')}
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
                      <p className="text-sm font-medium text-gray-700">{t('services.related_institutions')}</p>
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
                            +{service.institutions.length - 2} {t('services.more')}
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto backdrop-blur-sm bg-white/90">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('services.cant_find_title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('services.cant_find_description')}
            </p>
            <Link to="/feedback">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                {t('services.submit_general_feedback')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
