import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Sauna & Cold',
  description: 'Terms of Service for Sauna & Cold - Rules and guidelines for using our directory services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Sauna & Cold ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Sauna & Cold is a comprehensive online directory that provides information about saunas, cold plunges, ice baths, and wellness facilities across the United Kingdom. Our service includes facility listings, reviews, ratings, and location information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">To access certain features, you may need to create an account. You agree to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Update your information as necessary</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious content</li>
                <li>Spam or harass other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated scripts or bots without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Reviews</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 User-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you submit but grant us a license to use, display, and distribute it as part of our Service. You are responsible for ensuring your content is accurate and lawful.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Reviews and Ratings</h3>
              <p className="text-gray-700 mb-4">
                Reviews must be based on genuine experiences and be honest, fair, and respectful. We reserve the right to remove reviews that violate our guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Business Listings</h2>
              <p className="text-gray-700 mb-4">
                Business owners may claim and manage their listings. By submitting business information, you warrant that you have the right to do so and that the information is accurate and up-to-date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Sauna & Cold and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>The Service is provided "as is" without warranties of any kind</li>
                <li>We do not guarantee the accuracy of facility information</li>
                <li>We are not responsible for the quality of services at listed facilities</li>
                <li>Use of wellness facilities is at your own risk</li>
                <li>We recommend consulting healthcare professionals before using heat/cold therapy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, Sauna & Cold shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. Changes will be effective when posted on this page. Your continued use of the Service constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> saunaandcold@weltodigital.com<br />
                  <strong>Website:</strong> Sauna & Cold
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}