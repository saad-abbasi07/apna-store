import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "../../../models/Order";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const newOrder = new Order(data);
    await newOrder.save();

    return NextResponse.json({ message: "Order saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
