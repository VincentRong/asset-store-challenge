import { BACKEND_API_URL } from '@/lib/constants';
import { Product } from '../../../lib/products'
import Link from 'next/link'

export default async function ProductPage({ params, searchParams  }: { params: { id: string }, searchParams: { name: string} }) {
  const { id } = await params;

  const { name }  = await searchParams;

  const response = await fetch(`${BACKEND_API_URL}/products/${id}`);
  const product: Product = await response.json();

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <p className="text-xl mb-6">Price: ${product.price}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Back to product listing
      </Link>
    </div>
  )
}

