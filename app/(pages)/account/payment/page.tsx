"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Plus } from "lucide-react"
import Link from "next/link"

export default function PaymentMethodsPage() {
  const { user } = useAuth()
  const [paymentMethods] = useState<any[]>([]) // Will be populated with real data later
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payment Methods</h1>
        <p className="text-muted-foreground mt-1">Manage your payment options</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
        
        {paymentMethods.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <CreditCard className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
              <h3 className="mt-6 text-xl font-medium">No payment methods</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                You haven't added any payment methods yet. Add a payment method to make checkout faster.
              </p>
              <Button className="mt-6 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Payment methods will be mapped here */}
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're working on adding support for saved payment methods. For now, you'll need to enter your payment information during checkout.
          </p>
        </div>
      </div>
    </div>
  )
} 