import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// GET: fetch user's cart
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true }
  })
  // Always return a consistent shape
  if (!cart) {
    // Use null for date fields if cart not found
    return NextResponse.json({
      id: '',
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      userId: session.user.id,
      items: []
    })
  }
  return NextResponse.json(cart)
}

// POST: replace user's cart with provided items
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { items } = await req.json() // [{ productId, quantity }]
  if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid items" }, { status: 400 })
  // Upsert cart
  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id }
  })
  // Delete old items
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  // Add new items
  for (const item of items) {
    if (item.productId && item.quantity > 0) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity
        }
      })
    }
  }
  const foundCart = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: true } })
  if (!foundCart) {
    return NextResponse.json({
      id: '',
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      userId: session.user.id,
      items: []
    })
  }
  return NextResponse.json(foundCart)
}

// PATCH: merge provided items into user's cart
export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { items } = await req.json() // [{ productId, quantity }]
  if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid items" }, { status: 400 })
  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id }
  })
  for (const item of items) {
    if (item.productId && item.quantity > 0) {
      const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId: item.productId } } })
      if (existing) {
        await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: item.quantity } })
      } else {
        await prisma.cartItem.create({ data: { cartId: cart.id, productId: item.productId, quantity: item.quantity } })
      }
    }
  }
  const foundCart = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: true } })
  if (!foundCart) {
    return NextResponse.json({
      id: '',
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      userId: session.user.id,
      items: []
    })
  }
  return NextResponse.json(foundCart)
}

// DELETE: clear user's cart
export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }
  return NextResponse.json({ success: true })
} 