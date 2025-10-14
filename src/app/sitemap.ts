import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ratemyemployee.com'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic employee pages (programmatic SEO)
  const employeePages = [
    'john-doe-manager',
    'sarah-wilson-cashier',
    'mike-chen-cook',
    'emma-davis-waitress',
    'alex-kumar-manager',
    'lisa-brown-cashier',
    'david-lee-cook',
    'priya-sharma-waitress',
    'robert-taylor-manager',
    'jennifer-garcia-cashier'
  ].map(employee => ({
    url: `${baseUrl}/feedback/${employee}/rate`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...employeePages]
}
