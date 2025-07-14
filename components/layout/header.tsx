// 'use client' must be first
"use client";

import Link from "next/link";
import {ShoppingCart, User as UserIcon, LogOut, Settings, Menu, X, ChevronDown} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { getCount } = useCartStore();
  const cartCount = getCount();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Mouse leave for both button and menu
  const handleMouseLeave = () => {
    setTimeout(() => {
      const button = buttonRef.current;
      const menu = menuRef.current;
      const active = document.activeElement;
      if (
        button && !button.contains(active) &&
        menu && !menu.matches(":hover")
      ) {
        setProductsOpen(false);
      }
    }, 80);
  };

  // Blur handler for button
  const handleBlur = () => {
    setTimeout(() => {
      const button = buttonRef.current;
      const menu = menuRef.current;
      const active = document.activeElement;
      if (
        button && !button.contains(active) &&
        menu && !menu.matches(":hover")
      ) {
        setProductsOpen(false);
      }
    }, 80);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const productCategories = [
    { href: "/categories/quraan", label: "Quran & Tafseer" },
    { href: "/categories/hadith", label: "Hadith Collections" },
    { href: "/categories/jurisprudence", label: "Islamic Jurisprudence" },
    { href: "/categories/history", label: "Islamic History" },
    { href: "/categories/children", label: "Children's Books" },
    { href: "/categories/urdu", label: "Urdu Literature" },
  ];

  return (
    <>
      <motion.header
        className="bg-[#F8F6F3] sticky top-0 z-50 transition-shadow border-b border-[var(--islamic-green)]/10"
        initial={false}
        animate={{ boxShadow: "0 0px 0px 0 rgba(0,0,0,0)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="container mx-auto px-4 flex items-center h-20 md:h-24 sm:py-2 justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 md:gap-4">
            <Image src="/Images/Naaz Book Depot Logo.svg" alt="Naaz Book Depot Logo" width={64} height={64} className="h-16 w-16 md:h-12 md:w-12" />
            {/* Mobile: stacked, Desktop: single line */}
            <div className="flex flex-col leading-tight md:hidden justify-center">
              <span className="text-xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Naaz</span>
              <span className="text-xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Book</span>
              <span className="text-xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Depot</span>
            </div>
            {/* Desktop: original stacked style restored */}
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-3xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Naaz</span>
              <span className="text-3xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Book</span>
              <span className="text-3xl font-headings font-bold text-[var(--islamic-green)] leading-none transition">Depot</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 mx-8">
            <Link href="/" className="nav-link">Home</Link>
            <div className="relative" onMouseLeave={handleMouseLeave}>
              <button
                ref={buttonRef}
                className="nav-link flex items-center gap-1 focus:outline-none"
                onMouseEnter={() => setProductsOpen(true)}
                onFocus={() => setProductsOpen(true)}
                onBlur={handleBlur}
                aria-haspopup="true"
                aria-expanded={productsOpen}
              >
                Products <ChevronDown className="w-4 h-4" />
              </button>
              <div
                ref={menuRef}
                className={`absolute left-0 top-full mt-2 bg-white border border-[var(--islamic-green)]/20 rounded-lg shadow-lg transition z-20 min-w-[180px] ${productsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={handleMouseLeave}
                tabIndex={-1}
              >
                <ul className="py-2">
                  {productCategories.map((category) => (
                    <li key={category.href}>
                      <Link href={category.href} className="block px-4 py-2 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10">
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search icon for md+ */}
            <button className="hidden md:inline p-2 text-[var(--islamic-green)] hover:text-[var(--islamic-gold)]" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            {/* Profile Icon (always visible) */}
            <Link href="/auth/signin" className="p-2 text-[var(--islamic-green)] hover:text-[var(--islamic-gold)]">
              <UserIcon className="w-6 h-6 md:w-7 md:h-7" />
            </Link>
            {/* Cart Icon (always visible) */}
            <Link href="/cart" className="relative p-2 text-[var(--islamic-green)] hover:text-[var(--islamic-gold)]">
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--islamic-gold)] text-[var(--islamic-green)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Mobile Menu Button (mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--islamic-green)] hover:text-[var(--islamic-gold)]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-[var(--islamic-green)]/10 mobile-menu"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-3 px-4 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Products Dropdown */}
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="w-full flex items-center justify-between py-3 px-4 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                    >
                      <span>Products</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 space-y-1"
                        >
                          {productCategories.map((category) => (
                            <Link
                              key={category.href}
                              href={category.href}
                              className="block py-2 px-4 text-sm text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileProductsOpen(false);
                              }}
                            >
                              {category.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile User Menu */}
                  <div className="border-t border-gray-100 pt-2">
                    {session ? (
                      <div className="space-y-2">
                        <div className="px-4 py-2">
                          <p className="font-medium text-[var(--islamic-green)]">{session.user?.name || "User"}</p>
                          <p className="text-sm text-gray-500">{session.user?.email || ""}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 py-3 px-4 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <UserIcon className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-2 py-3 px-4 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/signin"
                        className="flex items-center gap-2 py-3 px-4 text-[var(--islamic-green)] hover:bg-[var(--islamic-gold)]/10 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        Sign In
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Contact Banner - Ticker for small screens */}
      <div className="block md:hidden w-full bg-[var(--islamic-green)] text-white text-xs font-medium px-4 py-2 overflow-hidden">
        <span className="ticker-marquee">
          📞 033 22350051 &nbsp;|&nbsp; 📞 033 22350960 &nbsp;|&nbsp; 📱 +91 91634 31395 &nbsp;|&nbsp; ✉️ naazgroupofficial@gmail.com &nbsp;|&nbsp; 📍 Visit us in Kolkata, West Bengal
        </span>
        </div>
      {/* Original Banner for md+ */}
      <div className="hidden md:block w-full bg-[var(--islamic-green)] text-white text-sm font-medium text-center lg:justify-center lg:text-center px-8 py-2">
        <span>
          📞 033 22350051 &nbsp;|&nbsp; 📞 033 22350960 &nbsp;|&nbsp; 📱 +91 91634 31395 &nbsp;|&nbsp; ✉️ naazgroupofficial@gmail.com &nbsp;|&nbsp; 📍 Visit us in Kolkata, West Bengal
        </span>
      </div>
    </>
  );
} 