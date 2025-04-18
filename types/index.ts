// User types
export interface User {
    _id: string
    name: string
    email: string
    image?: string
    role: "user" | "admin"
    createdAt: string | Date
  }
  
  // Product types
  export interface Product {
    _id: string
    name: string
    description: string
    price: number
    compareAtPrice?: number
    images: string[]
    category: string
    collection?: string
    featured?: boolean
    inventory: number
    material?: string
    dimensions?: string
    features?: string[]
    createdAt?: string | Date
    updatedAt?: string | Date
  }
  
  // Order types
  export interface OrderItem {
    _id: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
  }
  
  export interface OrderUser {
    _id: string
    name: string
    email: string
  }
  
  export interface Order {
    _id: string
    user: OrderUser
    items: OrderItem[]
    totalAmount: number
    subtotal?: number
    shipping?: number
    total?: number
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    paymentStatus: "pending" | "completed" | "failed"
    paymentMethod?: string
    razorpayOrderId?: string
    razorpayPaymentId?: string
    createdAt: string | Date
    updatedAt: string | Date
    notes?: string
    customer?: {
      firstName: string
      lastName: string
      email: string
      phone: string
      address: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  
  // Cart types
  export interface CartItem {
    _id: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
  }
  
  // Collection types
  export interface Collection {
    _id: string
    name: string
    slug: string
    description?: string
    image?: string
    products?: Product[]
    createdAt?: string | Date
    updatedAt?: string | Date
  }