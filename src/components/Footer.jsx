"use client";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Apna Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
