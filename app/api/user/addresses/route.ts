export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 200 })
  const addresses = await prisma.address.findMany({ where: { userId: session.user.id } })
  return NextResponse.json(addresses)
}

export async function POST(req: NextRequest) {
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookieObj = req.cookies.get('__Host-next-auth.csrf-token');
  const csrfCookie = csrfCookieObj ? csrfCookieObj.value : undefined;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (checkRateLimit(session.user.id)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  const data = await req.json()
  const address = await prisma.address.create({
    data: { ...data, userId: session.user.id }
  })
  return NextResponse.json(address)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (checkRateLimit(session.user.id)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  const data = await req.json()
  if (!data.id) return NextResponse.json({ error: "Address ID required" }, { status: 400 })
  const result = await prisma.address.updateMany({
    where: { id: data.id, userId: session.user.id },
    data: { ...data }
  })
  if (result.count === 0) return NextResponse.json({ error: "Address not found or not yours" }, { status: 404 })
  const address = await prisma.address.findUnique({ where: { id: data.id } })
  return NextResponse.json(address)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (checkRateLimit(session.user.id)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Address ID required" }, { status: 400 })
  const result = await prisma.address.deleteMany({ where: { id, userId: session.user.id } })
  if (result.count === 0) return NextResponse.json({ error: "Address not found or not yours" }, { status: 404 })
  return NextResponse.json({ success: true })
} 