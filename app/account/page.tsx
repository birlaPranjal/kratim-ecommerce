'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

// Define the user type
type User = {
  name: string
  email: string
  image?: string
}

type Order = {
  id: string
  orderNumber: string
  date: string
  total: number
  status: string
  items: number
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user) {
      setUser(session.user as User)
      
      // Fetch user's recent orders
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user/orders?limit=3`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch orders')
          }
          
          const data = await response.json()
          setRecentOrders(data.orders || [])
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast({
            title: "Error",
            description: "Could not load your recent orders. Please try again later.",
            variant: "destructive"
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchUserData()
    }
  }, [status, session, router, toast])

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-lg">Loading your account...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mb-3"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center">
                  <span className="text-2xl">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              <Link 
                href="/account" 
                className="flex items-center px-4 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                Account Overview
              </Link>
              <Link 
                href="/account/orders" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                My Orders
              </Link>
              <Link 
                href="/account/addresses" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Saved Addresses
              </Link>
              <Link 
                href="/account/wishlist" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Wishlist
              </Link>
              <Link 
                href="/account/settings" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Settings
              </Link>
              <button 
                className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mt-4"
                onClick={() => {
                  // Handle logout here
                }}
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Name</h3>
                <p>{user?.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Email</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link 
                href="/account/orders" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All
              </Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">#{order.orderNumber}</span>
                      <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{order.items} item(s)</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-500 block"
                    >
                      View Order
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No recent orders found.</p>
                <Link 
                  href="/shop" 
                  className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Link 
                href="/account/addresses" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All
              </Link>
            </div>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No addresses saved yet.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-500">
                Add New Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}