export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const rateLimitMap = new Map<string, { count: number; last: number }>()
const RATE_LIMIT = 5 // max 5 reviews per minute
const RATE_WINDOW = 60 * 1000 // per minute

function checkRateLimit(userId: string) {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now - entry.last > RATE_WINDOW) {
    rateLimitMap.set(userId, { count: 1, last: now })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  entry.last = now
  rateLimitMap.set(userId, entry)
  return false
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookieObj = req.cookies.get('__Host-next-auth.csrf-token');
  const csrfCookie = csrfCookieObj ? csrfCookieObj.value : undefined;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (checkRateLimit(session.user.id)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { slug } = await params;
    const { rating, title, comment } = await req.json();

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    if (!title?.trim() || title.length > 100) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (!comment?.trim() || comment.length > 500) {
      return NextResponse.json({ error: 'Invalid comment' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
} 