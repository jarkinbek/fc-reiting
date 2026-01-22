"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/components/admin/auth-provider"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()

  if (!user) return null

  const navItems = [
    {
      title: "Главная страница",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      external: true,
    },
    {
      title: "Панель управления",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Управление игроками",
      href: "/admin/players",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Аналитика",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Настройки",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn(
        "bg-zinc-900 border-r border-zinc-800 h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <Shield className="h-8 w-8 text-green-500 flex-shrink-0" />
          {!collapsed && <span className="ml-2 font-bold text-lg text-white">FC25 Admin</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center px-3 py-3 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-green-600/20 text-green-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                collapsed && "justify-center",
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800">
        {!collapsed && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 flex items-center",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Выйти</span>}
        </Button>
      </div>
    </div>
  )
}
