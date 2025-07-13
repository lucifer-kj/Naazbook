"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";
import { fadeInUp } from "@/lib/motion.config";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useScrollReveal } from "@/lib/useScrollReveal";

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  categoryId: string;
  stock?: number;
  rating?: number; // 0-5
}

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
  wishlistLoading?: boolean;
}

export default function ProductCard({
  product,
  showWishlist = true,
  onWishlistToggle,
  isInWishlist = false,
  wishlistLoading = false,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const [cartLoading, setCartLoading] = useState(false);
  const reduced = useReducedMotion();
  const [ref, inView] = useScrollReveal();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartLoading(true);
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/Images/Riyadh as-Salihin.jpg",
        slug: product.slug,
        stock: product.stock ?? 100,
      },
      1
    );
    setTimeout(() => setCartLoading(false), 800); // Simulate async
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Accessibility: alt text fallback
  const imageAlt = product.name ? `${product.name} product image` : "Product image";

  // Stock status
  const inStock = (product.stock ?? 1) > 0;

  // Rating stars
  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} fill={i <= Math.round(rating) ? "#facc15" : "none"} aria-hidden="true" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={reduced ? undefined : fadeInUp}
      whileHover={reduced ? undefined : { scale: 1.01, boxShadow: "0 8px 32px 0 rgba(153,41,234,0.10)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Card className="group bg-white rounded-xl shadow-md transition-all duration-300 relative overflow-hidden flex flex-col h-full hover:shadow-[0_8px_32px_0_rgba(212,168,83,0.18)]">
        {/* Wishlist Button */}
        {showWishlist && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white focus:ring-2 focus:ring-secondary w-10 h-10 md:w-12 md:h-12"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            tabIndex={0}
          >
            <Heart className={`w-6 h-6 md:w-7 md:h-7 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
        )}

        {/* Clickable Image and Title */}
        <Link href={`/products/${product.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded-t-xl">
          <div className="relative w-full aspect-[4/3] bg-[#EAE4D5] overflow-hidden flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.04, y: -6, boxShadow: "0 8px 32px 0 rgba(212,168,83,0.18)" }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full h-full"
            >
              <Image
                src={product.images[0] || "/Images/Riyadh as-Salihin.jpg"}
                alt={imageAlt}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 300px"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                priority={false}
              />
              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-gradient-to-t from-[rgba(212,168,83,0.85)] to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="mb-4 px-4 py-2 rounded-full bg-white/90 text-[var(--islamic-green)] font-semibold shadow-lg text-xs md:text-sm">
                  View Details
                </span>
              </motion.div>
            </motion.div>
          </div>
        </Link>

        <CardContent className="flex flex-col flex-1 justify-between p-3 md:p-4 min-h-[120px] md:min-h-[140px]">
          {/* Product Name - Clickable */}
          <Link href={`/products/${product.slug}`} tabIndex={0} className="block focus:outline-none focus:ring-2 focus:ring-secondary rounded">
            <CardTitle className="text-sm md:text-lg font-bold mb-1 text-gray-900 group-hover:text-secondary transition-colors line-clamp-2 text-left">
              <span title={product.name}>{product.name}</span>
            </CardTitle>
          </Link>

          {/* Rating and Stock */}
          <div className="flex items-center justify-between mb-1">
            {renderStars(product.rating)}
            <span className={`text-xs font-semibold ml-2 ${inStock ? "text-green-600" : "text-red-500"}`}>{inStock ? "In Stock" : "Out of Stock"}</span>
          </div>

          {/* Price */}
          <div className="text-secondary font-bold text-base md:text-lg mb-2 text-left">
            {formatPrice(product.price)}
          </div>

          {/* Add to Cart Button */}
          <div className="w-full mt-auto">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 md:py-2.5 text-sm md:text-base transition-all duration-200 flex items-center justify-center"
              disabled={!inStock || cartLoading}
              aria-disabled={!inStock || cartLoading}
              aria-label={inStock ? "Add to cart" : "Out of stock"}
              tabIndex={0}
            >
              {cartLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-label="Loading" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              {inStock ? (cartLoading ? "Adding..." : "Add to Cart") : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 