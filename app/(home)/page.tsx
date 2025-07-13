"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NewsletterSection from "@/components/newsletter-section";
import { motion } from "framer-motion";

const HERO_BG = "/Images/Image+Background.jpg";

// Remove featuredBooks array

const LEGACY_IMAGE = "/Images/About Naaz Book Depot.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header and contact bar handled in layout/header.tsx */}

      {/* Hero Section */}
      <section className="relative min-h-[520px] flex items-center bg-[var(--islamic-green)] overflow-hidden">
        <span className="islamic-pattern" aria-hidden="true" />
        <span className="absolute inset-0 bg-gradient-to-br from-[var(--islamic-green)]/90 via-[var(--islamic-green-light)]/80 to-[var(--islamic-gold)]/40 z-0" aria-hidden="true" />
        <Image
          src={HERO_BG}
          alt="Naaz Book Depot Hero Background"
          fill
          priority
          className="object-cover object-center w-full h-full absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-[var(--islamic-green)]/80" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between py-16 gap-8">
          {/* Left: Main Content */}
          <div className="max-w-2xl sm:text-left text-center flex-1">
            <h1 className="text-5xl sm:text-6xl font-headings font-bold text-white mb-4 drop-shadow-lg">
              Naaz Book Depot
            </h1>
            <p className="italic text-xl md:text-2xl text-[var(--islamic-gold)] mb-4 font-serif">
              &quot;Publishing the Light of Knowledge since 1967&quot;
            </p>
            <p className="text-lg md:text-2xl text-white mb-8 max-w-xl">
              A pioneering publishing company since 1967, specializing in authentic Islamic literature and the Qur&apos;an in multiple languages, serving the global Muslim community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button className="btn-islamic bg-[var(--islamic-gold)] text-[var(--islamic-green)] font-bold px-8 py-3 text-lg shadow-md hover:bg-[var(--islamic-gold-dark)] sm:w-auto w-full">
                  Discover Our Legacy
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-2 border-[var(--islamic-gold)] text-white font-bold px-8 py-3 text-lg hover:bg-[var(--islamic-gold)] hover:text-[var(--islamic-green)] sm:w-auto w-full">
                  Explore Books
                </Button>
              </Link>
            </div>
          </div>
          {/* Right: Quranic Verse Block */}
          <div className="flex-1 flex justify-end w-full max-w-md hidden md:flex">
            <motion.div
              className="glass-card p-8 rounded-2xl shadow-lg w-full max-w-md text-right border-2 border-[var(--islamic-gold)]"
              style={{ boxShadow: '0 4px 32px 0 rgba(212,168,83,0.10)', backgroundColor: 'rgba(248,246,243,0.7)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 60 }}
            >
              <div className="text-arabic text-xl md:text-2xl mb-4 leading-loose">
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ<br />
                خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ<br />
                اقْرَأْ وَرَبُّكَ الْأَكْرَمُ<br />
                الَّذِي عَلَّمَ بِالْقَلَمِ<br />
                عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ
              </div>
              <div className="text-[var(--charcoal)] text-sm md:text-base italic mb-2">
                &quot;Read in the name of your Lord who created—<br />
                Created man from a clot. Read, and your Lord is the Most Generous— Who taught by the pen—<br />
                — Taught man that which he knew not.&quot;
              </div>
              <div className="text-[var(--islamic-gold)] text-xs md:text-sm font-semibold mt-2">
                (Surah Al-&apos;Alaq, 96:1-5)
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Islamic Books Section */}
      <section className="bg-[#F8F6F3] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-headings font-bold text-[var(--islamic-green)] text-center mb-4">Shop by Category</h2>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-20 bg-[var(--islamic-gold)] rounded" />
          </div>
          <p className="text-lg text-center text-[var(--charcoal)]/70 mb-12 max-w-2xl mx-auto">
            Explore our curated categories for all your needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Books Category */}
            <Link href="/categories/books" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:shadow-xl m-2 focus:outline-none focus:ring-2 focus:ring-[var(--islamic-gold)]">
              <div className="w-full flex justify-center mb-8">
                <Image src="/Images/Sahih Al-Bukhari.jpg" alt="Books" width={180} height={240} className="rounded-lg object-contain shadow group-hover:scale-105 transition" style={{ width: '100%', height: 'auto' }} />
              </div>
              <h3 className="text-lg font-headings font-bold mb-1 text-[var(--islamic-green)]">Books</h3>
              <div className="text-[var(--charcoal)]/70 mb-2 text-sm">Authentic Islamic literature and Qur'an in multiple languages</div>
            </Link>
            {/* Perfumes Category */}
            <Link href="/categories/perfumes" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:shadow-xl m-2 focus:outline-none focus:ring-2 focus:ring-[var(--islamic-gold)]">
              <div className="w-full flex justify-center mb-8">
                <Image src="/Images/perfume.jpg" alt="Perfumes" width={180} height={180} className="rounded-lg object-contain shadow group-hover:scale-105 transition" style={{ width: '100%', height: 'auto' }} />
              </div>
              <h3 className="text-lg font-headings font-bold mb-1 text-[var(--islamic-green)]">Perfumes</h3>
              <div className="text-[var(--charcoal)]/70 mb-2 text-sm">Premium attar and fragrances for every occasion</div>
            </Link>
            {/* Rehal Category */}
            <Link href="/categories/rehal" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:shadow-xl m-2 focus:outline-none focus:ring-2 focus:ring-[var(--islamic-gold)]">
              <div className="w-full flex justify-center mb-8">
                <Image src="/Images/rehal.jpg" alt="Rehal (Quran Stand)" width={180} height={180} className="rounded-lg object-contain shadow group-hover:scale-105 transition" style={{ width: '100%', height: 'auto' }} />
              </div>
              <h3 className="text-lg font-headings font-bold mb-1 text-[var(--islamic-green)]">Rehal (Quran Stand)</h3>
              <div className="text-[var(--charcoal)]/70 mb-2 text-sm">Beautifully crafted stands for the Holy Qur'an</div>
            </Link>
          </div>
        </div>
      </section>

      {/* About/Legacy Section */}
      <section className="bg-[#F8F6F3] py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center max-w-5xl mx-auto">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-headings font-bold text-[var(--islamic-green)] mb-4">A Legacy of Knowledge<br />Since 1967</h2>
            <div className="h-1 w-20 bg-[var(--islamic-gold)] rounded mb-6" />
            <p className="text-lg text-[var(--charcoal)]/90 mb-6 max-w-xl">
              Founded in the heart of Kolkata, Naaz Book Depot has been a beacon of Islamic knowledge for over five decades. Our journey began with a simple mission: to make authentic Islamic literature accessible to every seeker of knowledge.
            </p>
            <p className="text-lg text-[var(--charcoal)]/90 mb-8 max-w-xl">
              Today, we continue this tradition by expanding our offerings while maintaining our commitment to authenticity and quality in Islamic education.
            </p>
            <Link href="/about">
              <Button className="bg-[var(--islamic-gold)] text-[var(--islamic-green)] font-bold px-5 py-2 text-base shadow-md hover:bg-[var(--islamic-gold-dark)]">
                Learn More About Us
              </Button>
            </Link>
          </div>
          {/* Right: Image and Caption */}
          <div className="flex flex-col items-center"> 
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg mb-4 ml-10">
              <Image
                src={LEGACY_IMAGE}
                alt="Naaz Book Depot Founder"
                width={480}
                height={360}
                className="object-cover w-full h-full"
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="text-center text-[var(--islamic-green)] font-medium text-lg">Mohammad Irfan</div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
} 