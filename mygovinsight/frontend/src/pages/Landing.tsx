import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Hash, Globe, BarChart3, Flag, ThumbsUp } from "lucide-react"
import { Link } from "react-router"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">
                GovInsight <span className="text-blue-600">Pro</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to={'/login'}>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Citizen signin
              </Button>
              </Link>
              <Link to={'/admin-login'}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Government Signin</Button>
            </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                GovInsights <span className="text-blue-600">Pro</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your comprehensive government analytics platform that transforms complex civic data into actionable
                insights. Empower yourself with real-time government transparency, policy tracking, and citizen
                engagement tools designed for the modern democracy.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Explore Platform</Button>
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
              GOVINSIGHT PRO MAIN FEATURES
            </p>
            <h2 className="text-4xl font-bold text-gray-900">Why Choose GovInsights Pro?</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-black via-blue-900 to-blue-600 text-white h-full">
                <CardContent className="p-8">
                  <Calendar className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-white">Secure & Anonymous</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Bank-level security with complete transparency in government data access and usage tracking.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column Features */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <CardContent className="p-8">
                  <Hash className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Live government data visualization with instant updates on policies, budgets, and public
                    initiatives.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <Globe className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track how your feedback contributes to community improvements
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <BarChart3 className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Multi Sector Coverage</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Submit feedback across education health, infrastructure and more
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <Flag className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Monitoring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use Jambo for analyzing user feedback & valuable insights
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Feature Card */}
            <div className="lg:col-span-3">
              <Card className="bg-white">
                <CardContent className="p-8">
                  <ThumbsUp className="w-8 h-8 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Friendly Interface</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use Jambo for analyze and engage with user feedback & valuable insights.
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
              Free to join • No credit card required • Instant access
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join thousands of citizens who are already using GovInsights Pro to stay informed and engaged with their
              government. Create your free account today and start exploring government data like never before.
            </p>
            <Link to={'/register'}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Citizen Signup</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Resources Column 1 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Law Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Workplace Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    HR Advisory
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Employee Handbooks
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Law Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Workplace Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    HR Advisory
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Employee Handbooks
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column 2 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Law Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Workplace Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    HR Advisory
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Employee Handbooks
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-gray-600">📧</span> Newsletter
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                    Email address
                  </label>
                  <Input id="email" type="email" placeholder="someone@etc.com" className="w-full" />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Term and Conditions
                    </a>
                  </label>
                </div>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Submit</Button>
                <div className="text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">Get the latest newsletter</p>
                  <p className="text-sm text-gray-600">Echo become a tech-driven legal solutions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">AddisAbeba, Et</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
            </div>
            <div className="text-sm text-gray-600">©{new Date().getFullYear()}; All Rights Reserved</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
