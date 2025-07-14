import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  console.log('Creating users...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naazbookdepot.com' },
    update: {},
    create: {
      email: 'admin@naazbookdepot.com',
      name: 'Admin User',
      password: await hash('admin123', 12),
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@naazbookdepot.com' },
    update: {},
    create: {
      email: 'customer@naazbookdepot.com',
      name: 'John Customer',
      password: await hash('customer123', 12),
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // Create categories
  console.log('Creating categories...')
  const quranCategory = await prisma.category.upsert({
    where: { slug: 'quran-tafseer' },
    update: {},
    create: {
      name: 'Quran & Tafseer',
      description: 'Authentic Qurans and comprehensive Tafseer collections',
      slug: 'quran-tafseer',
      image: '/Images/Tafseer Ibn Kathir.jpg',
      isActive: true,
    },
  })

  const hadithCategory = await prisma.category.upsert({
    where: { slug: 'hadith' },
    update: {},
    create: {
      name: 'Hadith Collections',
      description: 'Classical and contemporary collections of Hadith',
      slug: 'hadith',
      image: '/Images/Sahih Al-Bukhari.jpg',
      isActive: true,
    },
  })

  const fiqhCategory = await prisma.category.upsert({
    where: { slug: 'fiqh' },
    update: {},
    create: {
      name: 'Islamic Jurisprudence',
      description: 'Books on Islamic law and jurisprudence (Fiqh)',
      slug: 'fiqh',
      image: '/Images/Riyadh as-Salihin.jpg',
      isActive: true,
    },
  })

  // Create Perfume & Ittar category
  const perfumeCategory = await prisma.category.upsert({
    where: { slug: 'perfume-ittar' },
    update: {},
    create: {
      name: 'Perfume & Ittar',
      description: 'A curated collection of authentic perfumes and ittars.',
      slug: 'perfume-ittar',
      image: '/Images/ittars.jpeg',
      isActive: true,
    },
  });

  // Create Rehal category
  const rehalCategory = await prisma.category.upsert({
    where: { slug: 'rehal' },
    update: {},
    create: {
      name: 'Rehal',
      description: 'Beautifully crafted rehal (Quran stands) for your home and masjid.',
      slug: 'rehal',
      image: '/Images/Rehals.jpeg',
      isActive: true,
    },
  });

  console.log('✅ Categories created')

  // Create products for Quran & Tafseer category
  console.log('Creating Quran & Tafseer books...')
  const quranProducts = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'QURAN-001' },
      update: {},
      create: {
        name: 'Tafseer Ibn Kathir',
        description: 'A renowned and comprehensive commentary on the Quran by Ibn Kathir.',
        price: 49.99,
        comparePrice: 59.99,
        images: ['/Images/Tafseer Ibn Kathir.jpg'],
        sku: 'QURAN-001',
        barcode: '9789383226395',
        weight: 1200.00,
        dimensions: '24x16x6 cm',
        stock: 20,
        isActive: true,
        isFeatured: true,
        slug: 'tafseer-ibn-kathir',
        categoryId: quranCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'QURAN-002' },
      update: {},
      create: {
        name: 'The Noble Quran',
        description: 'A clear and accurate English translation of the Quran with commentary.',
        price: 29.99,
        comparePrice: 39.99,
        images: ['/Images/About Naaz Book Depot.jpg'],
        sku: 'QURAN-002',
        barcode: '9789960740796',
        weight: 900.00,
        dimensions: '22x15x4 cm',
        stock: 30,
        isActive: true,
        isFeatured: false,
        slug: 'the-noble-quran',
        categoryId: quranCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'QURAN-003' },
      update: {},
      create: {
        name: 'Quran (Arabic)',
        description: 'The Holy Quran in Arabic script, Uthmani print.',
        price: 19.99,
        comparePrice: 24.99,
        images: ['/Images/Image+Background.jpg'],
        sku: 'QURAN-003',
        barcode: '9788172315629',
        weight: 700.00,
        dimensions: '20x14x3 cm',
        stock: 40,
        isActive: true,
        isFeatured: false,
        slug: 'quran-arabic',
        categoryId: quranCategory.id,
      },
    }),
  ])

  // Create products for Hadith category
  console.log('Creating Hadith books...')
  const hadithProducts = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'HADITH-001' },
      update: {},
      create: {
        name: 'Sahih Al-Bukhari',
        description: 'The most authentic collection of Hadith compiled by Imam Bukhari.',
        price: 59.99,
        comparePrice: 69.99,
        images: ['/Images/Sahih Al-Bukhari.jpg'],
        sku: 'HADITH-001',
        barcode: '9788172315628',
        weight: 1500.00,
        dimensions: '25x17x7 cm',
        stock: 15,
        isActive: true,
        isFeatured: true,
        slug: 'sahih-al-bukhari',
        categoryId: hadithCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'HADITH-002' },
      update: {},
      create: {
        name: 'Riyadh as-Salihin',
        description: 'A famous collection of authentic Hadith compiled by Imam Nawawi.',
        price: 34.99,
        comparePrice: 44.99,
        images: ['/Images/Riyadh as-Salihin.jpg'],
        sku: 'HADITH-002',
        barcode: '9788172315630',
        weight: 1000.00,
        dimensions: '22x15x5 cm',
        stock: 25,
        isActive: true,
        isFeatured: false,
        slug: 'riyadh-as-salihin',
        categoryId: hadithCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'HADITH-003' },
      update: {},
      create: {
        name: 'Forty Hadith Qudsi',
        description: 'A collection of 40 sacred Hadith Qudsi with English translation.',
        price: 14.99,
        comparePrice: 19.99,
        images: ['/Images/About Naaz Book Depot.jpg'],
        sku: 'HADITH-003',
        barcode: '9788172315631',
        weight: 400.00,
        dimensions: '18x12x2 cm',
        stock: 35,
        isActive: true,
        isFeatured: false,
        slug: 'forty-hadith-qudsi',
        categoryId: hadithCategory.id,
      },
    }),
  ])

  // Create products for Fiqh category
  console.log('Creating Fiqh books...')
  const fiqhProducts = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'FIQH-001' },
      update: {},
      create: {
        name: 'Fiqh-us-Sunnah',
        description: 'A comprehensive manual of Islamic jurisprudence by Sayyid Sabiq.',
        price: 44.99,
        comparePrice: 54.99,
        images: ['/Images/About Naaz Book Depot.jpg'],
        sku: 'FIQH-001',
        barcode: '9788172315632',
        weight: 1100.00,
        dimensions: '23x15x5 cm',
        stock: 18,
        isActive: true,
        isFeatured: true,
        slug: 'fiqh-us-sunnah',
        categoryId: fiqhCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'FIQH-002' },
      update: {},
      create: {
        name: 'Bulugh al-Maram',
        description: 'A classic collection of hadiths related to Islamic jurisprudence by Ibn Hajar al-Asqalani.',
        price: 24.99,
        comparePrice: 29.99,
        images: ['/Images/About Naaz Book Depot.jpg'],
        sku: 'FIQH-002',
        barcode: '9788172315633',
        weight: 800.00,
        dimensions: '21x14x4 cm',
        stock: 22,
        isActive: true,
        isFeatured: false,
        slug: 'bulugh-al-maram',
        categoryId: fiqhCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'FIQH-003' },
      update: {},
      create: {
        name: 'Al-Muwatta',
        description: 'The earliest written collection of hadith comprising the subjects of Islamic law by Imam Malik.',
        price: 29.99,
        comparePrice: 34.99,
        images: ['/Images/About Naaz Book Depot.jpg'],
        sku: 'FIQH-003',
        barcode: '9788172315634',
        weight: 900.00,
        dimensions: '20x13x3 cm',
        stock: 20,
        isActive: true,
        isFeatured: false,
        slug: 'al-muwatta',
        categoryId: fiqhCategory.id,
      },
    }),
  ])

  // Create products for Perfume & Ittar
  console.log('Creating Perfume & Ittar products...');
  const perfumeProducts = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PERFUME-001' },
      update: {},
      create: {
        name: 'Classic Attar',
        description: 'Traditional attar with a long-lasting fragrance.',
        price: 15.99,
        comparePrice: 19.99,
        images: ['/Images/ittars.jpeg'],
        sku: 'PERFUME-001',
        stock: 50,
        isActive: true,
        isFeatured: true,
        slug: 'classic-attar',
        categoryId: perfumeCategory.id,
        subCategory: 'attar',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PERFUME-002' },
      update: {},
      create: {
        name: 'Rose Spray Perfume',
        description: 'Refreshing rose spray perfume for daily use.',
        price: 12.99,
        comparePrice: 16.99,
        images: ['/Images/ittars.jpeg'],
        sku: 'PERFUME-002',
        stock: 40,
        isActive: true,
        isFeatured: false,
        slug: 'rose-spray-perfume',
        categoryId: perfumeCategory.id,
        subCategory: 'spray',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PERFUME-003' },
      update: {},
      create: {
        name: 'Musk Perfume Oil',
        description: 'Pure musk oil for a subtle, elegant scent.',
        price: 18.99,
        comparePrice: 22.99,
        images: ['/Images/ittars.jpeg'],
        sku: 'PERFUME-003',
        stock: 30,
        isActive: true,
        isFeatured: false,
        slug: 'musk-perfume-oil',
        categoryId: perfumeCategory.id,
        subCategory: 'oil',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PERFUME-004' },
      update: {},
      create: {
        name: 'Combo Perfume Pack',
        description: 'A combo pack of our best-selling perfumes.',
        price: 29.99,
        comparePrice: 39.99,
        images: ['/Images/ittars.jpeg'],
        sku: 'PERFUME-004',
        stock: 20,
        isActive: true,
        isFeatured: false,
        slug: 'combo-perfume-pack',
        categoryId: perfumeCategory.id,
        subCategory: 'combo',
      },
    }),
  ]);

  // Create products for Rehal
  console.log('Creating Rehal products...');
  const rehalProducts = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'REHAL-001' },
      update: {},
      create: {
        name: 'Wooden Rehal',
        description: 'Handcrafted wooden rehal for Quran.',
        price: 24.99,
        comparePrice: 29.99,
        images: ['/Images/Rehals.jpeg'],
        sku: 'REHAL-001',
        stock: 15,
        isActive: true,
        isFeatured: true,
        slug: 'wooden-rehal',
        categoryId: rehalCategory.id,
        subCategory: 'wooden',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'REHAL-002' },
      update: {},
      create: {
        name: 'Plastic Rehal',
        description: 'Durable plastic rehal, lightweight and portable.',
        price: 14.99,
        comparePrice: 19.99,
        images: ['/Images/Rehals.jpeg'],
        sku: 'REHAL-002',
        stock: 25,
        isActive: true,
        isFeatured: false,
        slug: 'plastic-rehal',
        categoryId: rehalCategory.id,
        subCategory: 'plastic',
      },
    }),
  ]);

  console.log('✅ Products created')

  // Create sample reviews
  console.log('Creating sample reviews...')
  const allProducts = [...quranProducts, ...hadithProducts, ...fiqhProducts, ...perfumeProducts, ...rehalProducts]
  for (const product of allProducts) {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: customerUser.id,
          productId: product.id,
        },
      },
      update: {},
      create: {
        userId: customerUser.id,
        productId: product.id,
        rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
        title: `Excellent read: ${product.name}`,
        comment: `This book, ${product.name}, is a must-have for every home library. Highly recommended!`,
        isVerified: true,
      },
    })
  }

  console.log('✅ Reviews created')

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${2} users (admin + customer)`)
  console.log(`   - ${3} categories (Quran & Tafseer, Hadith Collections, Islamic Jurisprudence)`)
  console.log(`   - ${9} products (3 per category)`)
  console.log(`   - ${9} reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
