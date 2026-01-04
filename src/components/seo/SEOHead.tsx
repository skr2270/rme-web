import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  keywords?: string[]
  structuredData?: object
  noIndex?: boolean
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://ratemyemployee.in/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = [],
  structuredData,
  noIndex = false
}) => {
  const fullTitle = title.includes('Rate My Employee') ? title : `${title} | Rate My Employee`
  const fullDescription = description || 'Transform employee performance with real-time feedback. The only platform combining employee ratings, performance analytics, and smart recruitment for better service quality.'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl || 'https://ratemyemployee.in'} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Rate My Employee" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@RateMyEmployee" />
      <meta name="twitter:creator" content="@RateMyEmployee" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Rate My Employee" />
      <meta name="theme-color" content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Rate My Employee" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}
