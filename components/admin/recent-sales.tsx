import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

// Updated Order interface to match the actual data structure
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
  items: OrderItem[]
  totalAmount?: number
  total?: number
  orderStatus?: string
  paymentStatus?: string
  createdAt: string
}

interface RecentSalesProps {
  orders: Order[]
}

export function RecentSales({ orders }: RecentSalesProps) {
  // If no orders were provided, return empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No recent orders to display
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => {
        // Get customer name from either data structure
        const customerName = order.user?.name || 
          (order.customer ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() : '');
        
        // Get customer email from either data structure  
        const customerEmail = order.user?.email || order.customer?.email || '';
        
        // Generate initials from name, with fallback
        const initials = customerName 
          ? customerName.split(" ").map(n => n[0]).join("").toUpperCase() 
          : "UN";
        
        // Get order amount from either totalAmount or total
        const orderAmount = order.totalAmount || order.total || 0;
          
        return (
          <div key={order._id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {customerName || "Unknown Customer"}
              </p>
              <p className="text-xs text-muted-foreground">
                {customerEmail || "No email"}
              </p>
            </div>
            <div className="ml-auto font-medium">{formatCurrency(orderAmount)}</div>
          </div>
        );
      })}
    </div>
  )
} 