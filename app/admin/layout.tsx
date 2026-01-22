import type React from "react"
import { AdminAuthProvider } from "@/components/admin/auth-provider"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        </div>
        <Toaster />
      </div>
    </AdminAuthProvider>
  )
}
