'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

// Define the order types
type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

type OrderItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

type Order = {
  id: string
  orderNumber: string
  date: string
  total: number
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      // Fetch orders from API
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/user/orders')
          
          if (!response.ok) {
            throw new Error('Failed to fetch orders')
          }
          
          const data = await response.json()
          setOrders(data.orders || [])
        } catch (error) {
          console.error('Error fetching orders:', error)
          toast({
            title: "Error",
            description: "Could not load your orders. Please try again later.",
            variant: "destructive"
          })
          // Fall back to mock data if API fails in development
          if (process.env.NODE_ENV === 'development') {
            setOrders(mockOrders)
          }
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchOrders()
    }
  }, [status, router, session, toast])

  // Mock orders data as fallback
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2023-001',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      total: 249.99,
      status: 'delivered',
      items: [
        {
          id: '1',
          productId: 'prod-1',
          name: 'Gold Pendant Necklace',
          price: 149.99,
          quantity: 1,
          image: 'https://placehold.co/1920x1080/gold/white?text=necklace-1'
        },
        {
          id: '2',
          productId: 'prod-2',
          name: 'Silver Stud Earrings',
          price: 49.99,
          quantity: 2,
          image: 'https://placehold.co/1920x1080/gold/white?text=earings-1'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    },
    {
      id: '2',
      orderNumber: 'ORD-2023-002',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      total: 599.99,
      status: 'shipped',
      items: [
        {
          id: '3',
          productId: 'prod-3',
          name: 'Diamond Ring',
          price: 599.99,
          quantity: 1,
          image: 'https://placehold.co/1920x1080/gold/white?text=jewelry-1'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    }
  ]

  // Function to get the appropriate status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Processing</span>
      case 'shipped':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Shipped</span>
      case 'delivered':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Delivered</span>
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Cancelled</span>
      default:
        return null
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-lg">Loading your orders...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link href="/account" className="text-blue-600 hover:text-blue-500">
          Back to Account
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
          <h2 className="text-xl font-medium mb-4">You haven't placed any orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Browse our collections and discover our latest products.
          </p>
          <Link 
            href="/shop" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-150"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placed {formatDistanceToNow(new Date(order.date))} ago
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
                    <div className="mr-4 mb-2 md:mb-0">{getStatusBadge(order.status)}</div>
                    <div className="text-right">
                      <span className="block text-lg font-semibold">${order.total.toFixed(2)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{order.items.length} items</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ITEMS</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-500">
                              Image
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <div className="mt-1 flex justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SHIPPING ADDRESS</h3>
                  <p className="text-sm">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Link 
                    href={`/account/orders/${order.id}`}
                    className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    View Order Details
                  </Link>
                  
                  {order.status === 'delivered' && (
                    <button
                      className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                    >
                      Write a Review
                    </button>
                  )}
                  
                  <button
                    className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    {order.status === 'delivered' ? 'Buy Again' : 'Track Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
