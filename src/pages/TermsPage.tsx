import { motion } from 'framer-motion';
import { FileText, Mail, Phone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsPage() {
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
            <span>Terms &amp; Conditions</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms &amp; Conditions</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Last updated: July 2026</p>
            </div>
          </div>

          <div className="space-y-8">

            <section>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Please read these Terms &amp; Conditions ("Terms") carefully before using the CleanHike Nepal website located at <strong>cleanhikenepal.com</strong>. By accessing or using our website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue use of our website immediately.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Website Usage</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                By accessing cleanhikenepal.com, you agree to use the website for lawful purposes only. You must not:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>Use the website in any way that violates applicable local, national, or international laws or regulations.</li>
                <li>Transmit any unsolicited or unauthorized advertising or promotional material (spam).</li>
                <li>Attempt to gain unauthorized access to any part of our website, server, or database.</li>
                <li>Interfere with or disrupt the integrity or performance of the website or its content.</li>
                <li>Use any automated tools to scrape, crawl, or extract data from the website without written permission.</li>
                <li>Impersonate any person or organization, or misrepresent your affiliation with any person or entity.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                We reserve the right to terminate access to any user who violates these Terms without prior notice.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Donations</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                CleanHike Nepal accepts voluntary donations to support our environmental conservation and community programs. By making a donation:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>You confirm that the funds donated are your own and are not derived from illegal activities.</li>
                <li>You understand that donations are generally non-refundable except in cases of verified technical errors. Refund requests must be submitted within 7 days of the transaction.</li>
                <li>You acknowledge that CleanHike Nepal will use donations for environmental programs, trail conservation, community outreach, and operational expenses as described on our website.</li>
                <li>Donation amounts and methods are subject to change at our discretion.</li>
                <li>CleanHike Nepal is not responsible for any fees or charges imposed by your payment provider or bank.</li>
              </ul>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Volunteer Participation</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                Participation in CleanHike Nepal's hikes, cleanup events, and volunteer programs is subject to the following:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>Volunteers participate at their own risk. CleanHike Nepal takes reasonable precautions but cannot guarantee complete safety during outdoor activities.</li>
                <li>Participants must disclose any relevant medical conditions or physical limitations prior to participation.</li>
                <li>Participants agree to follow the instructions of CleanHike Nepal organizers and guides at all times.</li>
                <li>Participants must adhere to Leave No Trace principles and environmental guidelines at all times.</li>
                <li>CleanHike Nepal reserves the right to refuse or remove participation from anyone who violates conduct guidelines or endangers others.</li>
                <li>Minors under 18 years must be accompanied by a parent or guardian or have written consent to participate.</li>
              </ul>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                All content on this website — including but not limited to text, photographs, videos, logos, graphics, illustrations, and design elements — is the property of CleanHike Nepal or its contributors and is protected under applicable copyright and intellectual property laws.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>You may not copy, reproduce, distribute, or publicly display any content from this website without prior written permission from CleanHike Nepal.</li>
                <li>Limited personal, non-commercial use of content is permitted provided that CleanHike Nepal is clearly credited.</li>
                <li>The CleanHike Nepal name, logo, and brand identity are trademarks and may not be used without authorization.</li>
              </ul>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                To the fullest extent permitted by law, CleanHike Nepal shall not be liable for:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>Any indirect, incidental, special, or consequential damages arising from your use of our website or services.</li>
                <li>Any loss of data, personal injury, or property damage resulting from participation in events or use of our services.</li>
                <li>Any technical errors, server downtime, or interruptions in website availability.</li>
                <li>Actions or content provided by third-party services linked to or embedded in our website.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                Our total liability shall not exceed the amount, if any, paid by you to CleanHike Nepal in the twelve months preceding the event giving rise to the claim.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Content Accuracy</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We strive to ensure that all information on this website — including hike details, donation figures, event dates, and program descriptions — is accurate and up to date. However, CleanHike Nepal makes no warranties or representations about the accuracy, completeness, or suitability of any information on the website. Trek routes, dates, and conditions are subject to change without notice due to weather, environmental, or safety factors. Always verify critical information directly with our team before participating in any event.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. External Links</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Our website may contain links to external websites, social media platforms, and partner organizations for your convenience. These links are provided for informational purposes only. CleanHike Nepal does not endorse, control, or take responsibility for the content or practices of any linked third-party websites. We encourage you to review the terms and privacy policies of any external sites you visit.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of Nepal. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Nepal. If you are accessing this website from outside Nepal, you do so at your own risk and are responsible for compliance with local laws.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Amendments</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                CleanHike Nepal reserves the right to modify these Terms at any time. Changes take effect upon posting to this page. Continued use of the website after any changes constitutes your acceptance of the revised Terms. We recommend reviewing these Terms periodically.
              </p>
            </section>

            <section className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                For questions, legal inquiries, or concerns about these Terms, please contact us:
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
