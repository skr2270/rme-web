'use client';

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

// Business portal only

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    agreeToTerms: false
  });
  // OTP flow removed for non-business
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // OTP flow removed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Business Signup:', { ...formData });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-beige-luxe-soft">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-stone-100/40 via-stone-100/30 to-stone-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-gradient-to-tr from-slate-100/40 via-gray-100/30 to-slate-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200/50 text-violet-700 font-semibold text-sm mb-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span>Join the service revolution</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
              <span className="block">Create your</span>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-600 bg-clip-text text-transparent animate-gradient">
                  Account
                </span>
                <svg className="absolute -bottom-1 left-0 w-full hidden sm:block" height="8" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C50 3 100 1 150 2C200 3 250 5 298 6" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
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
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
              Business portal sign-up. Customers and employees should use the app.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-espresso-glass border border-violet-200 text-espresso">
              <span className="text-xs">Not a business?</span>
              <Link href="/#download" className="text-violet-700 font-semibold text-sm hover:underline">Get the App →</Link>
            </div>
          </div>

          {/* Business-only Signup */}

          {/* Signup Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Business Signup */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="john@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex">
                      <select className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-l-xl border-r-0 focus:border-violet-500 text-gray-900 text-base sm:text-lg">
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-r-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                        placeholder="98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 mt-1"
                  required
                />
                <label className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="#" className="text-violet-600 hover:text-violet-700 font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-violet-600 hover:text-violet-700 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Create Account */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}