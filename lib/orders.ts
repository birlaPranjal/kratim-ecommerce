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
  adminComment?: string
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
  
  const order = {
    ...orderData,
    orderStatus: "processing",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection("orders").insertOne(order)
  return { ...order, _id: result.insertedId.toString() }
}

export async function updateOrderStatus(id: string, orderStatus: Order["orderStatus"], adminComment?: string) {
  const { db } = await connectToDatabase()
  
  const updateData: Partial<Order> = { 
    orderStatus, 
    updatedAt: new Date() 
  }
  
  if (adminComment) {
    updateData.adminComment = adminComment
  }
  
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
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
  
  return getOrderById(orderId)
}

export async function addAdminComment(orderId: string, comment: string) {
  const { db } = await connectToDatabase()
  
  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { 
      $set: { 
        adminComment: comment,
        updatedAt: new Date() 
      } 
    }
  )
  
  return getOrderById(orderId)
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
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
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
  
  const calculateTotalAmount = (order: any) => {
    return (order.totalAmount || order.total || 0);
  };
  
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + calculateTotalAmount(order), 0)
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + calculateTotalAmount(order), 0)
  
  const revenueChange = lastMonthRevenue === 0 
    ? 100 
    : Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
  
  const orderChange = lastMonthOrders.length === 0 
    ? 100 
    : Math.round(((monthlyOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100)
  
  const monthlySales = generateMonthlySalesData(monthlyOrders)
  
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

function generateMonthlySalesData(orders: any[]) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  const currentMonth = new Date().getMonth()
  const monthlyData = Array(6).fill(0).map((_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12
    return { name: months[monthIndex], total: 0 }
  })
  
  orders.forEach(order => {
    const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)
    const monthIndex = orderDate.getMonth()
    const monthName = months[monthIndex]
    
    const dataIndex = monthlyData.findIndex(item => item.name === monthName)
    if (dataIndex !== -1) {
      const orderAmount = order.totalAmount || order.total || 0
      monthlyData[dataIndex].total += orderAmount
    }
  })
  
  return monthlyData
} 