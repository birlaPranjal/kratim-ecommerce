import { Metadata } from "next"
import { FileText, Shield, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | Kratim Jewellery",
  description: "Read our terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Terms & Conditions</h1>
          <p className="text-gray-600 text-lg">Read our terms and conditions for using our website and services</p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Definitions</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Kratim Jewellery. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Terms of Use</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                Your use of the website and/or purchase from us are governed by following Terms and Conditions:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    The content of the pages of this website is subject to change without notice.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    You may not create a link to our website from another website or document without Kratim Jewellery prior written consent.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">
                    We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 