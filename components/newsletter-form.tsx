"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      setEmail("")

      // Сбросить сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className="flex">
        <Input
          type="email"
          placeholder="Email"
          className="bg-zinc-900 border-zinc-700 rounded-l-md w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-l-none" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Отправить"}В
        </Button>
      </div>
      {success && <p className="text-xs text-green-400">Спасибо за подписку!</p>}
    </form>
  )
}
