"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User, Lock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminLoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>
}

export function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const success = await onLogin(username, password)
      if (!success) {
        setError("Неверное имя пользователя или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе. Пожалуйста, попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 p-4">
      <Card className="w-full max-w-md bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/placeholder.svg?height=40&width=120"
              alt="FC 25 Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-green-500" />
            Административная панель
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Введите свои учетные данные для входа в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">
                  Имя пользователя
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-zinc-800/70 border-zinc-700 pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800/70 border-zinc-700 pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </CardFooter>
        <div className="p-4 text-center text-xs text-zinc-500">
          <p>Для демонстрации используйте:</p>
          <p>Имя пользователя: <span className="text-zinc-400">admin</span></p>
          <p>Пароль: <span className="text-zinc-400">admin123</span></p>
        </div>
      </Card>
    </div>
  )
}
