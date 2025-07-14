export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// POST: Generate TOTP secret and QR code
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Generate TOTP secret
  const secret = speakeasy.generateSecret({ length: 32, name: 'NaazBookDepot' });
  // Generate QR code
  const otpauth = secret.otpauth_url;
  if (!otpauth) throw new Error('Failed to generate OTP auth URL');
  const qr = await qrcode.toDataURL(otpauth);

  // Store secret temporarily in user record (not enabled yet)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaSecret: secret.base32 },
  });

  return NextResponse.json({ qr, secret: secret.base32 });
}

// PUT: Verify TOTP code and enable MFA
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { code } = await req.json();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mfaSecret: true },
  });
  if (!user?.mfaSecret) return NextResponse.json({ error: 'No MFA secret found' }, { status: 400 });
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });
  if (!verified) return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaEnabled: true },
  });
  return NextResponse.json({ success: true });
}

// DELETE: Disable MFA
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaEnabled: false, mfaSecret: null },
  });
  return NextResponse.json({ success: true });
} 