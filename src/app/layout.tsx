import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rate My Employee | Stop Losing Customers To Bad Service",
  description: "Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment. Set up in under 10 minutes. Join 500+ businesses across India.",
  keywords: [
    "employee feedback",
    "customer service",
    "performance management",
    "employee rating",
    "service quality",
    "team management",
    "HR analytics",
    "customer satisfaction",
    "employee performance",
    "feedback system",
    "business software",
    "India"
  ],
  authors: [{ name: "Rate My Employee Team" }],
  creator: "Rate My Employee",
  publisher: "Rate My Employee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ratemyemployee.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Rate My Employee | Stop Losing Customers To Bad Service",
    description: "Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment. Set up in under 10 minutes. Join 500+ businesses across India.",
    url: 'https://ratemyemployee.com',
    siteName: 'Rate My Employee',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rate My Employee - Employee Performance Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rate My Employee | Stop Losing Customers To Bad Service",
    description: "Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment.",
    images: ['/og-image.jpg'],
    creator: '@RateMyEmployee',
    site: '@RateMyEmployee',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
