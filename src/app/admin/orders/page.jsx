"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }

  async function handleDelete(id) {
    toast(
      (t) => (
        <div className="space-y-2">
          <p>Are you sure you want to delete this order?</p>
          <div className="flex gap-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await fetch(`/api/orders/${id}`, { method: "DELETE" });
                  toast.success("Order deleted!");
                  fetchOrders();
                } catch (err) {
                  toast.error("Failed to delete order");
                }
              }}
            >
              Delete
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Toaster position="top-right" />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin")}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="border rounded p-4 bg-white shadow flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <h2 className="font-semibold text-lg">{o.productName}</h2>
                <p>Quantity: {o.quantity}</p>
                <p>Total: ${o.totalPrice}</p>
                <p className="text-sm text-gray-700">
                  Customer: {o.customer.name} | {o.customer.email} |{" "}
                  {o.customer.phone}
                </p>
                <p className="text-sm text-gray-700">
                  Address: {o.customer.address}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleDelete(o._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
