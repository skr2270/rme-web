export const getBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Rate My Employee",
    "description": "Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment for better service quality.",
    "url": "https://ratemyemployee.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "description": "Free 14-day trial with no credit card required"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "provider": {
      "@type": "Organization",
      "name": "Rate My Employee",
      "url": "https://ratemyemployee.com",
      "logo": "https://ratemyemployee.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9876543210",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "India"
      }
    },
    "featureList": [
      "Real-time employee feedback",
      "Performance analytics dashboard",
      "Customer satisfaction tracking",
      "Team management tools",
      "Recruitment insights",
      "Mobile app support"
    ],
    "screenshot": "https://ratemyemployee.com/screenshot.jpg",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0]
  }
}

export const getOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rate My Employee",
    "url": "https://ratemyemployee.com",
    "logo": "https://ratemyemployee.com/logo.png",
    "description": "Leading employee performance management platform for businesses across India",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Rate My Employee Team"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "email": "support@ratemyemployee.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India"
    },
    "sameAs": [
      "https://twitter.com/RateMyEmployee",
      "https://linkedin.com/company/ratemyemployee",
      "https://github.com/ratemyemployee"
    ],
    "numberOfEmployees": "10-50",
    "industry": "Software Development",
    "knowsAbout": [
      "Employee Performance Management",
      "Customer Feedback Systems",
      "HR Analytics",
      "Team Management Software"
    ]
  }
}

export const getFAQStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does Rate My Employee work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rate My Employee allows customers to rate their service experience with specific employees. Businesses get real-time feedback, performance analytics, and insights to improve service quality."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free trial available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can I set up the system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can set up Rate My Employee in under 10 minutes with our guided onboarding process. Simply add your employees and start collecting feedback immediately."
        }
      },
      {
        "@type": "Question",
        "name": "What industries do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve restaurants, retail stores, hotels, healthcare facilities, and any business that wants to improve customer service through employee feedback."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We use enterprise-grade security with data encryption, secure servers, and comply with all data protection regulations."
        }
      }
    ]
  }
}

export const getBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
