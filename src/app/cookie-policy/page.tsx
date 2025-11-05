import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Sauna & Cold',
  description: 'Cookie Policy for Sauna & Cold - How we use cookies and tracking technologies on our website.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                Sauna & Cold uses cookies to enhance your browsing experience, analyze website traffic, and improve our services. We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Essential website functionality</li>
                <li>Performance and analytics</li>
                <li>User preferences and settings</li>
                <li>Security and fraud prevention</li>
                <li>Improving user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your preferences. The website cannot function properly without these cookies.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Performance Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how visitors use our website, such as which pages are most popular and if visitors get error messages. This information helps us improve our website performance and user experience.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Functionality Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow the website to remember choices you make (such as your location preferences or search filters) and provide enhanced, more personal features.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Targeting/Advertising Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are used to deliver advertisements that are more relevant to you and your interests. They may be set by advertising networks with our permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that set their own cookies. These may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Google Analytics (for website analytics)</li>
                <li>Google Maps (for location services)</li>
                <li>Social media platforms (for social sharing)</li>
                <li>Content delivery networks</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These third parties have their own privacy policies and cookie policies, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Session Cookies</h3>
              <p className="text-gray-700 mb-4">
                These are temporary cookies that are deleted when you close your browser. They help maintain your session while browsing our website.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Persistent Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies remain on your device for a longer period or until you delete them. They help us recognize you when you return to our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">
                You have several options for managing cookies:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their settings. You can usually set your browser to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Accept all cookies</li>
                <li>Reject all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Be notified when a cookie is set</li>
                <li>Delete existing cookies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Cookie Banner</h3>
              <p className="text-gray-700 mb-4">
                When you first visit our website, you'll see a cookie banner where you can choose your cookie preferences. You can change these preferences at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">
                Please note that disabling cookies may affect the functionality of our website. Some features may not work properly if cookies are disabled. Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The updated policy will be posted on this page with a revised "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Browser-Specific Instructions</h2>
              <p className="text-gray-700 mb-4">
                For specific instructions on managing cookies in different browsers:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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