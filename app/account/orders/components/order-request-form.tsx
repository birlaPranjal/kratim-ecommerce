 "use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  _id: string
  orderStatus: string
}

interface OrderRequestFormProps {
  order: Order
  onRequestSubmitted: () => void
}

export function OrderRequestForm({ order, onRequestSubmitted }: OrderRequestFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestType, setRequestType] = useState<string>("cancellation")
  const [reason, setReason] = useState<string>("")
  
  const canRequestCancellation = order.orderStatus !== "cancelled" && order.orderStatus !== "delivered"
  const canRequestReturn = order.orderStatus === "delivered"
  
  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your request",
        variant: "destructive",
      })
      return
    }
    
    try {
      setLoading(true)
      
      const response = await fetch(`/api/user/orders/${order._id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType,
          reason,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request")
      }
      
      toast({
        title: "Success",
        description: data.message,
      })
      
      // Close dialog and refresh orders
      setOpen(false)
      onRequestSubmitted()
    } catch (error) {
      console.error("Error submitting request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // If order can't be cancelled or returned, don't render the component
  if (!canRequestCancellation && !canRequestReturn) {
    return (
      <div className="text-sm text-muted-foreground">
        No actions available for this order
      </div>
    )
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-wrap gap-2">
          {canRequestCancellation && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => {
                setRequestType("cancellation")
                setOpen(true)
              }}
            >
              Request Cancellation
            </Button>
          )}
          
          {canRequestReturn && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRequestType("return")
                setOpen(true)
              }}
            >
              Request Return
            </Button>
          )}
        </div>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {requestType === "cancellation" ? "Cancel Order" : "Return Order"}
          </DialogTitle>
          <DialogDescription>
            {requestType === "cancellation" 
              ? "Please provide a reason for cancelling your order."
              : "Please provide a reason for returning your order."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Request Type</h4>
            <Select
              value={requestType}
              onValueChange={setRequestType}
              disabled={!canRequestCancellation || !canRequestReturn}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {canRequestCancellation && (
                  <SelectItem value="cancellation">Cancellation</SelectItem>
                )}
                {canRequestReturn && (
                  <SelectItem value="return">Return</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Reason</h4>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about your request"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}