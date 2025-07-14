export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

const rateLimitMap = new Map<string, { count: number; last: number }>()
const RATE_LIMIT = 5 // max 5 registrations per minute per IP
const RATE_WINDOW = 60 * 1000 // per minute

function checkRateLimit(ip: string) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.last > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  entry.last = now
  rateLimitMap.set(ip, entry)
  return false
}

export async function POST(req: NextRequest) {
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookieObj = req.cookies.get('__Host-next-auth.csrf-token');
  const csrfCookie = csrfCookieObj ? csrfCookieObj.value : undefined;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (checkRateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 })
    }
    const hashed = await hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 })
  }
} 