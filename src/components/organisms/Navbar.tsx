'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#benefits", label: "Benefits" },
    { href: "/#industries", label: "Industries" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/75 backdrop-blur-xl shadow-lg border-b border-violet-100/60' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/logo.png" 
              alt="RME" 
              width={120} 
              height={60} 
              className="h-8 sm:h-10 lg:h-12 w-auto transition-transform group-hover:scale-105" 
              priority 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-700 hover:text-violet-600 font-medium transition-all hover:scale-105 text-sm xl:text-base relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <div className="flex items-center gap-3 xl:gap-4">
              {/* Get the App - glass pill */}
              <Link 
                href="/#download" 
                className="group relative inline-flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl border border-violet-200/70 bg-white/40 backdrop-blur-md text-espresso hover:bg-white/60 hover:border-violet-300 shadow-sm"
              >
                <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14h.01" />
                </svg>
                <span className="font-semibold text-sm xl:text-base">Get the App</span>
                <svg className="w-4 h-4 text-violet-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {/* Contact Us - primary */}
              <Link 
                href="/contact" 
                className="relative group overflow-hidden bg-gradient-to-r from-violet-600 to-violet-700 text-white px-5 xl:px-7 py-2.5 xl:py-3 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all text-sm xl:text-base"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-violet-600 focus:outline-none p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-xl rounded-lg mt-2 shadow-lg border border-violet-100">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Link
                  href="/#download"
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-espresso border border-violet-200 rounded-lg bg-white/60 hover:bg-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get the App
                </Link>
                <Link
                  href="/contact"
                  className="block w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-2 rounded-lg font-semibold text-center shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
