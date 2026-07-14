import { motion } from 'framer-motion';
import { Shield, Mail, Phone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Privacy Policy</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Last updated: July 2026</p>
            </div>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">

            <section>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                CleanHike Nepal ("we," "us," or "our") is committed to protecting the privacy of every individual who visits our website or engages with our programs. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information. By using our website at <strong>cleanhikenepal.com</strong>, you agree to the practices described below.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">a) Information You Provide Directly</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Contact Forms:</strong> Name, email address, phone number, and your message or inquiry.</li>
                    <li><strong>Volunteer / Participation Registration:</strong> Name, contact details, availability, and area of interest.</li>
                    <li><strong>Donation Information:</strong> Name, contact details, and transaction reference numbers. We do not store full payment credentials.</li>
                    <li><strong>Newsletter Sign-up:</strong> Email address and name.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">b) Information Collected Automatically</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device, and referring URL.</li>
                    <li><strong>IP Address:</strong> Used for analytics, fraud prevention, and geographic analytics.</li>
                    <li><strong>Cookies &amp; Local Storage:</strong> See the Cookies section below.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>Responding to your inquiries and contact form submissions promptly.</li>
                <li>Processing volunteer applications and hike registrations.</li>
                <li>Processing and acknowledging donations; issuing donation confirmations.</li>
                <li>Sending newsletters, updates, and event announcements to subscribers who have opted in.</li>
                <li>Improving our website content, navigation, and user experience.</li>
                <li>Complying with applicable legal and regulatory obligations.</li>
                <li>Preventing fraudulent activity and ensuring platform security.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Donation Information</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Donations are processed through third-party payment gateways including eSewa, Khalti, IME Pay, ConnectIPS, and bank transfer. We collect transaction reference numbers and basic donor information solely for record-keeping and to issue donation acknowledgements. Full payment card details are handled exclusively by the respective payment processors and are never stored on our servers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3">
                Donor information is kept confidential. Donor names may appear on our website's donor recognition section only with your explicit consent.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies &amp; Similar Technologies</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                We use cookies and similar technologies to enhance your browsing experience. Cookies are small text files stored on your device. We use:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality such as theme preferences and session management.</li>
                <li><strong>Analytics Cookies:</strong> Anonymous usage statistics to understand how visitors interact with our site.</li>
                <li><strong>Preference Cookies:</strong> Remembering your language and display preferences.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                You may disable cookies through your browser settings; however, some features of the website may not function correctly without them.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Third-Party Services</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                Our website may use the following third-party services that have their own privacy policies:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li><strong>Supabase:</strong> Secure database and authentication services.</li>
                <li><strong>Google Maps:</strong> Interactive maps embedded on our contact page.</li>
                <li><strong>Social Media Platforms (Facebook, Instagram, YouTube):</strong> Social share buttons and embedded content. Their policies apply when interacting with these elements.</li>
                <li><strong>Payment Gateways (eSewa, Khalti, IME Pay, ConnectIPS):</strong> Processing donations securely.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                We encourage you to review the privacy policies of these third-party services independently.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                Depending on your jurisdiction, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                <li><strong>Objection:</strong> Object to processing of your data for specific purposes such as marketing.</li>
                <li><strong>Withdrawal of Consent:</strong> Unsubscribe from newsletters or withdraw any given consent at any time.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                To exercise any of these rights, please contact us at <a href="mailto:acharyaraj2005@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">acharyaraj2005@gmail.com</a>.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction. These include HTTPS encryption, secure authentication, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We encourage you to use strong passwords and keep your devices secure.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will take steps to delete such information.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by posting the updated policy on this page with a revised date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:acharyaraj2005@gmail.com"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-all group"
                >
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">acharyaraj2005@gmail.com</p>
                  </div>
                </a>
                <a
                  href="tel:+9779876726276"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-all group"
                >
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">98767262762</p>
                  </div>
                </a>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
