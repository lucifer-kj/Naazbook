import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/product-card';

// Next.js 14+ dynamic route typing
// See project rules for correct usage
type tParams = Promise<{ slug: string }>
interface PageProps {
  params: tParams
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Map slugs to display names for Naaz Book Depot
  const categoryMap: Record<string, string> = {
    'quran-tafseer': 'Quran & Tafseer',
    'hadith': 'Hadith Collections',
    'fiqh': 'Islamic Jurisprudence',
    'history': 'Islamic History',
    'children': "Children's Books",
    'urdu': 'Urdu Literature',
  };
  const categoryName = categoryMap[slug];
  if (!categoryName) return notFound();

  // Fetch category and products
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
      },
    },
  });
  if (!category) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--islamic-green)] mb-4">{category.name}</h1>
      <p className="text-lg text-[var(--charcoal)]/80 mb-8">{category.description}</p>
      {category.products.length === 0 ? (
        <div className="text-center text-[var(--charcoal)]/60 py-12">No books found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.products.map(product => (
            <ProductCard key={product.id} product={{
              ...product,
              price: Number(product.price),
              ...(product.comparePrice && { comparePrice: Number(product.comparePrice) })
            }} />
          ))}
        </div>
      )}
    </div>
  );
} 