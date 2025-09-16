import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Type definitions for better code completion
/**
 * @typedef {Object} Order
 * @property {string} _id
 * @property {string} productId
 * @property {string} productName
 * @property {number} quantity
 * @property {number} totalPrice
 * @property {Object} customer
 * @property {string} customer.name
 * @property {string} customer.email
 * @property {string} customer.address
 * @property {string} customer.phone
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

/**
 * Connects to MongoDB if not already connected
 * @returns {Promise<void>}
 */
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

// Order schema
const orderSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    quantity: Number,
    totalPrice: Number,
    customer: {
      name: String,
      email: String,
      address: String,
      phone: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

// Create order
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get all orders (for admin)
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
