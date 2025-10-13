'use client';

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

type UserType = 'customer' | 'business' | 'employee';

export default function LoginPage() {
  const [selectedUserType, setSelectedUserType] = useState<UserType>('business');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (selectedUserType === 'business') {
      console.log('Business Login:', { email, password, rememberMe });
    } else {
      console.log('Customer/Employee Login:', { phone, otp });
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
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
              <span>Welcome back</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
              <span className="block">Sign in to your</span>
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
              Continue your journey to better service quality
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-3 shadow-sm">
              ACCOUNT TYPE
            </div>
            <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
              {[
                { id: 'customer', label: 'Customer', icon: '👤' },
                { id: 'business', label: 'Business', icon: '🏢' },
                { id: 'employee', label: 'Employee', icon: '👥' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedUserType(type.id as UserType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedUserType === type.id
                      ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg'
                      : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                  }`}
                >
                  <span className="text-base">{type.icon}</span>
                  <span className="text-xs font-semibold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {selectedUserType === 'business' ? (
                // Business Login
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="john@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                      />
                      <span className="ml-3 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="#" className="text-sm text-violet-600 hover:text-violet-700 font-semibold">
                      Forgot password?
                    </Link>
                  </div>
                </>
              ) : (
                // Customer/Employee Login
                <>
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-r-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base sm:text-lg placeholder-gray-500"
                        placeholder="98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!phone || isLoading}
                      className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Enter OTP
                        </label>
                        <div className="flex justify-center space-x-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength={1}
                              value={otp[index] || ''}
                              onChange={(e) => {
                                const newOtp = otp.split('');
                                newOtp[index] = e.target.value;
                                setOtp(newOtp.join(''));
                              }}
                              className="w-10 h-10 text-center bg-gray-50 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-gray-900 text-lg font-bold"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          OTP sent to +91 {phone}
                        </p>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-violet-600 hover:text-violet-700 font-semibold"
                        >
                          Change phone number
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Only show Sign In button for business login or after OTP is sent */}
              {(selectedUserType === 'business' || otpSent) && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-violet-600 hover:text-violet-700 font-semibold">
                  Sign up
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
