"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Ruler, Weight, LinkIcon, Trophy, Footprints, Dumbbell, Save, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toaster"
import { AdminPageTitle } from "@/components/admin/page-title"
import Link from "next/link"

type Player = {
  id: number
  name: string
  age: number
  height: number
  weight: number
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physicality: number
  tackles: number
  interceptions: number
  vision: number
  ball_control: number
  reactions: number
  stamina: number
  aggression: number
  balance: number
  composure: number
  overall: number
  photo?: string
  flag?: string
  country?: string
}

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/players/${params.id}`)

        if (!response.ok) {
          throw new Error("Не удалось загрузить данные игрока")
        }

        const data = await response.json()
        setPlayer(data)
      } catch (error) {
        console.error("Ошибка при загрузке игрока:", error)
        setError(error instanceof Error ? error.message : "Произошла ошибка при загрузке данных")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [params.id])

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
      "overall",
    ]

    const playerData: Record<string, number | string> = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")),
      height: Number(formData.get("height")),
      weight: Number(formData.get("weight")),
      country: formData.get("country") as string,
    }

    for (const attr of attributes) {
      playerData[attr] = Number(formData.get(attr))
    }

    const isValidData = Object.values(playerData).every(
      (val) => typeof val === "string" || (!isNaN(val as number) && (val as number) > 0),
    )

    if (!isValidData) {
      toast({
        title: "Ошибка валидации",
        description: "Некорректные данные! Проверьте все поля.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const photo = formData.get("photo") as string
      const flag = formData.get("flag") as string

      const response = await fetch(`/api/players/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...playerData,
          photo,
          flag,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось обновить игрока")
      }

      toast({
        title: "Игрок обновлен",
        description: `Данные игрока ${playerData.name} успешно обновлены`,
      })

      router.push("/admin/players")
    } catch (error) {
      console.error("Ошибка при обновлении игрока:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные игрока",
        variant: "destructive",
      })
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
          <p className="text-zinc-400">Загрузка данных игрока...</p>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Ошибка загрузки</h2>
          <p className="text-zinc-300 mb-4">{error || "Не удалось загрузить данные игрока"}</p>
          <Link href="/admin/players">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">Вернуться к списку игроков</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageTitle
        title={`Редактирование игрока: ${player.name}`}
        description="Измените информацию об игроке"
        actions={
          <Link href="/admin/players">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Button>
          </Link>
        }
      />

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
                  defaultValue={player.name}
                  className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-zinc-300">
                  Страна
                </Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={player.country || ""}
                  className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
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
                  defaultValue={player.age}
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
                  defaultValue={player.height}
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
                  defaultValue={player.weight}
                  className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                  required
                  min="50"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-zinc-300 flex items-center">
                  <LinkIcon className="h-4 w-4 mr-1 text-zinc-500" />
                  Ссылка на фото (URL)
                </Label>
                <Input
                  id="photo"
                  name="photo"
                  type="url"
                  defaultValue={player.photo || ""}
                  className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flag" className="text-zinc-300 flex items-center">
                  <LinkIcon className="h-4 w-4 mr-1 text-zinc-500" />
                  Ссылка на флаг страны (URL)
                </Label>
                <Input
                  id="flag"
                  name="flag"
                  type="url"
                  defaultValue={player.flag || ""}
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
                          defaultValue={player[attr as keyof Player]}
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

            {/* Overall Rating */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl p-6">
              <div className="flex items-center mb-6">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-white">Общий рейтинг</h2>
              </div>

              <div className="max-w-xs mx-auto">
                <Label htmlFor="overall" className="text-zinc-300 text-center block mb-2">
                  Общий рейтинг игрока
                </Label>
                <div className="relative">
                  <Input
                    id="overall"
                    name="overall"
                    type="number"
                    defaultValue={player.overall}
                    className="bg-zinc-800/70 border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-16 text-center text-2xl font-bold"
                    required
                    min="1"
                    max="99"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-lg">/ 99</div>
                </div>
              </div>
            </div>
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Сохранить изменения
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
