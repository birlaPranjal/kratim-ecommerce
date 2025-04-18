import { Metadata } from "next"
import { Truck, RefreshCw, Shield, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping & Returns Policy | KRatim",
  description: "Learn about our shipping and returns policies for your jewelry purchases.",
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Shipping & Returns Policy</h1>
          <p className="text-gray-600 text-lg">Learn about our shipping and returns policies for your jewelry purchases</p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Shipping Information</h2>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-serif font-semibold mb-4 text-amber-800">India</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-3">Shipping Charges</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Free Shipping: Enjoy free shipping on all orders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Cash on Delivery (COD) Available: A flat fee of Rs. 100 will be added to all COD orders</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Delivery Method</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Orders shipped via Standard Shipping will be delivered within 6-7 business days</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Please Note</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Orders will be dispatched within 24-48 hours of placing the order</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Shipping timelines may vary depending on the destination and weight of your parcel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>In case of any unforeseen delays, we will keep you informed and provide tracking details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>For any shipping-related queries, feel free to reach out at +91 9009770175</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-serif font-semibold mb-4 text-amber-800">International</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-3">Delivery Method</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Orders shipped via FedEx Express will be delivered within 7-8 business days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Orders shipped via Economy Service will be delivered within 10-15 business days</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Shipping Charges</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>International shipping charges are extra and vary by country</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Please contact our team at +91 9009770175 for any international shipping-related queries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>Our shipping charges do not include customs duty</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Please Note</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>GST, duties, and taxes applicable as per your country's regulations are to be borne by the customer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>These charges will be billed separately by the courier company at the time of delivery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Refunds & Exchanges</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3 text-amber-800">Refunds</h3>
                <p className="text-gray-700">The products once purchased are not returnable.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3 text-amber-800">Exchanges</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>We only replace items if they are defective or damaged</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Please send us an email at Kratim.support@gmail.com or whatsapp at +91 9009770175 within 48 hours of receiving the order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Parcel opening video is mandatory for claim for any defective or damaged product</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Contact Us</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                For any further queries, feel free to get in touch with our support team. Happy Shopping!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-700">Kratim.support@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-700">+91 9009770175</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 