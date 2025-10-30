'use client';

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-beige-luxe">
      <Navbar />

      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-espresso-glass border border-violet-200 text-violet-700 text-xs font-bold mb-5">
              CONTACT US
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-espresso mb-4">We’d love to hear from you</h1>
            <p className="text-espresso-soft text-lg max-w-2xl mx-auto">Tell us about your team and goals. We’ll get back within one business day.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="bg-beige-card rounded-2xl border border-amber-100/60 shadow-lg p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-espresso mb-2">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-espresso"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-espresso mb-2">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-espresso"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-espresso mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-espresso resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                  Send message
                </button>
                {submitted && (
                  <p className="text-center text-sm text-violet-700">Thanks! We’ll be in touch shortly.</p>
                )}
              </form>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div className="bg-beige-card rounded-2xl border border-amber-100/60 shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-espresso mb-4">Talk to sales</h2>
                <p className="text-espresso-soft mb-4">Ready to transform your workforce? Our team can help you plan the perfect rollout.</p>
                <Link href="mailto:hello@ratemyemployee.in" className="text-violet-700 font-semibold">hello@ratemyemployee.in</Link>
              </div>

              <div className="bg-beige-card rounded-2xl border border-amber-100/60 shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-espresso mb-4">Get the app</h2>
                <p className="text-espresso-soft mb-4">Customers and employees can use the app for the best experience.</p>
                <div className="flex gap-3">
                  <Link href="/#download" className="px-4 py-2 rounded-lg border border-violet-200 bg-white/70 text-espresso hover:bg-white">Download</Link>
                  <Link href="/feedback" className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white">Try Demo</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


