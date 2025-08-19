import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Hash, Globe, BarChart3, Flag, ThumbsUp } from "lucide-react"
import { Link } from "react-router"
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

export default function Landing() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

   
      <section className="bg-white py-20 h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {t('landing.hero.title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('landing.hero.description')}
              </p>
              <Link to={'/listings'}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">{t('landing.hero.cta')}</Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden">
                <img
                  src="/a-man-using-Phone.jpg"
                  alt="Person using GovInsights Pro on mobile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              {t('landing.features.title')}
            </p>
            <h2 className="text-4xl font-bold text-gray-900">{t('landing.features.subtitle')}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-black via-blue-900 to-blue-600 text-white h-full">
                <CardContent className="p-8">
                  <Calendar className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-white">{t('landing.features.secure.title')}</h3>
                  <p className="text-blue-100 leading-relaxed">
                    {t('landing.features.secure.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column Features */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <CardContent className="p-8">
                  <Hash className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('landing.features.analytics.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('landing.features.analytics.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <Globe className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('landing.features.community.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('landing.features.community.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <BarChart3 className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('landing.features.coverage.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('landing.features.coverage.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <Flag className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('landing.features.monitoring.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('landing.features.monitoring.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Feature Card */}
            <div className="lg:col-span-3">
              <Card className="bg-white">
                <CardContent className="p-8">
                  <ThumbsUp className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('landing.features.interface.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('landing.features.interface.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 rounded-3xl p-16 text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              {t('landing.cta.subtitle')}
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">{t('landing.cta.title')}</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('landing.cta.description')}
            </p>
            <Link to={'/register'}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">{t('landing.cta.button')}</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
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
