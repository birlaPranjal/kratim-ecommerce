"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, MessageSquare, Truck, CheckCircle, Package, Printer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Order, OrderItem } from "@/lib/orders"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const orderId = params.id
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const [adminComment, setAdminComment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  
  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])
  
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus)
      setAdminComment(order.adminComment || "")
    }
  }, [order])
  
  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }
      
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.orderStatus) return
    
    try {
      setStatusUpdateLoading(true)
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
          comment: adminComment !== order?.adminComment ? adminComment : undefined
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update order status")
      }
      
      const data = await response.json()
      setOrder(data.order)
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setStatusUpdateLoading(false)
    }
  }
  
  const handleCommentUpdate = async () => {
    if (!adminComment.trim() || adminComment === order?.adminComment) return
    
    try {
      setCommentLoading(true)
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: adminComment,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to add comment")
      }
      
      const data = await response.json()
      setOrder(data.order)
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setCommentLoading(false)
    }
  }
  
  const handlePrint = () => {
    window.print()
  }
  
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link href="/admin/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  // Status badge color class based on status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "processing": return "bg-blue-500"
      case "shipped": return "bg-orange-500"
      case "delivered": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }
  
  // Get status icon component
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <Package className="h-4 w-4 mr-2" />
      case "shipped": return <Truck className="h-4 w-4 mr-2" />
      case "delivered": return <CheckCircle className="h-4 w-4 mr-2" />
      case "cancelled": return <div className="h-4 w-4 mr-2">✕</div>
      default: return null
    }
  }
  
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Order Info Card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Order #{order._id.toString().substring(0, 8).toUpperCase()}</CardTitle>
                  <CardDescription>
                    Placed on {formatDate(new Date(order.createdAt))}
                  </CardDescription>
                </div>
                <Badge className={getStatusColorClass(order.orderStatus)}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">Name:</span> {order.user.name}</p>
                    <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Items */}
                <div>
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-start space-x-4">
                        <div className="relative w-16 h-16 overflow-hidden rounded border">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">Variant: {item.variant}</p>
                          )}
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Order Summary */}
                <div>
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-sm">
                        {formatCurrency(
                          order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Shipping</p>
                      <p className="text-sm">
                        {formatCurrency(
                          (order.totalAmount || order.total || 0) - 
                          order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                        )}
                      </p>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Discount</p>
                        <p className="text-sm text-green-600">-{formatCurrency(order.discount)}</p>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p>{formatCurrency(order.totalAmount || order.total || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">Method:</span> {order.paymentMethod || 'Standard'}</p>
                    <div className="flex items-center justify-between">
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        <Badge variant={order.paymentStatus === "completed" ? "success" : "outline"}>
                          {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                        </Badge>
                      </p>
                      
                      {order.paymentStatus === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  paymentStatus: "completed"
                                }),
                              });
                              
                              if (!response.ok) throw new Error("Failed to update payment status");
                              
                              const data = await response.json();
                              setOrder(data.order);
                              
                              toast({
                                title: "Success",
                                description: "Payment marked as completed",
                              });
                            } catch (error) {
                              console.error("Error updating payment status:", error);
                              toast({
                                title: "Error",
                                description: "Failed to update payment status",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </div>

                    {order.paymentId && (
                      <p><span className="font-medium">Payment ID:</span> {order.paymentId}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Status Update Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={statusUpdateLoading || selectedStatus === order.orderStatus}
                onClick={handleStatusUpdate}
              >
                {statusUpdateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : "Update Status"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Admin Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Admin Notes</CardTitle>
              <CardDescription>
                Add private notes about this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={adminComment} 
                onChange={(e) => setAdminComment(e.target.value)}
                rows={4}
                placeholder="Add notes about this order"
              />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                disabled={commentLoading || adminComment === (order.adminComment || "")}
                onClick={handleCommentUpdate}
              >
                {commentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 