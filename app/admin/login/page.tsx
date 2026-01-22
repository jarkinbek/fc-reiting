"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/components/admin/auth-provider"
import { AdminLoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  const { user, login } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user, router])

  return <AdminLoginForm onLogin={login} />
}
