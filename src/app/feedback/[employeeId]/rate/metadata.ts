import { Metadata } from 'next'

// Employee data for metadata generation
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

export async function generateMetadata({ params }: { params: { employeeId: string } }): Promise<Metadata> {
  const employee = employeeData[params.employeeId as keyof typeof employeeData];
  
  if (!employee) {
    return {
      title: 'Employee Not Found | Rate My Employee',
      description: 'The employee you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `Rate ${employee.name} - ${employee.position} | Rate My Employee`
  const description = `Rate your experience with ${employee.name}, ${employee.position} with ${employee.experience} experience. ${employee.bio} Current rating: ${employee.rating}/5 from ${employee.reviews} reviews.`

  return {
    title,
    description,
    keywords: [
      `rate ${employee.name}`,
      `${employee.position} feedback`,
      `employee rating ${employee.name}`,
      'customer service feedback',
      'employee performance',
      'service quality rating',
      ...employee.specialties.map(s => s.toLowerCase())
    ],
    openGraph: {
      title,
      description,
      url: `https://ratemyemployee.com/feedback/${params.employeeId}/rate`,
      siteName: 'Rate My Employee',
      images: [
        {
          url: `/employee-${params.employeeId}.jpg`,
          width: 1200,
          height: 630,
          alt: `Rate ${employee.name} - ${employee.position}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/employee-${params.employeeId}.jpg`],
    },
    alternates: {
      canonical: `/feedback/${params.employeeId}/rate`,
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
  }
}
