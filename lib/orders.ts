import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface OrderItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

export interface Order {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentStatus: "pending" | "completed" | "failed"
  paymentId?: string
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export async function getOrders() {
  const { db } = await connectToDatabase()
  return db.collection("orders").find().sort({ createdAt: -1 }).toArray()
}

export async function getOrderById(id: string) {
  const { db } = await connectToDatabase()
  return db.collection("orders").findOne({ _id: new ObjectId(id) })
}

export async function getUserOrders(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection("orders").find({ "user._id": userId }).sort({ createdAt: -1 }).toArray()
}

export async function createOrder(orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()
  
  const order: Order = {
    ...orderData,
    orderStatus: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection("orders").insertOne(order)
  return { ...order, _id: result.insertedId.toString() }
}

export async function updateOrderStatus(id: string, orderStatus: Order["orderStatus"]) {
  const { db } = await connectToDatabase()
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { orderStatus, updatedAt: new Date() } }
  )
  return getOrderById(id)
}

export async function updatePaymentStatus(orderId: string, status: "completed" | "failed", razorpayPaymentId?: string) {
  const { db } = await connectToDatabase()
  
  const updateData: Partial<Order> = {
    paymentStatus: status,
    updatedAt: new Date()
  }

  if (razorpayPaymentId) {
    updateData.paymentId = razorpayPaymentId
  }

  if (status === "completed") {
    updateData.orderStatus = "processing"
  }

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: updateData }
  )
}

export async function updateOrder(id: string, updateData: Partial<Order>) {
  const { db } = await connectToDatabase()
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  )
  return getOrderById(id)
}

export async function getRecentOrders(limit = 5) {
  const { db } = await connectToDatabase()
  return db.collection("orders").find().sort({ createdAt: -1 }).limit(limit).toArray()
}

export async function getOrderStats() {
  const { db } = await connectToDatabase()
  
  const totalOrders = await db.collection("orders").countDocuments()
  const processOrders = await db.collection("orders").countDocuments({ orderStatus: "processing" })
  const completedOrders = await db.collection("orders").countDocuments({ orderStatus: "delivered" })
  
  // Monthly revenue
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  // Last month for comparison
  const startOfLastMonth = new Date(startOfMonth)
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
  
  const lastMonthOrders = await db.collection("orders").find({
    createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    paymentStatus: "completed"
  }).toArray()
  
  const monthlyOrders = await db.collection("orders").find({
    createdAt: { $gte: startOfMonth },
    paymentStatus: "completed"
  }).toArray()
  
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  
  // Calculate percentage changes
  const revenueChange = lastMonthRevenue === 0 
    ? 100 
    : Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
  
  const orderChange = lastMonthOrders.length === 0 
    ? 100 
    : Math.round(((monthlyOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100)
  
  // Generate mock monthly sales data
  const monthlySales = generateMonthlySalesData(monthlyRevenue)
  
  return {
    totalOrders,
    processOrders,
    completedOrders,
    monthlyRevenue,
    revenueChange,
    orderChange,
    monthlySales
  }
}

// Helper function to generate monthly sales data
function generateMonthlySalesData(totalRevenue: number) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  const currentMonth = new Date().getMonth()
  const lastSixMonths = months
    .slice(Math.max(0, currentMonth - 5), currentMonth + 1)
    .map((name, i, arr) => {
      // Distribute the total revenue across months with a random variation
      // Make the last month (current month) have the largest share
      const factor = i === arr.length - 1 
        ? 0.3 + Math.random() * 0.2 // Current month gets 30-50% of revenue
        : (0.5 + Math.random() * 0.5) * (i + 1) / arr.length // Earlier months get progressively less
        
      return {
        name,
        total: Math.round(totalRevenue * factor / arr.length * 10) / 10
      }
    })
    
  return lastSixMonths
} 