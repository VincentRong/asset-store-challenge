import Link from 'next/link'
import { Product } from '../lib/products'
import { BACKEND_API_URL } from '@/lib/constants'

export default async function Home() {
  const response = await fetch(`${BACKEND_API_URL}/products`);
  const products = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Listing</h1>
      <ul className="space-y-4">
        {products.map((product: Product) => (
          <li key={product.id} className="bg-white shadow rounded-lg p-4">
            <Link href={{
              pathname: `/products/${product.id}`,
              query: { name: product.name},
              }} 
              className="text-blue-600 hover:underline">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

