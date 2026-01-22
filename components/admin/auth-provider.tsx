"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminLoginForm } from "@/components/admin/login-form"

type AdminUser = {
  id: string
  username: string
  role: string
}

type AdminAuthContextType = {
  user: AdminUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const storedUser = localStorage.getItem("admin_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("admin_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // В реальном приложении здесь должен быть запрос к API
      // Для демонстрации используем простую проверку
      if (username === "admin" && password === "admin123") {
        const user = {
          id: "1",
          username: "admin",
          role: "administrator"
        }
        setUser(user)
        localStorage.setItem("admin_user", JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  // Если пользователь не авторизован и не находится на странице логина, показываем форму логина
  if (!user && !isLoading && !pathname?.includes("/admin/login")) {
    return <AdminLoginForm onLogin={login} />
  }

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
