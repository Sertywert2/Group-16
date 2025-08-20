import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation keys and their values
const translations = {
  en: {
    // Navigation & Header
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.feedback': 'Feedback',
    'nav.dashboard': 'Dashboard',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.citizen_signin': 'Citizen signin',
    'nav.government_signin': 'Government Signin',
    'nav.back_to_home': 'Back to Home',
    
    // Landing Page
    'landing.title': 'GovInsights',
    'landing.subtitle': 'Pro',
    'landing.hero.title': 'GovInsights Pro',
    'landing.hero.description': 'Your comprehensive government analytics platform that transforms complex civic data into actionable insights. Empower yourself with real-time government transparency, policy tracking, and citizen engagement tools designed for the modern democracy.',
    'landing.hero.cta': 'Explore Platform',
    'landing.features.title': 'GOVINSIGHT PRO MAIN FEATURES',
    'landing.features.subtitle': 'Why Choose GovInsights Pro?',
    'landing.features.secure.title': 'Secure & Anonymous',
    'landing.features.secure.description': 'Bank-level security with complete transparency in government data access and usage tracking.',
    'landing.features.analytics.title': 'Real-time Analytics',
    'landing.features.analytics.description': 'Live government data visualization with instant updates on policies, budgets, and public initiatives.',
    'landing.features.community.title': 'Community Impact',
    'landing.features.community.description': 'Track how your feedback contributes to community improvements',
    'landing.features.coverage.title': 'Multi Sector Coverage',
    'landing.features.coverage.description': 'Submit feedback across education health, infrastructure and more',
    'landing.features.monitoring.title': '24/7 Monitoring',
    'landing.features.monitoring.description': 'Use Jambo for analyzing user feedback & valuable insights',
    'landing.features.interface.title': 'User-Friendly Interface',
    'landing.features.interface.description': 'Use Jambo for analyze and engage with user feedback & valuable insights.',
    'landing.cta.subtitle': 'Free to join • No credit card required • Instant access',
    'landing.cta.title': 'Ready to Get Started?',
    'landing.cta.description': 'Join thousands of citizens who are already using GovInsights Pro to stay informed and engaged with their government. Create your free account today and start exploring government data like never before.',
    'landing.cta.button': 'Citizen Signup',
    
    // Footer
    'footer.services': 'Services',
    'footer.government_services': 'Government Services',
    'footer.submit_feedback': 'Submit Feedback',
    'footer.public_reports': 'Public Reports',
    'footer.issue_tracking': 'Issue Tracking',
    'footer.platform': 'Platform',
    'footer.citizen_dashboard': 'Citizen Dashboard',
    'footer.data_analytics': 'Data Analytics',
    'footer.reporting_tools': 'Reporting Tools',
    'footer.government_portal': 'Government Portal',
    'footer.resources': 'Resources',
    'footer.how_it_works': 'How It Works',
    'footer.documentation': 'Documentation',
    'footer.faqs': 'FAQs',
    'footer.help_center': 'Help Center',
    'footer.about': 'About',
    'footer.our_mission': 'Our Mission',
    'footer.contact_us': 'Contact Us',
    'footer.community': 'Community',
    'footer.government_login': 'Government Login',
    'footer.stay_informed': 'Stay Informed',
    'footer.email_address': 'Email address',
    'footer.email_placeholder': 'citizen@example.com',
    'footer.newsletter_agreement': 'I agree to receive updates about government initiatives and',
    'footer.terms_of_service': 'Terms of Service',
    'footer.subscribe': 'Subscribe',
    'footer.civic_movement': 'Join the civic engagement movement',
    'footer.help_shape': 'Help shape better government services for everyone',
    'footer.empowering_citizens': 'Empowering Citizens • Improving Government',
    'footer.terms_conditions': 'Terms & Conditions',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.data_usage_policy': 'Data Usage Policy',
    'footer.copyright': 'GovInsights. All Rights Reserved',
    
    // Login Page
    'login.welcome_back': 'Welcome Back',
    'login.email': 'Email',
    'login.email_placeholder': 'you@example.com',
    'login.password': 'Password',
    'login.password_placeholder': '••••••••',
    'login.forgot_password': 'Forgot Password?',
    'login.sign_in': 'Sign in as Citizen',
    'login.signing_in': 'Signing in...',
    'login.no_account': "Don't have an account?",
    'login.register': 'Register.',
    
    // Admin Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Hi, Samantha. Welcome back to Sedap Admin!',
    'dashboard.loading': 'Loading dashboard...',
    'dashboard.export_data': 'Export Data',
    'dashboard.settings': 'Settings',
    'dashboard.search_feedback': 'Search Feedback',
    'dashboard.citizens': 'Citizens',
    'dashboard.feedback_management': 'Feedback Management',
    'dashboard.analytics': 'Analytics',
    'dashboard.total_feedback': 'Total Feedback',
    'dashboard.pending_review': 'Pending Review',
    'dashboard.avg_response_time': 'Avg Response Time',
    'dashboard.average_rating': 'Average Rating',
    
    // Settings Modal
    'settings.title': 'Account & Settings',
    'settings.close': 'Close',
    'settings.name': 'Name',
    'settings.email': 'Email',
    'settings.role': 'Role',
    'settings.admin': 'Admin',
    'settings.user': 'User',
    'settings.session_expires': 'Session Expires',
    'settings.sign_out': 'Sign out',
    'settings.signing_out': 'Signing out…',
    
    // Common
    'common.language': 'Language',
    'common.english': 'English',
    'common.amharic': 'አማርኛ',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
  },
  am: {
    // Navigation & Header
    'nav.home': 'ቤት',
    'nav.services': 'አገልግሎቶች',
    'nav.feedback': 'አስተያየት',
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.signin': 'ግባ',
    'nav.signup': 'ተመዝገብ',
    'nav.citizen_signin': 'የዜጋ መግቢያ',
    'nav.government_signin': 'የመንግስት መግቢያ',
    'nav.back_to_home': 'ወደ ቤት ተመለስ',
    
    // Landing Page
    'landing.title': 'ጎቭኢንሳይትስ',
    'landing.subtitle': 'ፕሮ',
    'landing.hero.title': 'ጎቭኢንሳይትስ ፕሮ',
    'landing.hero.description': 'ውስብስብ የዜጎች መረጃዎችን ወደ ተግባራዊ ግንዛቤዎች የሚቀይር ሁሉንም ያካተተ የመንግስት ትንታኔ መድረክዎ። በእውነተኛ ጊዜ የመንግስት ግልጽነት፣ የፖሊሲ ክትትል እና ለዘመናዊ ዲሞክራሲ የተነደፉ የዜጎች ተሳትፎ መሳሪያዎች ራስዎን ያብቃሉ።',
    'landing.hero.cta': 'መድረኩን ያስሱ',
    'landing.features.title': 'የጎቭኢንሳይት ፕሮ ዋና ባህሪያት',
    'landing.features.subtitle': 'ለምን ጎቭኢንሳይትስ ፕሮን መምረጥ?',
    'landing.features.secure.title': 'ደህንነቱ የተጠበቀ እና ማንነት የማይታወቅ',
    'landing.features.secure.description': 'በመንግስት መረጃ መዳረሻ እና አጠቃቀም ክትትል ውስጥ ሙሉ ግልጽነት ያለው የባንክ ደረጃ ደህንነት።',
    'landing.features.analytics.title': 'የእውነተኛ ጊዜ ትንታኔ',
    'landing.features.analytics.description': 'በፖሊሲዎች፣ በበጀቶች እና በህዝብ ተነሳሽነቶች ላይ ፈጣን ዝማኔዎች ያሉት የቀጥታ መንግስት መረጃ ምስላዊነት።',
    'landing.features.community.title': 'የማህበረሰብ ተፅእኖ',
    'landing.features.community.description': 'አስተያየትዎ ለማህበረሰብ መሻሻል እንዴት እንደሚያበረክት ይከታተሉ',
    'landing.features.coverage.title': 'ባለብዙ ዘርፍ ሽፋን',
    'landing.features.coverage.description': 'በትምህርት፣ በጤና፣ በመሠረተ ልማት እና ሌሎችም ላይ አስተያየት ያስገቡ',
    'landing.features.monitoring.title': '24/7 ክትትል',
    'landing.features.monitoring.description': 'የተጠቃሚዎች አስተያየት እና ጠቃሚ ግንዛቤዎችን ለመተንተን ጃምቦን ይጠቀሙ',
    'landing.features.interface.title': 'ለተጠቃሚ ምቹ በይነገጽ',
    'landing.features.interface.description': 'ከተጠቃሚዎች አስተያየት እና ጠቃሚ ግንዛቤዎች ጋር ለመተንተን እና ለመሳተፍ ጃምቦን ይጠቀሙ።',
    'landing.cta.subtitle': 'ነፃ ለመቀላቀል • የክሬዲት ካርድ አያስፈልግም • ፈጣን መዳረሻ',
    'landing.cta.title': 'ለመጀመር ዝግጁ ነዎት?',
    'landing.cta.description': 'ከመንግስታቸው ጋር በመረጃ እና በተሳትፎ ለመቆየት ጎቭኢንሳይትስ ፕሮን እየተጠቀሙ ካሉ በሺዎች የሚቆጠሩ ዜጎች ጋር ይቀላቀሉ። ዛሬ ነፃ መለያዎን ይፍጠሩ እና የመንግስት መረጃን ከመቼውም ጊዜ በተለየ መልኩ ማሰስ ይጀምሩ።',
    'landing.cta.button': 'የዜጋ ምዝገባ',
    
    // Footer
    'footer.services': 'አገልግሎቶች',
    'footer.government_services': 'የመንግስት አገልግሎቶች',
    'footer.submit_feedback': 'አስተያየት ያስገቡ',
    'footer.public_reports': 'የህዝብ ሪፖርቶች',
    'footer.issue_tracking': 'የጉዳይ ክትትል',
    'footer.platform': 'መድረክ',
    'footer.citizen_dashboard': 'የዜጋ ዳሽቦርድ',
    'footer.data_analytics': 'የመረጃ ትንታኔ',
    'footer.reporting_tools': 'የሪፖርት መሳሪያዎች',
    'footer.government_portal': 'የመንግስት ፖርታል',
    'footer.resources': 'ሀብቶች',
    'footer.how_it_works': 'እንዴት እንደሚሰራ',
    'footer.documentation': 'ሰነዶች',
    'footer.faqs': 'ተደጋጋሚ ጥያቄዎች',
    'footer.help_center': 'የእርዳታ ማዕከል',
    'footer.about': 'ስለ እኛ',
    'footer.our_mission': 'የእኛ ተልእኮ',
    'footer.contact_us': 'እኛን ያግኙን',
    'footer.community': 'ማህበረሰብ',
    'footer.government_login': 'የመንግስት መግቢያ',
    'footer.stay_informed': 'መረጃ ይቆዩ',
    'footer.email_address': 'የኢሜል አድራሻ',
    'footer.email_placeholder': 'ዜጋ@example.com',
    'footer.newsletter_agreement': 'ስለ መንግስት ተነሳሽነቶች ዝማኔዎችን ለመቀበል እስማማለሁ እና',
    'footer.terms_of_service': 'የአገልግሎት ውሎች',
    'footer.subscribe': 'ይመዝገቡ',
    'footer.civic_movement': 'የዜጎች ተሳትፎ እንቅስቃሴ ይቀላቀሉ',
    'footer.help_shape': 'ለሁሉም የተሻሉ የመንግስት አገልግሎቶችን ለመቅረጽ ይረዱ',
    'footer.empowering_citizens': 'ዜጎችን ማብቃት • መንግስትን ማሻሻል',
    'footer.terms_conditions': 'ውሎች እና ሁኔታዎች',
    'footer.privacy_policy': 'የግላዊነት ፖሊሲ',
    'footer.data_usage_policy': 'የመረጃ አጠቃቀም ፖሊሲ',
    'footer.copyright': 'ጎቭኢንሳይትስ። ሁሉም መብቶች የተጠበቁ ናቸው',
    
    // Login Page
    'login.welcome_back': 'እንኳን ደህና መጡ',
    'login.email': 'ኢሜል',
    'login.email_placeholder': 'you@example.com',
    'login.password': 'የይለፍ ቃል',
    'login.password_placeholder': '••••••••',
    'login.forgot_password': 'የይለፍ ቃል ረሱ?',
    'login.sign_in': 'እንደ ዜጋ ግባ',
    'login.signing_in': 'በመግባት ላይ...',
    'login.no_account': 'መለያ የለዎትም?',
    'login.register': 'ይመዝገቡ።',
    
    // Admin Dashboard
    'dashboard.title': 'ዳሽቦርድ',
    'dashboard.welcome': 'ሰላም ሳማንታ። ወደ ሰዳፕ አድሚን እንኳን ደህና መጡ!',
    'dashboard.loading': 'ዳሽቦርድ በመጫን ላይ...',
    'dashboard.export_data': 'መረጃ ወደ ውጭ ላክ',
    'dashboard.settings': 'ቅንብሮች',
    'dashboard.search_feedback': 'አስተያየት ፈልግ',
    'dashboard.citizens': 'ዜጎች',
    'dashboard.feedback_management': 'የአስተያየት አስተዳደር',
    'dashboard.analytics': 'ትንታኔዎች',
    'dashboard.total_feedback': 'ጠቅላላ አስተያየት',
    'dashboard.pending_review': 'በመጠባበቅ ላይ ያለ ግምገማ',
    'dashboard.avg_response_time': 'አማካይ ምላሽ ጊዜ',
    'dashboard.average_rating': 'አማካይ ደረጃ',
    
    // Settings Modal
    'settings.title': 'መለያ እና ቅንብሮች',
    'settings.close': 'ዝጋ',
    'settings.name': 'ስም',
    'settings.email': 'ኢሜል',
    'settings.role': 'ሚና',
    'settings.admin': 'አድሚን',
    'settings.user': 'ተጠቃሚ',
    'settings.session_expires': 'ክፍለ ጊዜ ያበቃል',
    'settings.sign_out': 'ውጣ',
    'settings.signing_out': 'በመውጣት ላይ…',
    
    // Common
    'common.language': 'ቋንቋ',
    'common.english': 'English',
    'common.amharic': 'አማርኛ',
    'common.loading': 'በመጫን ላይ...',
    'common.error': 'ስህተት',
    'common.success': 'ተሳክቷል',
    'common.cancel': 'ሰርዝ',
    'common.save': 'አስቀምጥ',
    'common.delete': 'ሰርዝ',
    'common.edit': 'አርም',
    'common.view': 'ይመልከቱ',
    'common.search': 'ፈልግ',
    'common.filter': 'አጣራ',
    'common.next': 'ቀጣይ',
    'common.previous': 'ቀዳሚ',
    'common.submit': 'አስገባ',
  }
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first, then default to English
    const savedLanguage = localStorage.getItem('language') as Language
    return savedLanguage || 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const isRTL = false // Keep all languages LTR to maintain consistent layout

  useEffect(() => {
    // Set document direction and language
    document.documentElement.lang = language
    document.documentElement.dir = 'ltr' // Always use LTR to maintain layout consistency
    
    // Add specific CSS for Amharic text rendering
    const existingStyle = document.getElementById('amharic-text-fix')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    if (language === 'am') {
      const style = document.createElement('style')
      style.id = 'amharic-text-fix'
      style.textContent = `
        /* Only target text elements, not layout containers */
        p, span, h1, h2, h3, h4, h5, h6, a, button, input, textarea, label, li, td, th {
          font-feature-settings: normal !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-feature-settings: normal !important;
          -moz-font-feature-settings: normal !important;
          unicode-bidi: normal !important;
          direction: ltr !important;
          writing-mode: horizontal-tb !important;
        }
        
        body, html {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans Ethiopic', 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
          direction: ltr !important;
        }
        
        /* Ensure flex and grid layouts are not affected */
        .flex, .grid, [class*="flex"], [class*="grid"],
        [class*="justify-"], [class*="items-"], [class*="content-"],
        [class*="self-"], [class*="place-"], [class*="gap-"],
        [class*="space-"], [class*="divide-"], .container,
        .max-w-7xl, .mx-auto, [class*="max-w-"], [class*="min-h-"],
        [class*="h-"], [class*="w-"], div, section, header, main, footer {
          direction: ltr !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [language, isRTL])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}
