import nodemailer from 'nodemailer';
import { Order } from './orders';
import { formatCurrency, formatDate } from './utils';

// Create a transporter with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: `"Emerald Gold" <${process.env.EMAIL_USER}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(order: Order) {
  if (!order || !order.user || !order.user.email) {
    console.error('Cannot send confirmation: Invalid order or missing email');
    return { success: false, error: 'Invalid order data' };
  }

  // Generate items HTML
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.variant ? `(${item.variant})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  // Calculate and format amounts
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = order.totalAmount;
  const shipping = total - subtotal;

  // Create email HTML content
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333; margin-bottom: 5px;">Order Confirmation</h1>
        <p style="color: #666; margin-bottom: 20px;">Thank you for your order!</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Order Details</h2>
        <p><strong>Order Number:</strong> #${order._id.toString().substring(0, 8).toUpperCase()}</p>
        <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentStatus === 'completed' ? 'Paid Online' : 'Cash on Delivery'}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Items Ordered</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(shipping)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Shipping Address</h2>
        <p>${order.shippingAddress.name}</p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
        <p>${order.shippingAddress.country}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
        <p>If you have any questions, please contact our customer service at <a href="mailto:support@emeraldgold.com" style="color: #007bff;">support@emeraldgold.com</a>.</p>
        <p>&copy; ${new Date().getFullYear()} Emerald Gold. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: order.user.email,
    subject: `Order Confirmation #${order._id.toString().substring(0, 8).toUpperCase()}`,
    html
  });
} 