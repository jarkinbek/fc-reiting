"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Pencil, Trash2, Search, Shield, AlertTriangle, Save, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Users, BarChart3, Clock, TrendingUp, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPageTitle } from "@/components/admin/page-title"
import { RecentActivityList } from "@/components/admin/recent-activity"

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

type DashboardStats = {
  totalPlayers: number
  averageRating: number
  recentlyAdded: number
  pendingIssues: number
}

export default function AdminPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>({
    username: "admin",
    role: "administrator",
  })
  const [stats, setStats] = useState<DashboardStats>({
    totalPlayers: 0,
    averageRating: 0,
    recentlyAdded: 0,
    pendingIssues: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])

  // Состояние для модальных окон
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [editedPlayer, setEditedPlayer] = useState<Partial<Player>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const [playersPerPage] = useState(10)

  useEffect(() => {
    fetchPlayers()
    fetchDashboardData()
  }, [])

  const fetchPlayers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/players")

      if (!response.ok) {
        throw new Error("Не удалось загрузить данные игроков")
      }

      const data = await response.json()
      setPlayers(data)
      setFilteredPlayers(data)
    } catch (error) {
      console.error("Ошибка при загрузке игроков:", error)
      setError(error instanceof Error ? error.message : "Произошла ошибка при загрузке данных")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      // В ��еальном приложении здесь должен быть запрос к API
      const response = await fetch("/api/players")

      if (!response.ok) {
        throw new Error("Failed to fetch players")
      }

      const players = await response.json()

      // Расчет статистики
      const totalPlayers = players.length
      const averageRating =
        players.length > 0
          ? Math.round(players.reduce((sum: number, player: any) => sum + player.overall, 0) / players.length)
          : 0

      // Имитация данных для демонстрации
      const recentlyAdded = Math.min(5, players.length)
      const pendingIssues = Math.floor(Math.random() * 5)

      setStats({
        totalPlayers,
        averageRating,
        recentlyAdded,
        pendingIssues,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для фильтрации игроков по поисковому запросу
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Сбрасываем на первую страницу при поиске

    if (!query.trim()) {
      setFilteredPlayers(players)
      return
    }

    const lowerCaseQuery = query.toLowerCase()
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(lowerCaseQuery) ||
        (player.country && player.country.toLowerCase().includes(lowerCaseQuery)),
    )

    setFilteredPlayers(filtered)
  }

  // Логика пагинации
  const indexOfLastPlayer = currentPage * playersPerPage
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer)
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)

  // Функции для навигации по страницам
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Генерация номеров страниц для пагинации
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Максимальное количество кнопок страниц для отображения

    if (totalPages <= maxPagesToShow) {
      // Если общее количество страниц меньше или равно maxPagesToShow, показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Иначе показываем страницы вокруг текущей
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  // Функции для редактирования игрока
  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player)
    setEditedPlayer({ ...player })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player)
    setDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Преобразуем числовые значения
    if (
      [
        "age",
        "height",
        "weight",
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
      ].includes(name)
    ) {
      setEditedPlayer({
        ...editedPlayer,
        [name]: Number(value),
      })
    } else {
      setEditedPlayer({
        ...editedPlayer,
        [name]: value,
      })
    }
  }

  const handleSavePlayer = async () => {
    if (!selectedPlayer || !editedPlayer) return

    try {
      setIsSaving(true)

      const response = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPlayer),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не удалось обновить игрока")
      }

      // Обновляем список игроков
      const updatedPlayers = players.map((player) =>
        player.id === selectedPlayer.id ? { ...player, ...editedPlayer } : player,
      )

      setPlayers(updatedPlayers)
      setFilteredPlayers(
        searchQuery
          ? updatedPlayers.filter(
              (player) =>
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (player.country && player.country.toLowerCase().includes(searchQuery.toLowerCase())),
            )
          : updatedPlayers,
      )

      toast({
        title: "Игрок обновлен",
        description: `Данные игрока ${editedPlayer.name} успешно обновлены`,
      })

      setEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при обновлении игрока:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить данные игрока",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePlayer = async () => {
    if (!selectedPlayer) return

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не удалось удалить игрока")
      }

      // Удаляем игрока из списка
      const updatedPlayers = players.filter((player) => player.id !== selectedPlayer.id)
      setPlayers(updatedPlayers)
      setFilteredPlayers(
        searchQuery
          ? updatedPlayers.filter(
              (player) =>
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (player.country && player.country.toLowerCase().includes(searchQuery.toLowerCase())),
            )
          : updatedPlayers,
      )

      toast({
        title: "Игрок удален",
        description: `Игрок ${selectedPlayer.name} успешно удален из базы данных`,
      })

      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при удалении игрока:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить игрока",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Группы атрибутов для формы редактирования
  const attributeGroups = [
    {
      title: "Основные атрибуты",
      attrs: ["pace", "shooting", "passing", "dribbling", "defending", "physicality"],
    },
    {
      title: "Технические навыки",
      attrs: ["ball_control", "vision", "tackles", "interceptions"],
    },
    {
      title: "Физические качества",
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
                <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
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
              <Link
                href="/add-player"
                className="text-sm font-medium text-zinc-400 hover:text-green-400 transition-colors"
              >
                Add Player
              </Link>
              <Link
                href="/analytics"
                className="text-sm font-medium text-zinc-400 hover:text-green-400 transition-colors"
              >
                Analytics
              </Link>
              <Link href="/admin" className="text-sm font-medium text-green-400 border-b-2 border-green-500 pb-1">
                Admin
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

        {/* Page Title */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Панель администратора
                  </h1>
                  <p className="text-zinc-400 mt-2">Управление игроками и их характеристиками</p>
                </div>
              </div>
              <Link href="/add-player">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Добавить нового игрока</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="bg-zinc-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-zinc-700/50">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Поиск игрока по имени или стране"
                  className="bg-zinc-900/80 border-zinc-700 rounded-lg pl-10 pr-4 py-6 w-full text-white placeholder:text-zinc-500"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              </div>

              {/* Search Results Count */}
              {!isLoading && (
                <div className="mt-4 text-sm text-zinc-400">
                  {searchQuery ? (
                    <p>
                      Найдено игроков: <span className="text-green-400 font-medium">{filteredPlayers.length}</span>
                      {filteredPlayers.length === 0 && (
                        <span className="ml-2 text-red-400">Попробуйте изменить запрос</span>
                      )}
                    </p>
                  ) : (
                    <p>
                      Всего игроков: <span className="text-green-400 font-medium">{players.length}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Players Table Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-zinc-800/80">
                      <th className="py-4 px-4 text-left text-green-400 font-medium">ID</th>
                      <th className="py-4 px-4 text-left text-green-400 font-medium">Фото</th>
                      <th className="py-4 px-4 text-left text-green-400 font-medium">Имя</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Возраст</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Рост</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Вес</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Скорость</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Удары</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Пасы</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Дриблинг</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Оборона</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Физика</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Рейтинг</th>
                      <th className="py-4 px-4 text-center text-green-400 font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={14} className="py-8 text-center text-zinc-400">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mr-3"></div>
                            <span>Загрузка данных...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={14} className="py-8 text-center text-red-400">
                          <p className="text-lg font-medium">Ошибка загрузки данных</p>
                          <p className="text-sm mt-2">{error}</p>
                        </td>
                      </tr>
                    ) : filteredPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="py-8 text-center text-zinc-400">
                          {searchQuery ? (
                            <div>
                              <p className="text-lg font-medium">Игроки не найдены</p>
                              <p className="text-sm mt-2">Попробуйте изменить поисковый запрос</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg font-medium">Нет данных об игроках</p>
                              <p className="text-sm mt-2">Добавьте первого игрока, нажав кнопку "Добавить игрока"</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      currentPlayers.map((player, index) => (
                        <tr
                          key={player.id}
                          className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                            index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/10"
                          }`}
                        >
                          <td className="py-4 px-4 text-zinc-400">{player.id}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full overflow-hidden border-2 border-zinc-700">
                              <Image
                                src={player.photo || "/placeholder.svg?height=48&width=48"}
                                alt={player.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium">{player.name}</td>
                          <td className="py-4 px-4 text-center">{player.age}</td>
                          <td className="py-4 px-4 text-center">{player.height} см</td>
                          <td className="py-4 px-4 text-center">{player.weight} кг</td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black font-bold text-sm">
                              {player.pace}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-black font-bold text-sm">
                              {player.shooting}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-black font-bold text-sm">
                              {player.passing}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full text-black font-bold text-sm">
                              {player.dribbling}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-black font-bold text-sm">
                              {player.defending}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-gray-500 to-zinc-600 rounded-full text-white font-bold text-sm">
                              {player.physicality}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-black font-bold text-lg">
                              {player.overall}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-700/50 bg-blue-900/20 hover:bg-blue-800/30 text-blue-400"
                                onClick={() => handleEditClick(player)}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Изменить
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-700/50 bg-red-900/20 hover:bg-red-800/30 text-red-400"
                                onClick={() => handleDeleteClick(player)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Удалить
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {!isLoading && !error && filteredPlayers.length > 0 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад
                  </Button>

                  {getPageNumbers().map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant="outline"
                      size="sm"
                      className={
                        pageNumber === currentPage
                          ? "border-green-700 bg-green-800/50 text-green-300 hover:bg-green-700 hover:text-white"
                          : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Вперед
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </nav>
              </div>
            )}

            {/* Pagination Info */}
            {!isLoading && !error && filteredPlayers.length > 0 && (
              <div className="mt-4 text-center text-sm text-zinc-400">
                Показано {indexOfFirstPlayer + 1}-{Math.min(indexOfLastPlayer, filteredPlayers.length)} из{" "}
                {filteredPlayers.length} игроков
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Модальное окно редактирования игрока */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Pencil className="h-5 w-5 mr-2 text-blue-400" />
              Редактирование игрока
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Измените данные игрока и нажмите "Сохранить" для подтверждения изменений.
            </DialogDescription>
          </DialogHeader>

          {selectedPlayer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Основная информация */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Основная информация</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">
                    Полное имя
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editedPlayer.name || ""}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-zinc-300">
                      Возраст
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={editedPlayer.age || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-zinc-300">
                      Рост (см)
                    </Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={editedPlayer.height || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-zinc-300">
                      Вес (кг)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={editedPlayer.weight || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-zinc-300">
                    URL фото
                  </Label>
                  <Input
                    id="photo"
                    name="photo"
                    value={editedPlayer.photo || ""}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-zinc-300">
                    Страна
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={editedPlayer.country || ""}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flag" className="text-zinc-300">
                    URL флага
                  </Label>
                  <Input
                    id="flag"
                    name="flag"
                    value={editedPlayer.flag || ""}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              {/* Атрибуты игрока */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Атрибуты игрока</h3>

                {attributeGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    <h4 className="text-md font-medium text-zinc-300">{group.title}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {group.attrs.map((attr) => (
                        <div key={attr} className="space-y-2">
                          <Label htmlFor={attr} className="text-zinc-300 capitalize">
                            {attr.replace("_", " ")}
                          </Label>
                          <Input
                            id={attr}
                            name={attr}
                            type="number"
                            min="1"
                            max="99"
                            value={editedPlayer[attr as keyof typeof editedPlayer] || ""}
                            onChange={handleInputChange}
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="overall" className="text-zinc-300 font-medium">
                    Общий рейтинг
                  </Label>
                  <Input
                    id="overall"
                    name="overall"
                    type="number"
                    min="1"
                    max="99"
                    value={editedPlayer.overall || ""}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={handleSavePlayer}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Подтверждение удаления
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Вы уверены, что хотите удалить игрока{" "}
              <span className="text-white font-medium">{selectedPlayer?.name}</span>? Это действие нельзя будет
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlayer}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toaster для уведомлений */}
      <Toaster />
      <div className="space-y-6">
        <AdminPageTitle
          title="Панель управления"
          description={`Добро пожаловать, ${user.username}! Здесь вы можете управлять всеми аспектами FC25.`}
        />

        {/* Поиск */}
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Поиск по игрокам, командам..."
            className="bg-zinc-800/70 border-zinc-700 pl-10 py-6"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего игроков"
            value={stats.totalPlayers.toString()}
            description="Игроков в базе данных"
            icon={<Users className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Средний рейтинг"
            value={stats.averageRating.toString()}
            description="Средний рейтинг всех игроков"
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Недавно добавлено"
            value={stats.recentlyAdded.toString()}
            description="Новых игроков за последние 7 дней"
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Ожидающие проблемы"
            value={stats.pendingIssues.toString()}
            description="Проблемы, требующие внимания"
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            isLoading={isLoading}
          />
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-lg">Быстрые действия</CardTitle>
              <CardDescription>Часто используемые операции</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/players/add">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить игрока
                </Button>
              </Link>
              <Link href="/admin/players">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Управление игроками
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Просмотр аналитики
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Недавняя активность */}
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Недавняя активность</CardTitle>
              <CardDescription>Последние действия в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  isLoading: boolean
}

function StatCard({ title, value, description, icon, isLoading }: StatCardProps) {
  return (
    <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <div className="p-2 bg-zinc-800/50 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div>
        ) : (
          <div className="text-3xl font-bold text-white">{value}</div>
        )}
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
