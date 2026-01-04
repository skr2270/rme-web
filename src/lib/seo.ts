// SEO Configuration and Utilities

export const SEO_CONFIG = {
  siteName: 'Rate My Employee',
  siteUrl: 'https://ratemyemployee.in',
  defaultTitle: 'Rate My Employee | Stop Losing Customers To Bad Service',
  defaultDescription: 'Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment. Set up in under 10 minutes. Join 500+ businesses across India.',
  defaultKeywords: [
    'employee feedback',
    'customer service',
    'performance management',
    'employee rating',
    'service quality',
    'team management',
    'HR analytics',
    'customer satisfaction',
    'employee performance',
    'feedback system',
    'business software',
    'India'
  ],
  social: {
    twitter: '@RateMyEmployee',
    facebook: 'RateMyEmployee',
    linkedin: 'company/ratemyemployee',
    instagram: 'ratemyemployee'
  },
  contact: {
    email: 'support@ratemyemployee.in',
    phone: '+91-9876543210',
    address: 'India'
  }
};

// Generate page-specific metadata
export const generatePageMetadata = (page: {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  image?: string;
  noIndex?: boolean;
}) => {
  const fullTitle = page.title.includes(SEO_CONFIG.siteName) 
    ? page.title 
    : `${page.title} | ${SEO_CONFIG.siteName}`;
  
  const fullDescription = page.description || SEO_CONFIG.defaultDescription;
  const keywords = [...SEO_CONFIG.defaultKeywords, ...(page.keywords || [])];
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${page.path}`;
  const ogImage = page.image || `${SEO_CONFIG.siteUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords,
    canonical: canonicalUrl,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: SEO_CONFIG.social.twitter,
      site: SEO_CONFIG.social.twitter,
    },
    robots: {
      index: !page.noIndex,
      follow: true,
      googleBot: {
        index: !page.noIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

// Generate structured data for different page types
export const generateStructuredData = {
  // Homepage structured data
  homepage: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "description": SEO_CONFIG.defaultDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SEO_CONFIG.siteUrl}/feedback?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }),

  // Organization structured data
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "logo": `${SEO_CONFIG.siteUrl}/logo.png`,
    "description": SEO_CONFIG.defaultDescription,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SEO_CONFIG.contact.phone,
      "contactType": "customer service",
      "email": SEO_CONFIG.contact.email,
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India"
    },
    "sameAs": [
      `https://twitter.com/${SEO_CONFIG.social.twitter}`,
      `https://linkedin.com/${SEO_CONFIG.social.linkedin}`,
      `https://facebook.com/${SEO_CONFIG.social.facebook}`,
      `https://instagram.com/${SEO_CONFIG.social.instagram}`
    ]
  }),

  // Software application structured data
  software: () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SEO_CONFIG.siteName,
    "description": SEO_CONFIG.defaultDescription,
    "url": SEO_CONFIG.siteUrl,
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
      "name": SEO_CONFIG.siteName,
      "url": SEO_CONFIG.siteUrl
    }
  }),

  // Employee structured data
  employee: (employee: {
    name: string;
    position: string;
    department: string;
    rating: number;
    reviews: number;
    bio: string;
  }) => ({
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
  }),

  // Breadcrumb structured data
  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  })
};

// SEO utility functions
export const seoUtils = {
  // Generate meta tags for head
  generateMetaTags: (metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      type?: string;
      images?: Array<{ url?: string }>;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
    };
  }) => {
    const tags: string[] = [];
    
    // Basic meta tags
    if (metadata.title) tags.push(`<title>${metadata.title}</title>`);
    if (metadata.description) tags.push(`<meta name="description" content="${metadata.description}" />`);
    if (Array.isArray(metadata.keywords)) {
      tags.push(`<meta name="keywords" content="${metadata.keywords.join(', ')}" />`);
    }
    
    // Open Graph tags
    if (metadata.openGraph) {
      if (metadata.openGraph.title) tags.push(`<meta property="og:title" content="${metadata.openGraph.title}" />`);
      if (metadata.openGraph.description) tags.push(`<meta property="og:description" content="${metadata.openGraph.description}" />`);
      if (metadata.openGraph.url) tags.push(`<meta property="og:url" content="${metadata.openGraph.url}" />`);
      if (metadata.openGraph.type) tags.push(`<meta property="og:type" content="${metadata.openGraph.type}" />`);
      if (metadata.openGraph.images?.[0]?.url) tags.push(`<meta property="og:image" content="${metadata.openGraph.images[0].url}" />`);
    }
    
    // Twitter Card tags
    if (metadata.twitter) {
      if (metadata.twitter.card) tags.push(`<meta name="twitter:card" content="${metadata.twitter.card}" />`);
      if (metadata.twitter.title) tags.push(`<meta name="twitter:title" content="${metadata.twitter.title}" />`);
      if (metadata.twitter.description) tags.push(`<meta name="twitter:description" content="${metadata.twitter.description}" />`);
      if (metadata.twitter.images?.[0]) tags.push(`<meta name="twitter:image" content="${metadata.twitter.images[0]}" />`);
    }
    
    return tags.join('\n');
  },

  // Validate SEO requirements
  validateSEO: (page: {
    title: string;
    description: string;
    path: string;
  }) => {
    const issues = [];
    
    if (page.title.length < 30) {
      issues.push('Title should be at least 30 characters');
    }
    if (page.title.length > 60) {
      issues.push('Title should be less than 60 characters');
    }
    if (page.description.length < 120) {
      issues.push('Description should be at least 120 characters');
    }
    if (page.description.length > 160) {
      issues.push('Description should be less than 160 characters');
    }
    if (!page.path.startsWith('/')) {
      issues.push('Path should start with /');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
};
