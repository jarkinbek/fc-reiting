"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Save, User, Ruler, Weight, LinkIcon, Trophy, Footprints, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState } from "react"

export default function AddPlayerPage() {
  const [rating, setRating] = useState<number | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    const attributes = [
      "pace",
      "shooting",
      "passing",
      "dribbling",
      "defending",
      "physicality",
      "tackles",
      "interceptions",
      "vision",
      "ball_control",
      "reactions",
      "stamina",
      "aggression",
      "balance",
      "composure",
    ]

    const playerData: Record<string, number | string> = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")),
      height: Number(formData.get("height")),
      weight: Number(formData.get("weight")),
    }

    for (const attr of attributes) {
      playerData[attr] = Number(formData.get(attr))
    }

    const isValidData = Object.values(playerData).every(
      (val) => typeof val === "string" || (!isNaN(val as number) && (val as number) > 0),
    )

    if (!isValidData) {
      alert("Некорректные данные! Проверьте все поля.")
      setIsSubmitting(false)
      return
    }

    try {
      const predictRes = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      })

      const predictData = await predictRes.json()

      if (!predictData || typeof predictData.rating !== "number" || isNaN(predictData.rating)) {
        alert("Ошибка предсказания рейтинга: неверные данные от API")
        console.error("predictData:", predictData)
        setIsSubmitting(false)
        return
      }

      const predictedRating = Math.round(predictData.rating)
      setRating(predictedRating)

      const photo_url = formData.get("photo_url") as string

      const saveRes = await fetch("/api/add-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...playerData,
          overall: predictedRating,
          photo_url,
        }),
      })

      const saveResult = await saveRes.json()
      if (saveRes.ok) {
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        alert("Ошибка при сохранении в БД: " + saveResult.error)
      }
    } catch (error) {
      console.error("Ошибка при предсказании рейтинга", error)
      alert("Ошибка при предсказании рейтинга!")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group attributes for better organization
  const attributeGroups = [
    {
      title: "Основные атрибуты",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      attrs: ["pace", "shooting", "passing", "dribbling", "defending", "physicality"],
      colors: [
        "from-yellow-500 to-amber-600",
        "from-green-500 to-emerald-600",
        "from-blue-500 to-cyan-600",
        "from-purple-500 to-violet-600",
        "from-orange-500 to-red-600",
        "from-gray-500 to-zinc-600",
      ],
    },
    {
      title: "Технические навыки",
      icon: <Footprints className="h-5 w-5 text-purple-500" />,
      attrs: ["ball_control", "vision", "tackles", "interceptions"],
    },
    {
      title: "Физические качества",
      icon: <Dumbbell className="h-5 w-5 text-red-500" />,
      attrs: ["stamina", "aggression", "balance", "reactions", "composure"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                <Link href="/">
                  <Image
                    src="/placeholder.svg?height=24&width=80"
                    alt="EA Sports"
                    width={80}
                    height={24}
                    className="h-6 w-auto"
                  />
                </Link>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Games
                </Link>
                <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  News
                </Link>
                <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Community
                </Link>
                <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Support
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-zinc-400 hover:text-white transition-colors p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FC 25 Navigation */}
      <nav className="bg-gradient-to-r from-green-600/20 to-transparent border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="FC 25 Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center ml-8 space-x-6">
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-green-400 transition-colors">
                Player Ratings
              </Link>
              <Link href="/add-player" className="text-sm font-medium text-green-400 border-b-2 border-green-500 pb-1">
                Add Player
              </Link>
              <Link
                href="/analytics"
                className="text-sm font-medium text-zinc-400 hover:text-green-400 transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pb-20">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-green-400 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад к рейтингам
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-400">Игрок успешно добавлен!</h3>
                <p className="text-green-300/80">Игрок был добавлен в базу данных с рейтингом {rating}</p>
              </div>
              <div className="ml-auto">
                <Link href="/">
                  <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/20">
                    Вернуться к списку
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Page Title */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                  Добавление игрока
                </h1>
                <p className="text-zinc-400 mt-2">Заполните информацию о новом игроке для добавления в базу данных</p>
              </div>

              {rating !== null && !isNaN(rating) && (
                <div className="bg-zinc-800/70 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50 flex items-center gap-4">
                  <div className="text-zinc-400">Предсказанный рейтинг:</div>
                  <div className="flex items-center justify-center min-w-[3rem] h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-black font-bold text-xl">
                    {rating}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Information */}
                <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl p-6 lg:col-span-1">
                  <div className="flex items-center mb-6">
                    <User className="h-5 w-5 text-green-500 mr-2" />
                    <h2 className="text-xl font-bold text-white">Основная информация</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">
                        Полное имя
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Например: Kylian Mbappé"
                        className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-zinc-300">
                        Возраст
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="25"
                        className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                        required
                        min="16"
                        max="45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-zinc-300 flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-zinc-500" />
                        Рост (см)
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        placeholder="178"
                        className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                        required
                        min="150"
                        max="220"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-zinc-300 flex items-center">
                        <Weight className="h-4 w-4 mr-1 text-zinc-500" />
                        Вес (кг)
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="73"
                        className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                        required
                        min="50"
                        max="120"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photo_url" className="text-zinc-300 flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1 text-zinc-500" />
                        Ссылка на фото (URL)
                      </Label>
                      <Input
                        id="photo_url"
                        name="photo_url"
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Player Attributes */}
                <div className="lg:col-span-2 space-y-6">
                  {attributeGroups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl p-6"
                    >
                      <div className="flex items-center mb-6">
                        {group.icon}
                        <h2 className="text-xl font-bold text-white ml-2">{group.title}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {group.attrs.map((attr, attrIndex) => (
                          <div key={attr} className="space-y-2">
                            <Label
                              htmlFor={attr}
                              className={`text-zinc-300 capitalize flex items-center ${
                                group.title === "Основные атрибуты"
                                  ? "bg-gradient-to-r " +
                                    group.colors[attrIndex] +
                                    " bg-clip-text text-transparent font-medium"
                                  : ""
                              }`}
                            >
                              {attr.replace("_", " ")}
                            </Label>
                            <div className="relative">
                              <Input
                                id={attr}
                                name={attr}
                                type="number"
                                className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11 pr-10"
                                required
                                min="1"
                                max="99"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">
                                / 99
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-medium px-8 py-6 rounded-lg shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
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
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Добавить игрока
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800 bg-black/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/placeholder.svg?height=30&width=90"
                alt="EA Sports"
                width={90}
                height={30}
                className="h-8 w-auto mr-4"
              />
              <p className="text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} Electronic Arts Inc. EA SPORTS FC™ 25
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
                Правовая информация
              </Link>
              <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
