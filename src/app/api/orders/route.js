import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

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
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// Optional: get all orders (for admin)
export async function GET(req) {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
