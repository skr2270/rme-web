'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-purple-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center group">
              <Image src="/logo.png" alt="RME" width={120} height={60} className="h-12 w-auto transition-transform group-hover:scale-105" priority />
            </Link>
            <div className="hidden lg:flex items-center gap-10">
              <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-all hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-all hover:scale-105">How it works</a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium transition-all hover:scale-105">Benefits</a>
              <a href="#industries" className="text-gray-700 hover:text-purple-600 font-medium transition-all hover:scale-105">Industries</a>
              <Link href="/feedback" className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-violet-600 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
                <span className="relative z-10">Book a free demo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/40 via-violet-200/30 to-purple-100/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-violet-200/40 via-purple-200/30 to-violet-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50 text-purple-700 font-semibold text-sm mb-8 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
              </span>
              Solving India&apos;s ₹4,550 Cr Customer Service Crisis
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Stop Losing Customers<br />
              To Bad Service With{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Real-Time Feedback
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The only platform combining employee ratings, performance analytics, and smart recruitment for better service quality. 
              <span className="font-semibold text-purple-600"> Set up in under 10 minutes.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
              <Link 
                href="/feedback" 
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                <span className="relative z-10">Start rating employees</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <button className="group inline-flex items-center justify-center gap-3 bg-white text-gray-700 px-10 py-5 rounded-2xl text-lg font-bold border-2 border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch demo
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-gray-500 mb-4">No setup fees. Cancel anytime.</p>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { value: "90%", label: "Indians face poor service", color: "from-purple-500 to-violet-500" },
              { value: "15B+", label: "Hours wasted yearly", color: "from-violet-500 to-purple-500" },
              { value: "$55B", label: "Economic loss", color: "from-purple-600 to-violet-600" },
              { value: "48%", label: "Report poor CX", color: "from-violet-600 to-purple-600" }
            ].map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500`}></div>
                <div className="relative bg-white rounded-2xl p-8 border border-purple-100 hover:border-transparent transition-all shadow-lg hover:shadow-2xl hover:-translate-y-2">
                  <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-500 mb-8 tracking-widest uppercase">Trusted by forward-thinking businesses</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['🏨', '🛍️', '🏦', '🏥', '🏛️', '💼'].map((emoji, idx) => (
              <div key={idx} className="text-5xl hover:scale-125 transition-transform cursor-pointer">{emoji}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-purple-50/30 to-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-purple-100/20 to-transparent blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Get started in <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">three simple steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless ecosystem connecting customers, employees, and employers for exceptional service quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "Step 1",
                title: "Customers Rate",
                description: "Real-time ratings and feedback on employee service quality across all touchpoints. Quick, easy, and immediate.",
                icon: "👥",
                gradient: "from-purple-500 to-violet-500",
                features: ["QR code scanning", "Anonymous ratings", "Multi-dimensional feedback"]
              },
              {
                step: "Step 2",
                title: "Instant Analytics",
                description: "Live dashboards with performance trends, top performers, and improvement areas. See results in real-time.",
                icon: "📊",
                gradient: "from-violet-500 to-purple-500",
                features: ["Real-time dashboards", "Performance tracking", "Trend analysis"]
              },
              {
                step: "Step 3",
                title: "Drive Growth",
                description: "Employees improve through feedback while employers make smarter hiring and management decisions.",
                icon: "📈",
                gradient: "from-purple-600 to-violet-600",
                features: ["Performance insights", "Smart recruitment", "Continuous improvement"]
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                <div className="relative bg-white border-2 border-purple-100 rounded-3xl p-8 hover:border-transparent transition-all shadow-xl hover:shadow-2xl hover:-translate-y-2">
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl">{item.icon}</div>
                    <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${item.gradient} text-white text-xs font-bold`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                  
                  <ul className="space-y-3">
                    {item.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-sm">
                        <svg className={`w-5 h-5 bg-gradient-to-r ${item.gradient} rounded-full p-1 text-white flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Everything you need to <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">transform performance</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed for modern workforce management and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: "⭐", 
                title: "Customer Ratings", 
                description: "Multi-dimensional rating system for comprehensive employee feedback and performance tracking",
                gradient: "from-purple-500 to-violet-500"
              },
              { 
                icon: "📱", 
                title: "Real-time Dashboard", 
                description: "Live performance metrics and analytics at your fingertips with beautiful visualizations",
                gradient: "from-violet-500 to-purple-500"
              },
              { 
                icon: "👨‍💼", 
                title: "Employee Insights", 
                description: "Detailed feedback reports for professional development and career growth opportunities",
                gradient: "from-purple-600 to-violet-600"
              },
              { 
                icon: "💼", 
                title: "Job Portal", 
                description: "Connect top performers with recruitment opportunities and career advancement",
                gradient: "from-violet-600 to-purple-600"
              },
              { 
                icon: "📊", 
                title: "Trend Analysis", 
                description: "Identify patterns and predict performance trajectories with AI-powered insights",
                gradient: "from-purple-500 to-violet-500"
              },
              { 
                icon: "🔒", 
                title: "Secure & Compliant", 
                description: "Enterprise-grade security with data protection and privacy compliance",
                gradient: "from-violet-500 to-purple-500"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`}></div>
                <div className="relative bg-gradient-to-b from-white to-purple-50/30 border border-purple-100 rounded-2xl p-8 hover:border-purple-300 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Value Proposition */}
      <section id="benefits" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-white via-purple-50/50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-to-l from-violet-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm">
              VALUE PROPOSITION
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Built for <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">everyone</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating measurable value for all stakeholders in the service ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                emoji: "🏢",
                title: "For Employers",
                gradient: "from-purple-600 to-violet-600",
                benefits: [
                  { icon: "📊", text: "Real-time performance tracking" },
                  { icon: "🎯", text: "Data-driven hiring decisions" },
                  { icon: "😊", text: "Improved customer satisfaction" },
                  { icon: "💰", text: "Reduced turnover costs" }
                ]
              },
              {
                emoji: "👨‍💼",
                title: "For Employees",
                gradient: "from-violet-600 to-purple-600",
                benefits: [
                  { icon: "💬", text: "Transparent performance feedback" },
                  { icon: "🚀", text: "Career growth opportunities" },
                  { icon: "💵", text: "Salary negotiation support" },
                  { icon: "📈", text: "Skill development insights" }
                ]
              },
              {
                emoji: "🎤",
                title: "For Customers",
                gradient: "from-purple-600 to-violet-700",
                benefits: [
                  { icon: "📢", text: "Voice creates real change" },
                  { icon: "⭐", text: "Better service quality" },
                  { icon: "✨", text: "Improved experiences" },
                  { icon: "🔍", text: "Accountability & transparency" }
                ]
              }
            ].map((category, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500`}></div>
                <div className="relative bg-white rounded-3xl overflow-hidden border-2 border-purple-100 hover:border-transparent transition-all shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${category.gradient} p-10 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{category.emoji}</div>
                      <h3 className="text-3xl font-bold">{category.title}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-5">
                      {category.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-start gap-4 group/item">
                          <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                          <span className="text-gray-700 font-medium pt-1 group-hover/item:text-purple-600 transition-colors">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm">
              INDUSTRIES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Trusted across <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">all sectors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serving service-focused businesses across India with proven results
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative bg-white border border-purple-100 rounded-2xl p-8 text-center hover:border-purple-300 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-2">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{industry.emoji}</div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{industry.name}</h4>
                  <p className="text-xs text-gray-600">{industry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Ready to transform your workforce?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 500+ businesses already using Rate My Employee to drive performance and improve customer satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Link href="/feedback" className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-purple-600 px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all hover:scale-105">
              Book a free demo
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-5 rounded-2xl text-lg font-bold border-2 border-white/30 hover:border-white/50 transition-all hover:scale-105">
              Schedule consultation
            </button>
          </div>
          
          <p className="text-purple-200 text-sm">Get a personalized walkthrough • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Image src="/logo.png" alt="RME" width={120} height={60} className="h-12 w-auto mb-6" />
              <p className="text-gray-600 max-w-sm mb-6 leading-relaxed">
                Transforming employee performance through real-time feedback and data-driven insights for better service quality.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'facebook'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-lg bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-all hover:scale-110">
                    <span className="text-purple-600 text-lg">•</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                {['Features', 'How it works', 'Industries', 'Pricing'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About', 'Contact', 'Careers', 'Blog'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Security', 'Compliance'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">&copy; 2025 Rate My Employee. All rights reserved.</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>in India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
