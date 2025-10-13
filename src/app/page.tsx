'use client';

import Link from "next/link";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 xl:pt-40 pb-16 sm:pb-20 lg:pb-24 xl:pb-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-stone-100/40 via-stone-100/30 to-stone-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-gradient-to-tr from-slate-100/40 via-gray-100/30 to-slate-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-yellow-50 border border-yellow-200/50 text-violet-700 font-semibold text-xs sm:text-sm mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-yellow-500"></span>
              </span>
              <span className="hidden sm:inline">Solving India&apos;s ₹4,550 Cr Customer Service Crisis</span>
              <span className="sm:hidden">Solving India&apos;s Service Crisis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight">
              <span className="block">Stop Losing Customers</span>
              <span className="block">To Bad Service With</span>
              <span className="relative inline-block mt-2 sm:mt-4">
                <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-600 bg-clip-text text-transparent animate-gradient">
                  Real-Time Feedback
                </span>
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full hidden sm:block" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9333ea"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              The only platform combining employee ratings, performance analytics, and smart recruitment for better service quality. 
              <span className="font-semibold text-violet-600 block sm:inline mt-1 sm:mt-0"> Set up in under 10 minutes.</span>
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-12 sm:mb-16 px-4 sm:px-0">
              <Link 
                href="/feedback" 
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
              >
                <span className="relative z-10">Provide employee feedback</span>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-violet-600 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="text-xs sm:text-sm text-gray-500 mb-4">No setup fees. Cancel anytime.</p>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-0">
            {[
              { value: "90%", label: "Indians face poor service", color: "from-violet-500 to-violet-600" },
              { value: "15B+", label: "Hours wasted yearly", color: "from-violet-600 to-violet-500" },
              { value: "$55B", label: "Economic loss", color: "from-violet-600 to-violet-700" },
              { value: "48%", label: "Report poor CX", color: "from-violet-700 to-violet-600" }
            ].map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500`}></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 hover:border-transparent transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 sm:mb-3`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-6 sm:mb-8 tracking-widest uppercase">Trusted by forward-thinking businesses</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {['🏨', '🛍️', '🏦', '🏥', '🏛️', '💼'].map((emoji, idx) => (
              <div key={idx} className="text-3xl sm:text-4xl lg:text-5xl hover:scale-125 transition-transform cursor-pointer">{emoji}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[300px] sm:h-[400px] bg-gradient-to-b from-gray-100/20 to-transparent blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-100 text-violet-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Get started in <span className="bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">three simple steps</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              A seamless ecosystem connecting customers, employees, and employers for exceptional service quality
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Customers Rate",
                description: "Real-time ratings and feedback on employee service quality across all touchpoints. Quick, easy, and immediate.",
                features: ["QR code scanning", "Anonymous ratings", "Multi-dimensional feedback"],
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                )
              },
              {
                step: "02",
                title: "Instant Analytics",
                description: "Live dashboards with performance trends, top performers, and improvement areas. See results in real-time.",
                features: ["Real-time dashboards", "Performance tracking", "Trend analysis"],
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                )
              },
              {
                step: "03",
                title: "Drive Growth",
                description: "Employees improve through feedback while employers make smarter hiring and management decisions.",
                features: ["Performance insights", "Smart recruitment", "Continuous improvement"],
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-violet-300 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
                      
                      <div className="space-y-3">
                        {item.features.map((feature, fidx) => (
                          <div key={fidx} className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {item.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-100 text-violet-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
              FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Everything you need to <span className="bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">transform performance</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Powerful tools designed for modern workforce management and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              { 
                title: "More Sales", 
                value: "100%",
                description: "Increase conversion rates and drive more qualified leads with our AI-powered feedback system",
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-violet-600">100%</span>
                  </div>
                )
              },
              { 
                title: "Brand Voice Matching", 
                description: "Customize your AI's personality, tone, and communication style to perfectly match your brand voice and customer expectations",
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6" />
                    </svg>
                  </div>
                )
              },
              { 
                title: "Instant 24/7 Support", 
                description: "Provide instant, accurate responses to customer inquiries around the clock, reducing response times from hours to seconds",
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )
              },
              { 
                title: "Lead Generation & Sales", 
                description: "Turn conversations into qualified leads and sales. Our AI asks qualifying questions and processes orders automatically",
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                )
              },
              { 
                title: "Seamless Integrations", 
                description: "Connect with your existing CRM, help desk, and communication tools for a unified customer experience",
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                )
              },
              { 
                title: "Integration Examples", 
                integrations: [
                  { name: "CRM", icon: "✓" },
                  { name: "Help Desk", icon: "📁" },
                  { name: "Chat", icon: "💬" }
                ],
                icon: (
                  <div className="w-16 h-16 rounded-full border-2 border-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                )
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-violet-300 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      {feature.value && (
                        <div className="text-3xl font-bold text-violet-600 mb-4">{feature.value}</div>
                      )}
                      {feature.description && (
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      )}
                      {feature.integrations && (
                        <div className="mt-4 space-y-2">
                          {feature.integrations.map((integration, iidx) => (
                            <div key={iidx} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-violet-600 font-semibold">{integration.icon}</span>
                              <span>{integration.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Value Proposition */}
      <section id="benefits" className="py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-yellow-50 border border-yellow-200 text-violet-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              VALUE PROPOSITION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Built for <span className="text-violet-600">everyone</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Creating measurable value for all stakeholders in the service ecosystem
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "For Employers",
                color: "violet",
                benefits: [
                  { text: "Real-time performance tracking" },
                  { text: "Data-driven hiring decisions" },
                  { text: "Improved customer satisfaction" },
                  { text: "Reduced turnover costs" }
                ]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: "For Employees",
                color: "yellow",
                benefits: [
                  { text: "Transparent performance feedback" },
                  { text: "Career growth opportunities" },
                  { text: "Salary negotiation support" },
                  { text: "Skill development insights" }
                ]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "For Customers",
                color: "violet",
                benefits: [
                  { text: "Voice creates real change" },
                  { text: "Better service quality" },
                  { text: "Improved experiences" },
                  { text: "Accountability & transparency" }
                ]
              }
            ].map((category, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-violet-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    category.color === 'violet' ? 'bg-violet-100 text-violet-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h3>
                  
                  <ul className="space-y-4">
                    {category.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          category.color === 'violet' ? 'bg-violet-100' : 'bg-yellow-100'
                        }`}>
                          <svg className={`w-3 h-3 ${category.color === 'violet' ? 'text-violet-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{benefit.text}</span>
          </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-100 text-violet-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
              INDUSTRIES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Trusted across <span className="bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">all sectors</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Serving service-focused businesses across India with proven results
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Hospitality & Hotels', emoji: '🏨', desc: 'Improve guest experience' },
              { name: 'Retail & Shopping', emoji: '🛍️', desc: 'Boost sales performance' },
              { name: 'Banking & Finance', emoji: '🏦', desc: 'Enhance customer service' },
              { name: 'Healthcare', emoji: '🏥', desc: 'Better patient care' },
              { name: 'Government', emoji: '🏛️', desc: 'Public service excellence' },
              { name: 'Professional Services', emoji: '💼', desc: 'Client satisfaction' },
              { name: 'Education', emoji: '📚', desc: 'Student experience' },
              { name: 'Transportation', emoji: '🚗', desc: 'Service quality' }
            ].map((industry, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-violet-300 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform">{industry.emoji}</div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-2">{industry.name}</h4>
                  <p className="text-xs text-gray-600">{industry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-stone-50 via-white to-stone-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(250,204,21,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.05),transparent_60%)]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-50 border border-yellow-200 text-violet-700 text-sm font-bold mb-8 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              TRANSFORM YOUR TEAM TODAY
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Ready to transform <br className="hidden sm:block"/>your workforce?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Join 500+ businesses already using Rate My Employee to drive performance and improve customer satisfaction.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Set up in 10 minutes</h3>
                  <p className="text-gray-600">Quick onboarding with guided setup and instant employee integration</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No credit card required</h3>
                  <p className="text-gray-600">Start free with full access to all features and cancel anytime</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted by 500+ companies</h3>
                  <p className="text-gray-600">Join leading businesses across India transforming their workforce</p>
                </div>
              </div>
            </div>
            
            {/* Right side - CTA Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100">
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Get started today</h3>
                  <p className="text-gray-600 text-lg">No setup fees • Cancel anytime • Start free today</p>
                </div>
                
                <div className="space-y-4">
                  <Link href="/signup" className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    Sign Up
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  <Link href="/login" className="w-full inline-flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-bold border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500">
                    <span className="font-semibold text-violet-600">✓</span> Free 14-day trial
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-violet-600">✓</span> No credit card required
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-violet-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
