"use client"

import React, { useEffect, useState } from 'react'
import Protected from '../../../components/Protected'

type Product = {
  id: number
  name: string
  quantity: number
  selling_price?: number
  image_url?: string
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products/artisan/me', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Protected>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Products</h2>
          <a href="/artisan/products/new" className="bg-green-600 text-white px-3 py-1 rounded">Add Product</a>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (products && products.length > 0) ? (
          <ul className="space-y-3">
            {products.map(p => (
              <li key={p.id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">Qty: {p.quantity} • ₹{p.selling_price ?? '-'} • {p.status}</div>
                </div>
                <div>
                  <a href={`/artisan/products/${p.id}`} className="text-blue-600">View / Edit</a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No products yet. Click "Add Product" to create one.</div>
        )}
      </div>
    </Protected>
  )
}
