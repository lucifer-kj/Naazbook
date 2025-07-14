"use client"

import { User, Mail, Calendar, Edit } from "lucide-react"
import { GlassCard, GlassButton, GlassPanel } from "@/components/ui/glass-card"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

interface ProfileClientProps {
  user: {
    id: string
    name: string
    email: string
    image: string
    memberSince: string
  }
  stats: {
    ordersCount: number
    addressesCount: number
    wishlistCount: number
  }
}

export default function ProfileClient({ user, stats }: ProfileClientProps) {
  // Defensive defaults
  const safeImage = user.image && user.image.startsWith('http') ? user.image : '';
  const safeName = user.name || 'User';
  const safeEmail = user.email || '';
  const safeMemberSince = user.memberSince || '';
  const safeStats = {
    ordersCount: typeof stats.ordersCount === 'number' ? stats.ordersCount : 0,
    addressesCount: typeof stats.addressesCount === 'number' ? stats.addressesCount : 0,
    wishlistCount: typeof stats.wishlistCount === 'number' ? stats.wishlistCount : 0,
  };
  const [editOpen, setEditOpen] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [pwForm, setPwForm] = useState({ password: "", newPassword: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [showMfaSetup, setShowMfaSetup] = useState(false);

  // Fetch MFA status on mount
  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => setMfaEnabled(data.mfaEnabled ?? false));
  }, []);

  // Enable MFA: get QR
  const handleEnableMfa = async () => {
    setMfaLoading(true);
    const res = await fetch("/api/user/mfa", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setQr(data.qr);
      setSecret(data.secret);
      setShowMfaSetup(true);
    } else {
      showToast("Failed to start MFA setup", "error");
    }
    setMfaLoading(false);
  };
  // Verify MFA code
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaLoading(true);
    const res = await fetch("/api/user/mfa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      showToast("MFA enabled!", "success");
      setMfaEnabled(true);
      setShowMfaSetup(false);
      setQr(null);
      setSecret(null);
      setCode("");
    } else {
      const data = await res.json();
      showToast(data.error || "Failed to enable MFA", "error");
    }
    setMfaLoading(false);
  };
  // Disable MFA
  const handleDisableMfa = async () => {
    setMfaLoading(true);
    const res = await fetch("/api/user/mfa", { method: "DELETE" });
    if (res.ok) {
      showToast("MFA disabled", "success");
      setMfaEnabled(false);
    } else {
      showToast("Failed to disable MFA", "error");
    }
    setMfaLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setLoading(false)
    if (res.ok) {
      showToast("Profile updated", "success")
      setEditOpen(false)
      window.location.reload()
    } else {
      const data = await res.json()
      showToast(data.error || "Failed to update profile", "error")
    }
  }
  const handlePw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      showToast("Passwords do not match", "error")
      return
    }
    setLoading(true)
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwForm.password, newPassword: pwForm.newPassword })
    })
    setLoading(false)
    if (res.ok) {
      showToast("Password changed", "success")
      setPwOpen(false)
      setPwForm({ password: "", newPassword: "", confirm: "" })
    } else {
      const data = await res.json()
      showToast(data.error || "Failed to change password", "error")
    }
  }
  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch("/api/user/profile", { method: "DELETE" })
    setLoading(false)
    if (res.ok) {
      showToast("Account deleted", "success")
      window.location.href = "/"
    } else {
      const data = await res.json()
      showToast(data.error || "Failed to delete account", "error")
    }
  }
  try {
    return (
      <div>
        <div 
          className="min-h-screen py-12 px-4"
          style={{
            background: "linear-gradient(135deg, rgba(248,247,255,1) 0%, rgba(250,247,254,1) 35%, rgba(245,251,255,1) 100%)",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="container mx-auto max-w-5xl">
            {/* Profile Header */}
            <GlassCard className="mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-28 w-28 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg border border-white/20">
                    {safeImage ? (
                      <Image 
                        src={safeImage} 
                        alt={safeName}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary/60" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                    <Edit className="h-4 w-4 text-primary" />
                  </button>
                </div>
                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {safeName}
                  </h1>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-700">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{safeEmail}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-700">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Member since {safeMemberSince}</span>
                    </div>
                  </div>
                </div>
                {/* Edit Profile Button */}
                <div className="md:self-start">
                  <GlassButton 
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Profile
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GlassCard className="text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-blue-500/10 mb-3">
                    <User className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{safeStats.ordersCount}</p>
                  <p className="text-sm text-slate-600">Orders</p>
                </div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-rose-500/10 mb-3">
                    <Calendar className="h-6 w-6 text-rose-500" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{safeStats.wishlistCount}</p>
                  <p className="text-sm text-slate-600">Wishlist Items</p>
                </div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-emerald-500/10 mb-3">
                    <Mail className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{safeStats.addressesCount}</p>
                  <p className="text-sm text-slate-600">Saved Addresses</p>
                </div>
              </GlassCard>
            </div>
            {/* Account Security */}
            <GlassPanel>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Account Security</h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/20">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-slate-500">Last changed: Never</p>
                    </div>
                    <GlassButton onClick={() => setPwOpen(true)}>Change Password</GlassButton>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/20">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">
                        {mfaEnabled === null ? "Checking..." : mfaEnabled ? "Enabled (TOTP)" : "Not enabled"}
                      </p>
                    </div>
                    {mfaEnabled ? (
                      <GlassButton onClick={handleDisableMfa} disabled={mfaLoading}>
                        {mfaLoading ? "Disabling..." : "Disable 2FA"}
                      </GlassButton>
                    ) : (
                      <GlassButton onClick={handleEnableMfa} disabled={mfaLoading}>
                        {mfaLoading ? "Loading..." : "Enable 2FA"}
                      </GlassButton>
                    )}
                  </div>
                  {/* MFA Setup Dialog */}
                  {showMfaSetup && (
                    <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
                      <Dialog.Content>
                        <Dialog.Title>Set up Two-Factor Authentication</Dialog.Title>
                        <div className="flex flex-col items-center gap-4">
                          {qr && <Image src={qr} alt="MFA QR Code" width={160} height={160} className="w-40 h-40" />}
                          <p className="text-sm text-slate-600">Scan this QR code with Google Authenticator or a compatible app.</p>
                          {secret && <p className="text-xs text-slate-500 break-all">Secret: {secret}</p>}
                          <form onSubmit={handleVerifyMfa} className="w-full flex flex-col gap-3 mt-2">
                            <Input
                              placeholder="Enter 6-digit code"
                              value={code}
                              onChange={e => setCode(e.target.value)}
                              required
                              maxLength={6}
                              pattern="[0-9]{6}"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button type="button" variant="outline" onClick={() => setShowMfaSetup(false)}>Cancel</Button>
                              <Button type="submit" disabled={mfaLoading}>{mfaLoading ? "Verifying..." : "Verify & Enable"}</Button>
                            </div>
                          </form>
                        </div>
                      </Dialog.Content>
                    </Dialog>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-medium">Account Deletion</p>
                      <p className="text-sm text-slate-500">This action cannot be undone</p>
                    </div>
                    <GlassButton className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" onClick={() => setDeleteOpen(true)}>
                      Delete Account
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <Dialog.Content>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <form onSubmit={handleEdit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog>
        {/* Change Password Dialog */}
        <Dialog open={pwOpen} onOpenChange={setPwOpen}>
          <Dialog.Content>
            <Dialog.Title>Change Password</Dialog.Title>
            <form onSubmit={handlePw} className="space-y-4">
              <Input placeholder="Current Password" type="password" value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} required />
              <Input placeholder="New Password" type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
              <Input placeholder="Confirm New Password" type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setPwOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Change"}</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog>
        {/* Delete Account Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Dialog.Content>
            <Dialog.Title>Delete Account</Dialog.Title>
            <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Deleting..." : "Delete"}</Button>
            </div>
          </Dialog.Content>
        </Dialog>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Error loading profile. Please try again later.
      </div>
    );
  }
} 