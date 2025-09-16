"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function AdminPage() {
  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Product form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin12345") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error("Please add an image URL (e.g., /images/product1.jpg)");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products/${editId}` : "/api/products";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editId ? "Product updated" : "Product added");
        setForm({ name: "", price: "", description: "", imageUrl: "" });
        setEditId(null);
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to save product");
      console.error(err);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
    });
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  // --- Login Form ---
  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-rose-500 to-pink-600">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-rose-600">
            Admin Login
          </h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-rose-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-rose-400"
            required
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // --- Admin Panel ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {/* Header */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 py-10 text-center text-white">
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-2 text-rose-100">Manage your products with ease</p>
      </section>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Orders link */}
        <div className="flex justify-end">
          <Link
            href="/admin/orders"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            View Orders
          </Link>
        </div>

        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-400"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-400"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL (e.g., /images/product1.jpg)"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white shadow-lg rounded-xl p-4 flex flex-col transition hover:shadow-2xl hover:scale-[1.02]"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                  <p className="text-gray-600 font-medium mb-2">${p.price}</p>
                  <p className="text-gray-700 flex-grow">{p.description}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
