"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"

export type Address = {
  id: string;
  line1: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
};

export default function AddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [showDialog, setShowDialog] = useState(false)
  const [editAddress, setEditAddress] = useState<Address | null>(null)
  const [form, setForm] = useState<Omit<Address, 'id'>>({ line1: "", city: "", pincode: "", state: "", country: "India" })
  const { showToast } = useToast()

  const handleOpenAdd = () => {
    setEditAddress(null)
    setForm({ line1: "", city: "", pincode: "", state: "", country: "India" })
    setShowDialog(true)
  }
  const handleOpenEdit = (addr: Address) => {
    setEditAddress(addr)
    setForm({ line1: addr.line1, city: addr.city, pincode: addr.pincode, state: addr.state, country: addr.country })
    setShowDialog(true)
  }
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return
    const res = await fetch("/api/user/addresses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (res.ok) {
      showToast("Address deleted", "success")
      setAddresses(addresses.filter(a => a.id !== id))
    } else {
      showToast("Failed to delete address", "error")
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const method = editAddress ? "PUT" : "POST"
    const res = await fetch("/api/user/addresses", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editAddress ? { ...form, id: editAddress.id } : form) })
    if (res.ok) {
      showToast(editAddress ? "Address updated" : "Address added", "success")
      setShowDialog(false)
      const updated = await res.json()
      if (editAddress) {
        setAddresses(addresses.map(a => a.id === editAddress.id ? updated : a))
      } else {
        setAddresses([...addresses, updated])
      }
    } else {
      showToast("Failed to save address", "error")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <Button onClick={handleOpenAdd}>Add Address</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Your Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No addresses found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr: Address) => (
                <Card key={addr.id} className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{addr.line1}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                      <p className="text-sm text-muted-foreground">{addr.country}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(addr)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Content>
          <Dialog.Title>{editAddress ? "Edit Address" : "Add Address"}</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Address Line" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} required />
            <Input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
            <Input placeholder="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} required />
            <Input placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
            <Input placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button type="submit">{editAddress ? "Update" : "Add"}</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog>
    </div>
  )
} 