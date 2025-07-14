"use client";

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[var(--islamic-green)] text-white pt-8 relative">
      <div className="container mx-auto px-4 py-8">
        {/* Short footer for mobile */}
        <div className="block md:hidden text-center space-y-2">
          <div className="text-2xl font-headings font-bold">Naaz Book Depot</div>
          <div className="text-sm">Publishing the Light of Knowledge since 1967</div>
          <div className="text-xs text-[var(--islamic-gold)]">© 2024 Naaz Book Depot</div>
        </div>
        {/* Full footer for md+ */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/Images/Naaz Book Depot Logo.svg" alt="Naaz Book Depot Logo" width={36} height={36} />
              <span className="text-xl font-headings font-bold">Naaz Book Depot</span>
            </div>
            <div className="text-sm mb-3">Publishing the Light of Knowledge since 1967. Your trusted source for authentic Islamic literature, perfumes, and essentials in Kolkata, West Bengal.</div>
            <ul className="text-xs space-y-1">
              <li className="flex items-center gap-2"><span>🕌</span> Serving the Muslim community</li>
              <li className="flex items-center gap-2"><span>📚</span> Authentic Islamic literature</li>
              <li className="flex items-center gap-2"><span>🌟</span> Est. 1967 – Over 55 years of trust</li>
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Islamic Books</Link></li>
              <li className="opacity-60">Perfumes (Coming Soon)</li>
              <li className="opacity-60">Essentials (Coming Soon)</li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          {/* Book Categories */}
          <div>
            <h3 className="text-lg font-bold mb-3">Book Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>Quran & Tafseer</li>
              <li>Hadith Collections</li>
              <li>Islamic Jurisprudence</li>
              <li>Islamic History</li>
              <li>Children&apos;s Books</li>
              <li>Urdu Literature</li>
            </ul>
          </div>
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contact Us</h3>
            <div className="flex items-start gap-2 mb-2"><span>📍</span><span>1 Ismail Madan Lane, Bolai Dutta St,<br /> Kolkata, West Bengal 700073<br />India</span></div>
            <div className="flex items-center gap-2 mb-2"><span>📞</span><span>+91 98765 43210</span></div>
            <div className="flex items-center gap-2 mb-2"><span>✉️</span><span>naazgroupofficial@gmail.com</span></div>
            <div className="mt-4">
              <span className="font-semibold">Follow Us</span>
              <div className="flex gap-3 mt-2">
                <Link href="#"><Facebook className="w-6 h-6" /></Link>
                <Link href="#"><Instagram className="w-6 h-6" /></Link>
                <Link href="#"><Twitter className="w-6 h-6" /></Link>
                <Link href="#"><Youtube className="w-6 h-6" /></Link>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar (keep for all sizes) */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs gap-2 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span>© 2024 Naaz Book Depot. All rights reserved.</span>
            <span className="text-[var(--islamic-gold)]">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
          </div>
          <div className="flex gap-4">
            {/* ...social icons or other persistent items... */}
          </div>
        </div>
        {/* Floating Back-to-Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 left-4 z-50 bg-[var(--islamic-gold)] text-[var(--islamic-green)] w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--islamic-gold-dark)] transition focus:outline-none focus:ring-2 focus:ring-white md:hidden"
          aria-label="Back to top"
          style={{ left: '1rem', bottom: '1rem' }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
        </button>
        {/* Floating WhatsApp Button (mobile only) */}
        <a
          href="https://wa.me/9163431395" // Replace with your WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 z-50 bg-green-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-white md:hidden"
          aria-label="Chat on WhatsApp"
          style={{ right: '1rem', bottom: '5.5rem' }}
        >
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.05C13.41 27.633 14.686 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.334-.207-3.424-.615l-.244-.09-4.646 1.217 1.24-4.527-.16-.234C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.07-7.13c-.277-.139-1.637-.807-1.89-.899-.253-.093-.437-.139-.62.14-.184.278-.713.899-.874 1.085-.16.185-.322.208-.599.07-.277-.139-1.17-.431-2.23-1.374-.824-.735-1.38-1.642-1.543-1.92-.16-.278-.017-.428.122-.566.126-.125.278-.325.417-.487.139-.162.185-.278.278-.463.093-.185.046-.347-.023-.486-.07-.139-.62-1.497-.85-2.05-.224-.54-.453-.466-.62-.475-.16-.008-.347-.01-.534-.01-.185 0-.486.07-.74.325-.253.254-.99.97-.99 2.364 0 1.393 1.013 2.74 1.155 2.93.139.185 2.002 3.06 4.857 4.17.68.293 1.21.468 1.624.599.682.217 1.303.186 1.793.113.547-.08 1.637-.668 1.87-1.312.232-.645.232-1.197.162-1.312-.07-.116-.253-.185-.53-.324z" />
          </svg>
        </a>
      </div>
    </footer>
  )
} 