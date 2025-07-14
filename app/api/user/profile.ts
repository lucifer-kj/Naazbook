export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { hash, compare } from "bcryptjs"

const rateLimitMap = new Map<string, { count: number; last: number }>()
const RATE_LIMIT = 10 // max 10 requests
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

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (checkRateLimit(session.user.id)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  const { name, email, password, newPassword } = await req.json()
  
  interface UserUpdates {
    name?: string;
    email?: string; 
    password?: string;
  }

  const updates: UserUpdates = {}
  if (name) updates.name = name
  if (email) updates.email = email
  // If changing password, require current password and newPassword
  if (password && newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user?.password) return NextResponse.json({ error: "No password set" }, { status: 400 })
    const valid = await compare(password, user.password)
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 })
    updates.password = await hash(newPassword, 10)
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 })
  }
  try {
    const updated = await prisma.user.update({ where: { id: session.user.id }, data: updates })
    return NextResponse.json({ success: true, user: { id: updated.id, name: updated.name, email: updated.email } })
  } catch (e: unknown) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (checkRateLimit(session.user.id)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  try {
    // Delete related data first (cart, addresses, wishlist, reviews, etc.)
    await prisma.cart.deleteMany({ where: { userId: session.user.id } })
    await prisma.address.deleteMany({ where: { userId: session.user.id } })
    await prisma.wishlist.deleteMany({ where: { userId: session.user.id } })
    await prisma.review.deleteMany({ where: { userId: session.user.id } })
    await prisma.order.deleteMany({ where: { userId: session.user.id } })
    // Delete user
    await prisma.user.delete({ where: { id: session.user.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
} 