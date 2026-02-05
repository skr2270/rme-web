export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: February 6, 2026</p>

        <section className="mt-8 space-y-4 text-gray-700 leading-relaxed">
          <p>
            By accessing or using Rate My Employee, you agree to these Terms of Service. If you do not agree, do not
            use the services.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Accounts and Use</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide accurate information and keep your account secure.</li>
            <li>Use the platform only for lawful and genuine purposes.</li>
            <li>We may suspend accounts for misuse, fraud, or policy violations.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Feedback Content</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Feedback must reflect real experiences.</li>
            <li>Abusive or misleading content may be removed.</li>
            <li>Businesses are responsible for how they interpret reviews.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Limitations</h2>
          <p className="text-gray-700">
            The service is provided &quot;as is&quot; without warranties. We are not liable for indirect damages or losses
            resulting from use of the platform.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
          <p className="text-gray-700">Urban Dock Private Limited</p>
          <p className="text-gray-700">Email: info@ratemyemployee.in</p>
          <p className="text-gray-700">Phone: 9490093193</p>
        </section>
      </div>
    </div>
  );
}
