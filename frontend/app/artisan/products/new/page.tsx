"use client"

import React, { useState } from 'react'
import Protected from '../../../../components/Protected'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [material, setMaterial] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [productionCost, setProductionCost] = useState('')
  const [labourCost, setLabourCost] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/products/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          material,
          quantity,
          production_cost: productionCost ? parseFloat(productionCost) : null,
          labour_cost: labourCost ? parseFloat(labourCost) : null,
          selling_price: sellingPrice ? parseFloat(sellingPrice) : null,
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed' }))
        throw new Error(err.detail || 'Failed')
      }
      window.location.href = '/artisan/products'
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Protected>
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Category</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} className="w-full border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Material</label>
            <input value={material} onChange={e=>setMaterial(e.target.value)} className="w-full border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Quantity</label>
            <input type="number" value={quantity} onChange={e=>setQuantity(parseInt(e.target.value || '0'))} className="w-full border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm">Production cost (₹)</label>
            <input value={productionCost} onChange={e=>setProductionCost(e.target.value)} className="w-full border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Labour cost (₹)</label>
            <input value={labourCost} onChange={e=>setLabourCost(e.target.value)} className="w-full border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Selling price (₹)</label>
            <input value={sellingPrice} onChange={e=>setSellingPrice(e.target.value)} className="w-full border px-3 py-2" />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </Protected>
  )
}
