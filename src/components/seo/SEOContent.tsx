import React from 'react';

interface SEOContentProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const SEOContent: React.FC<SEOContentProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
      {children}
    </div>
  );
};

export const SEOKeywords = ({ keywords }: { keywords: string[] }) => {
  return (
    <div className="hidden">
      <span>Keywords: {keywords.join(', ')}</span>
    </div>
  );
};

export const SEOSchema = ({ schema }: { schema: object }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
};

// SEO-optimized content blocks
export const SEOContentBlocks = {
  Hero: ({ title, subtitle, ctaText, ctaLink }: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  }) => (
    <section className="text-center py-16">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        {title}
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        {subtitle}
      </p>
      <a
        href={ctaLink}
        className="inline-block bg-violet-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-violet-700 transition-colors"
      >
        {ctaText}
      </a>
    </section>
  ),

  Features: ({ features }: { features: Array<{ title: string; description: string; icon: string }> }) => (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Why Choose Rate My Employee?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  ),

  FAQ: ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  ),

  Testimonials: ({ testimonials }: { testimonials: Array<{ name: string; role: string; company: string; content: string; rating: number }> }) => (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        What Our Customers Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-yellow-400 ${
                    i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
            <div>
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  ),

  CTASection: ({ title, description, ctaText, ctaLink }: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  }) => (
    <section className="py-16 bg-violet-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
      <a
        href={ctaLink}
        className="inline-block bg-white text-violet-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        {ctaText}
      </a>
    </section>
  )
};
