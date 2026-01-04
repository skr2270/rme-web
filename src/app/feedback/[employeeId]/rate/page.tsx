'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';

// Employee data for programmatic SEO
const employeeData = {
  'john-doe-manager': {
    name: 'John Doe',
    position: 'Manager',
    department: 'Operations',
    experience: '5 years',
    rating: 4.8,
    reviews: 127,
    specialties: ['Team Leadership', 'Customer Service', 'Operations Management'],
    bio: 'Experienced manager with 5 years in customer service excellence. Known for exceptional team leadership and operational efficiency.'
  },
  'sarah-wilson-cashier': {
    name: 'Sarah Wilson',
    position: 'Cashier',
    department: 'Front Desk',
    experience: '3 years',
    rating: 4.9,
    reviews: 89,
    specialties: ['Customer Service', 'Payment Processing', 'Problem Solving'],
    bio: 'Dedicated cashier with excellent customer service skills and attention to detail. Committed to providing smooth checkout experiences.'
  },
  'mike-chen-cook': {
    name: 'Mike Chen',
    position: 'Head Chef',
    department: 'Kitchen',
    experience: '8 years',
    rating: 4.7,
    reviews: 156,
    specialties: ['Culinary Arts', 'Menu Planning', 'Kitchen Management'],
    bio: 'Creative head chef with 8 years of culinary experience. Passionate about creating exceptional dining experiences.'
  },
  'emma-davis-waitress': {
    name: 'Emma Davis',
    position: 'Waitress',
    department: 'Service',
    experience: '2 years',
    rating: 4.6,
    reviews: 73,
    specialties: ['Table Service', 'Customer Relations', 'Menu Knowledge'],
    bio: 'Friendly and efficient waitress dedicated to providing excellent dining service and memorable customer experiences.'
  }
};

export default function RateEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const employee = employeeData[employeeId as keyof typeof employeeData];

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
            <p className="text-gray-600 mb-6">The employee you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/feedback')}>
              Back to Employee List
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      router.push(`/feedback/${employeeId}/review?rating=${rating}`);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200">
      {/* Structured Data for Employee */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": employee.name,
            "jobTitle": employee.position,
            "worksFor": {
              "@type": "Organization",
              "name": "Rate My Employee Business"
            },
            "description": employee.bio,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": employee.rating,
              "reviewCount": employee.reviews,
              "bestRating": 5,
              "worstRating": 1
            }
          })
        }}
      />

      <Navbar />
      
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-stone-100/40 via-stone-100/30 to-stone-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-gradient-to-tr from-slate-100/40 via-gray-100/30 to-slate-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200/50 text-violet-700 font-semibold text-sm mb-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span>Rate Your Experience</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
              <span className="block">How was your experience with</span>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-600 bg-clip-text text-transparent animate-gradient">
                  {employee.name}?
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
              Help improve service quality by rating your experience with {employee.name}
            </p>
          </div>

          {/* Employee Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all mb-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{employee.name}</h2>
              <p className="text-violet-600 font-semibold mb-2">{employee.position}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span>⭐ {employee.rating}/5</span>
                <span>•</span>
                <span>{employee.reviews} reviews</span>
                <span>•</span>
                <span>{employee.experience} experience</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rate your experience (1-10)
              </h3>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`w-10 h-10 rounded-lg text-lg font-bold transition-all hover:scale-110 ${
                      star <= displayRating
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">You rated: {rating}/10</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(rating / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {rating === 0 ? 'Select a rating to continue' : 'Continue to Review'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}