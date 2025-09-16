import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

// GET all products
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

// POST add product
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newProduct = await Product.create(body);
  return NextResponse.json(newProduct);
}
