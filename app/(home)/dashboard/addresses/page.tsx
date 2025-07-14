import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Suspense } from "react"
import AddressesClient from "./addresses-client"

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/auth/signin")
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
  if (!user) {
    redirect("/auth/signin")
  }
  const addresses = await prisma.address.findMany({ where: { userId: user.id } })
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddressesClient initialAddresses={addresses} />
    </Suspense>
  )
} 