import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { cookies } from 'next/headers';
import { parse } from 'url';

// Next.js 14+ dynamic route typing
// See project rules for correct usage
type tParams = Promise<{ slug: string }>
interface PageProps {
  params: tParams
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Parse sub-category from query param (SSR workaround)
  const cookieStore = await cookies();
  const searchParams = parse(cookieStore.get('next-url')?.value || '', true).query;
  const selectedSub = typeof searchParams.sub === 'string' ? searchParams.sub : null;

  // Sub-categories for each main category
  const booksSubCategories = [
    { key: 'quran-tafseer', label: 'Quran & Tafseer' },
    { key: 'hadith', label: 'Hadith Collections' },
    { key: 'fiqh', label: 'Islamic Jurisprudence' },
    { key: 'history', label: 'Islamic History' },
    { key: 'children', label: "Children's Books" },
    { key: 'urdu', label: 'Urdu Literature' },
  ];
  const perfumeSubCategories = [
    { key: 'attar', label: 'Attar' },
    { key: 'spray', label: 'Spray Perfume' },
    { key: 'oil', label: 'Perfume Oil' },
    { key: 'combo', label: 'Combo Packs' },
  ];
  const rehalSubCategories = [
    { key: 'wooden', label: 'Wooden' },
    { key: 'plastic', label: 'Plastic' },
  ];

  // Map slugs to display names for Naaz Book Depot
  const categoryMap: Record<string, { name: string; subCategories?: { key: string; label: string }[] }> = {
    'quran-tafseer': { name: 'Quran & Tafseer', subCategories: booksSubCategories },
    'hadith': { name: 'Hadith Collections', subCategories: booksSubCategories },
    'fiqh': { name: 'Islamic Jurisprudence', subCategories: booksSubCategories },
    'history': { name: 'Islamic History', subCategories: booksSubCategories },
    'children': { name: "Children's Books", subCategories: booksSubCategories },
    'urdu': { name: 'Urdu Literature', subCategories: booksSubCategories },
    'perfume-ittar': { name: 'Perfume & Ittar', subCategories: perfumeSubCategories },
    'rehal': { name: 'Rehal', subCategories: rehalSubCategories },
  };
  const categoryInfo = categoryMap[slug];
  if (!categoryInfo) return notFound();

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

  // Filter products by sub-category if present
  let filteredProducts = category.products;
  if (slug === 'perfume-ittar' && selectedSub) {
    filteredProducts = filteredProducts.filter(p => p.subCategory === selectedSub);
  } else if (slug === 'rehal' && selectedSub) {
    filteredProducts = filteredProducts.filter(p => p.subCategory === selectedSub);
  } else if (categoryInfo.subCategories && selectedSub) {
    filteredProducts = filteredProducts.filter(p => p.subCategory === selectedSub);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--islamic-green)] mb-4">{category.name}</h1>
      <p className="text-lg text-[var(--charcoal)]/80 mb-8">{category.description}</p>
      {/* Sub-category tabs */}
      {categoryInfo.subCategories && (
        <div className="flex gap-3 mb-8 flex-wrap">
          {categoryInfo.subCategories.map(sub => (
            <a
              key={sub.key}
              href={`?sub=${sub.key}`}
              className={`px-4 py-2 rounded-full border border-[var(--islamic-green)] text-[var(--islamic-green)] font-semibold hover:bg-[var(--islamic-gold)]/10 transition ${selectedSub === sub.key ? 'bg-[var(--islamic-gold)]/10 border-[var(--islamic-gold)]' : ''}`}
            >
              {sub.label}
            </a>
          ))}
        </div>
      )}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-[var(--charcoal)]/60 py-12">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
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