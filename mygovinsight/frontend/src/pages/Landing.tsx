import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Hash, Globe, BarChart3, Flag, ThumbsUp, ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react"
import { Link } from "react-router"
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'
import { useState, useEffect } from 'react'
import '../styles/animations.css'

export default function Landing() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [sectionsVisible, setSectionsVisible] = useState({
    hero: false,
    features: false,
    cta: false,
    footer: false
  })

  useEffect(() => {
    // Initial page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
      
      // Staggered section reveals
      setTimeout(() => setSectionsVisible(prev => ({ ...prev, hero: true })), 200)
      setTimeout(() => setSectionsVisible(prev => ({ ...prev, features: true })), 800)
      setTimeout(() => setSectionsVisible(prev => ({ ...prev, cta: true })), 1200)
      setTimeout(() => setSectionsVisible(prev => ({ ...prev, footer: true })), 1600)
    }, 100)

    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Page load overlay */}
      <div className={`fixed inset-0 bg-white z-[100] transition-all duration-1000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">CivicVoice</div>
            <div className="text-gray-600">Loading your civic experience...</div>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="absolute w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            top: '10%',
            left: '10%'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            top: '60%',
            right: '10%'
          }}
        />
      </div>
      <header className={`bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">
                {t('landing.title')} <span className="text-blue-600">{t('landing.subtitle')}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector variant="compact" />
              <Link to={'/login'}>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                {t('nav.citizen_signin')}
              </Button>
              </Link>
              <Link to={'/admin-login'}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('nav.government_signin')}</Button>
            </Link>
            </div>
          </div>
        </div>
      </header>

   
      <section className={`relative py-24 min-h-[95vh] flex items-center transition-all duration-1000 ${sectionsVisible.hero ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className={`space-y-8 transform transition-all duration-1000 delay-300 lg:pr-8 ${sectionsVisible.hero ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                <span className="text-blue-600 font-semibold text-lg tracking-wide uppercase">Civic Innovation</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent animate-gradient">
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                {t('landing.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={'/listings'}>
                  <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                    {t('landing.hero.cta')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-600 font-medium">10K+ Citizens</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-gray-600 font-medium">98% Satisfaction</span>
                </div>
              </div>
            </div>
            <div className={`flex justify-center lg:justify-end transform transition-all duration-1000 delay-600 lg:pl-8 ${sectionsVisible.hero ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative w-[32rem] h-[32rem] lg:w-[36rem] lg:h-[36rem] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:rotate-1 transition-all duration-500">
                  <img
                    src="/a-man-using-Phone.jpg"
                    alt="Person using  CivicVoice Et on mobile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce">
                  <Flag className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                  <ThumbsUp className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 bg-gradient-to-b from-gray-50 to-white relative transition-all duration-1000 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 delay-200 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">
              {t('landing.features.title')}
            </p>
            <h2 className="text-4xl font-bold text-gray-900">{t('landing.features.subtitle')}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-1 transition-all duration-800 delay-400 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="group bg-gradient-to-br from-black via-blue-900 to-blue-600 text-white h-full hover:scale-105 transform transition-all duration-500 hover:shadow-2xl cursor-pointer">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <Calendar className="w-8 h-8 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold mb-4 text-white relative z-10">{t('landing.features.secure.title')}</h3>
                  <p className="text-blue-100 leading-relaxed relative z-10">
                    {t('landing.features.secure.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column Features */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <Card className={`group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:scale-105 transform transition-all duration-500 hover:shadow-xl cursor-pointer border-2 hover:border-blue-200 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} stagger-1`}>
                <CardContent className="p-8">
                  <Hash className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-4 group-hover:scale-110 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">{t('landing.features.analytics.title')}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {t('landing.features.analytics.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className={`group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 hover:scale-105 transform transition-all duration-500 hover:shadow-xl cursor-pointer border-2 hover:border-green-200 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} stagger-2`}>
                <CardContent className="p-8">
                  <Globe className="w-8 h-8 text-gray-600 group-hover:text-green-600 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-900 transition-colors">{t('landing.features.community.title')}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {t('landing.features.community.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className={`group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:scale-105 transform transition-all duration-500 hover:shadow-xl cursor-pointer border-2 hover:border-purple-200 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} stagger-3`}>
                <CardContent className="p-8">
                  <BarChart3 className="w-8 h-8 text-gray-600 group-hover:text-purple-600 mb-4 group-hover:scale-110 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-900 transition-colors">{t('landing.features.coverage.title')}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {t('landing.features.coverage.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className={`group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 hover:scale-105 transform transition-all duration-500 hover:shadow-xl cursor-pointer border-2 hover:border-orange-200 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} stagger-4`}>
                <CardContent className="p-8">
                  <Flag className="w-8 h-8 text-gray-600 group-hover:text-orange-600 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-orange-900 transition-colors">{t('landing.features.monitoring.title')}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {t('landing.features.monitoring.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Feature Card */}
            <div className={`lg:col-span-3 transition-all duration-800 delay-800 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="group bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 hover:scale-105 transform transition-all duration-500 hover:shadow-xl cursor-pointer border-2 hover:border-blue-300">
                <CardContent className="p-8 text-center">
                  <ThumbsUp className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-4 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">{t('landing.features.interface.title')}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors max-w-3xl mx-auto">
                    {t('landing.features.interface.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 relative overflow-hidden transition-all duration-1000 ${sectionsVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-16 text-center relative overflow-hidden group hover:scale-105 transform transition-all duration-500 ${sectionsVisible.cta ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-blue-200 uppercase tracking-wide mb-2">
                {t('landing.cta.subtitle')}
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">{t('landing.cta.title')}</h2>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('landing.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={'/register'}>
                  <Button className="group bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                    {t('landing.cta.button')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-white/30 text-white bg-transparent px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className={`bg-white border-t border-gray-200 py-16 transition-all duration-1000 ${sectionsVisible.footer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Services Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.services')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/listings" className="text-gray-600 hover:text-gray-900">
                    {t('footer.government_services')}
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="text-blue-600 hover:text-blue-700">
                    {t('footer.submit_feedback')}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.public_reports')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.issue_tracking')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.platform')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    {t('footer.citizen_dashboard')}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.data_analytics')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.reporting_tools')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.government_portal')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    {t('footer.how_it_works')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.documentation')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.faqs')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.help_center')}
                  </a>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.about')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.our_mission')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.contact_us')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    {t('footer.community')}
                  </a>
                </li>
                <li>
                  <Link to="/admin-login" className="text-blue-600 hover:text-blue-700">
                    {t('footer.government_login')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-gray-600">📧</span> {t('footer.stay_informed')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                    {t('footer.email_address')}
                  </label>
                  <Input id="email" type="email" placeholder={t('footer.email_placeholder')} className="w-full" />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t('footer.newsletter_agreement')}{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      {t('footer.terms_of_service')}
                    </a>
                  </label>
                </div>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">{t('footer.subscribe')}</Button>
                <div className="text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        {['🏛️', '📊', '🗳️', '📋', '🎯'][i]}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{t('footer.civic_movement')}</p>
                  <p className="text-sm text-gray-600">{t('footer.help_shape')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">{t('footer.empowering_citizens')}</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {t('footer.terms_conditions')}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {t('footer.privacy_policy')}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {t('footer.data_usage_policy')}
              </a>
            </div>
            <div className="text-sm text-gray-600">©{new Date().getFullYear()} {t('footer.copyright')}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
