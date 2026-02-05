export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: February 6, 2026</p>

        <section className="mt-8 space-y-4 text-gray-700 leading-relaxed">
          <p>
            Rate My Employee (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you
            use our website and mobile applications.
          </p>
          <p>
            By using the services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Account details such as name, phone number, email, and role (business owner, employee, or customer).</li>
            <li>Business information including GSTIN, business name, locations, and contact details.</li>
            <li>Feedback and rating data submitted through the platform.</li>
            <li>Device and usage data such as IP address, browser type, and app activity logs.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">How We Use Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and operate the platform, including QR-based feedback and dashboards.</li>
            <li>Verify accounts and protect against fraud or misuse.</li>
            <li>Improve product experience, performance, and customer support.</li>
            <li>Communicate important service updates and operational notices.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Sharing of Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>We do not sell or rent personal information.</li>
            <li>We share data with service providers only to operate the platform (e.g., SMS providers for OTP).</li>
            <li>We may disclose information if required by law or to protect the platform and users.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Permissions</h2>
          <p className="text-gray-700">
            The mobile app may request permissions such as Camera and Location to enable QR scanning and business
            location features. These permissions are used only for the stated functionality and can be managed in your
            device settings.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Data Retention</h2>
          <p className="text-gray-700">
            We retain data as long as necessary to provide services, comply with legal obligations, resolve disputes,
            and enforce agreements.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Security</h2>
          <p className="text-gray-700">
            We implement reasonable administrative, technical, and physical safeguards to protect personal data.
            However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Choices</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Update or correct account information by contacting support.</li>
            <li>Request account deletion or data access via the app settings where available.</li>
            <li>Control app permissions in your device settings.</li>
          </ul>
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
