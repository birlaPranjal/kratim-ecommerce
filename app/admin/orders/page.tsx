"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package, Eye, Search } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  _id: string
  user?: {
    _id?: string
    name?: string
    email?: string
  }
  customer?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  items: any[]
  totalAmount?: number
  total?: number
  paymentStatus: "pending" | "completed" | "failed"
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      const response = await fetch("/api/orders")
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "bg-blue-500"
      case "shipped": return "bg-orange-500"
      case "delivered": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }
  
  // Filter orders based on search and status filter
  const filteredOrders = orders.filter((order) => {
    // Extract customer info for searching, handling both data structures
    const customerName = order.user?.name || 
      (order.customer ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() : '');
    const customerEmail = order.user?.email || order.customer?.email || '';
    
    const searchMatch = 
      searchTerm === "" || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "" || order.orderStatus === statusFilter;
    
    return searchMatch && statusMatch;
  })
  
  if (loading) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchOrders} variant="outline">
          Refresh
        </Button>
      </div>
      
      {/* Orders table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || statusFilter
              ? "Try adjusting your search filters"
              : "No orders have been placed yet"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    #{order._id.toString().substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {order.user?.name || 
                        (order.customer ? 
                          `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() : 
                          'Unknown Customer')}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {order.user?.email || order.customer?.email || 'No email'}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount || order.total || 0)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "completed" ? "outline" : "destructive"}>
                      {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        {filteredOrders.length} orders found
      </div>
    </div>
  )
}
