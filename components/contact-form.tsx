"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AtSign, MapPin, Phone } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // This is a placeholder - in a real app, you would send the form data to a server
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4 text-secondary">Contact Us</h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-serif font-medium mb-6 text-secondary">Get in Touch</h3>
            <p className="text-foreground mb-8">
              We're here to help with any questions about our pieces, 
              custom orders, or anything else you need. Feel free to reach out.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Our Store</h4>
                  <address className="text-foreground not-italic">
                    123 Jewelry Lane, Gemstone District<br />
                    New York, NY 10001
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-foreground">(212) 555-0123</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <AtSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-foreground">contact@emeraldgold.com</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-serif font-medium text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700 mb-4">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 