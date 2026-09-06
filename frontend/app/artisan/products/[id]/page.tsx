"use client"

import React, { useEffect, useState } from 'react'
import Protected from '../../../../../components/Protected'
import { useRouter } from 'next/navigation'

export default function ProductDetail({ params }: { params: { id: string }}) {
  const { id } = params
  const router = useRouter()
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`/api/products/${id}/upload-image`, { method: 'POST', credentials: 'include', body: form })
    if (res.ok) {
      const data = await res.json()
      // refresh
      const fresh = await fetch(`/api/products/${id}`)
      setProduct(await fresh.json())
    } else {
      alert('Upload failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <Protected>
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-48 mb-2" />
        ) : (<div className="mb-2 text-sm text-gray-500">No image</div>)}

        <div className="mb-4">Qty: {product.quantity} • ₹{product.selling_price}</div>

        <form onSubmit={handleUpload} className="space-y-2">
          <div>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Upload Image</button>
          </div>
        </form>

      </div>
    </Protected>
  )
}
