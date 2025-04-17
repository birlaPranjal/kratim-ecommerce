import { Metadata } from "next"
import { Shield, Cookie, Link as LinkIcon, Lock, Bell, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Kratim Jewellery",
  description: "Read our privacy policy to understand how we collect and use your information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Read our privacy policy to understand how we collect and use your information</p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Collection of Information</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                If you browse through this site without providing us with any personal information, we will gather and store some information about your visit, such as:
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>IP address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Type of browser and operating system used</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Date and time you access our site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Pages you visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>If you linked to our website from another website, the address of that website</span>
                </li>
              </ul>
              
              <p className="text-gray-700 mt-6">
                This information will not identify you personally and will not be linked back to you.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Use and Sharing of Information</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                At no time will we sell your personally-identifiable data without your permission unless set forth in this Privacy Policy. The information we receive about you or from you may be used by us or shared by us with our corporate affiliates, dealers, agents, vendors and other third parties to:
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Help process your request</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Comply with any law, regulation, audit or court order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Help improve our website or the products or services we offer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Conduct research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Better understand our customers' needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Develop new offerings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Alert you to new products and services (of us or our business associates) in which you may be interested</span>
                </li>
              </ul>
              
              <p className="text-gray-700 mt-6">
                We may also combine information you provide us with information about you that is available to us internally or from other sources in order to better serve you. We do not share, sell, trade or rent your personal information to third parties for unknown reasons.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Cookie className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Cookies</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                From time to time, we may place "cookies" on your personal computer. "Cookies" are small identifiers sent from a web server and stored on your computer's hard drive, that help us to recognize you if you visit our website again. Also, our site uses cookies to track how you found our site.
              </p>
              
              <p className="text-gray-700">
                To protect your privacy we do not use cookies to store or transmit any personal information about you on the Internet. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies certain features of the site may not function property or at all as a result.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <LinkIcon className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Links</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                Our website contains links to other sites. Such other sites may use information about your visit to this website. Our Privacy Policy does not apply to practices of such sites that we do not own or control or to people we do not employ. Therefore, we are not responsible for the privacy practices or the accuracy or the integrity of the content included on such other sites. We encourage you to read the individual privacy statements of such websites.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Lock className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Security</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                We safeguard your privacy using known security standards and procedures and comply with applicable privacy laws. Our websites combine industry-approved physical, electronic and procedural safeguards to ensure that your information is well protected though it's life cycle in our infrastructure.
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Sensitive data is hashed or encrypted when it is stored in our infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Sensitive data is decrypted, processed and immediately re-encrypted or discarded when no longer necessary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>We host web services in audited data centers, with restricted access to the data processing servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>Controlled access, recorded and live-monitored video feeds, 24/7 staffed security and biometrics provided in such data centers ensure that we provide secure hosting</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <HelpCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Questions</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                If you have any questions about our Privacy Policy, please e-mail your questions to us at support.kratim@gmail.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 