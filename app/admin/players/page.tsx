"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { toast } from "@/components/ui/toaster"
import { AdminPageTitle } from "@/components/admin/page-title"
import { PlayerFilters } from "@/components/admin/player-filters"

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
  overall: number
  photo?: string
  flag?: string
  country?: string
}

type SortConfig = {
  key: keyof Player | null
  direction: "asc" | "desc"
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "overall", direction: "desc" })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const [playersPerPage] = useState(10)

  // Фильтры
  const [filters, setFilters] = useState({
    minAge: 0,
    maxAge: 100,
    minOverall: 0,
    maxOverall: 99,
    positions: [] as string[],
  })

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    // Применяем фильтры и поиск
    let result = [...players]

    // Поиск
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter(
        (player) =>
          player.name.toLowerCase().includes(lowerCaseQuery) ||
          (player.country && player.country.toLowerCase().includes(lowerCaseQuery)),
      )
    }

    // Фильтры
    result = result.filter(
      (player) =>
        player.age >= filters.minAge &&
        player.age <= filters.maxAge &&
        player.overall >= filters.minOverall &&
        player.overall <= filters.maxOverall,
    )

    // Сортировка
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredPlayers(result)
    setCurrentPage(1) // Сбрасываем на первую страницу при изменении фильтров
  }, [players, searchQuery, filters, sortConfig])

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

  const handleSort = (key: keyof Player) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    } else {
      direction = "asc"
    }

    setSortConfig({ key, direction })
  }

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player)
    setDeleteDialogOpen(true)
  }

  const handleDeletePlayer = async () => {
    if (!selectedPlayer) return

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Не удалось удалить игрока")
      }

      // Удаляем игрока из списка
      setPlayers(players.filter((player) => player.id !== selectedPlayer.id))

      toast({
        title: "Игрок удален",
        description: `Игрок ${selectedPlayer.name} успешно удален из базы данных`,
      })

      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при удалении игрока:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить игрока",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCSV = () => {
    setIsExporting(true)

    try {
      // Определяем заголовки
      const headers = [
        "id",
        "name",
        "age",
        "height",
        "weight",
        "pace",
        "shooting",
        "passing",
        "dribbling",
        "defending",
        "physicality",
        "overall",
        "country",
      ]

      // Создаем строки данных
      const rows = filteredPlayers.map((player) => headers.map((header) => player[header as keyof Player]))

      // Объединяем заголовки и данные
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Создаем Blob и ссылку для скачивания
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `fc25_players_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Экспорт завершен",
        description: `Экспортировано ${filteredPlayers.length} игроков в CSV файл`,
      })
    } catch (error) {
      console.error("Ошибка при экспорте данных:", error)
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
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
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
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

  return (
    <div className="space-y-6">
      <AdminPageTitle
        title="Управление игроками"
        description="Просмотр, добавление, редактирование и удаление игроков"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              onClick={() => fetchPlayers()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                <DropdownMenuLabel>Формат экспорта</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт в CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт в JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/admin/players/add">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Добавить игрока
              </Button>
            </Link>
          </div>
        }
      />

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Поиск игрока по имени или стране"
              className="bg-zinc-800/70 border-zinc-700 pl-10 py-6 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white ${
                showFilters ? "bg-zinc-800 text-white" : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Сортировка
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "name", direction: "asc" })}
                >
                  Имя (А-Я)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "name", direction: "desc" })}
                >
                  Имя (Я-А)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "overall", direction: "desc" })}
                >
                  Рейтинг (по убыванию)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "overall", direction: "asc" })}
                >
                  Рейтинг (по возрастанию)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "age", direction: "asc" })}
                >
                  Возраст (по возрастанию)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSortConfig({ key: "age", direction: "desc" })}
                >
                  Возраст (по убыванию)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Расширенные фильтры */}
        {showFilters && <PlayerFilters filters={filters} setFilters={setFilters} />}

        {/* Результаты поиска */}
        <div className="text-sm text-zinc-400">
          {searchQuery || filters.minOverall > 0 || filters.minAge > 0 ? (
            <p>
              Найдено игроков: <span className="text-green-400 font-medium">{filteredPlayers.length}</span>
              {filteredPlayers.length === 0 && (
                <span className="ml-2 text-red-400">Попробуйте изменить параметры поиска</span>
              )}
            </p>
          ) : (
            <p>
              Всего игроков: <span className="text-green-400 font-medium">{players.length}</span>
            </p>
          )}
        </div>
      </div>

      {/* Таблица игроков */}
      <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                <TableHead className="text-green-400 font-medium">Фото</TableHead>
                <TableHead className="text-green-400 font-medium">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                    Имя
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "name" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium">Страна</TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("age")}>
                    Возраст
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "age" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("pace")}>
                    Скорость
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "pace" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("shooting")}
                  >
                    Удары
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "shooting" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("passing")}
                  >
                    Пасы
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "passing" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("dribbling")}
                  >
                    Дриблинг
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "dribbling" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("defending")}
                  >
                    Оборона
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "defending" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("physicality")}
                  >
                    Физика
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "physicality" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleSort("overall")}
                  >
                    Рейтинг
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortConfig.key === "overall" ? "text-green-400" : "text-zinc-600"}`}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-green-400 font-medium text-center">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-zinc-800/50">
                    <TableCell>
                      <div className="w-10 h-10 bg-zinc-800 animate-pulse rounded-full"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-zinc-800 animate-pulse rounded w-32"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-zinc-800 animate-pulse rounded w-20"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 bg-zinc-800 animate-pulse rounded w-8 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 bg-zinc-800 animate-pulse rounded-full w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <div className="h-8 bg-zinc-800 animate-pulse rounded w-20"></div>
                        <div className="h-8 bg-zinc-800 animate-pulse rounded w-20"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-red-400">
                    <p className="text-lg font-medium">Ошибка загрузки данных</p>
                    <p className="text-sm mt-2">{error}</p>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={fetchPlayers}>
                      Попробовать снова
                    </Button>
                  </TableCell>
                </TableRow>
              ) : currentPlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-zinc-400">
                    {searchQuery || filters.minOverall > 0 || filters.minAge > 0 ? (
                      <div>
                        <p className="text-lg font-medium">Игроки не найдены</p>
                        <p className="text-sm mt-2">Попробуйте изменить параметры поиска</p>
                        <Button
                          variant="outline"
                          className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          onClick={() => {
                            setSearchQuery("")
                            setFilters({
                              minAge: 0,
                              maxAge: 100,
                              minOverall: 0,
                              maxOverall: 99,
                              positions: [],
                            })
                          }}
                        >
                          Сбросить фильтры
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">Нет данных об игроках</p>
                        <p className="text-sm mt-2">Добавьте первого игрока, нажав кнопку "Добавить игрока"</p>
                        <Link href="/admin/players/add">
                          <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Добавить игрока
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                currentPlayers.map((player, index) => (
                  <TableRow
                    key={player.id}
                    className={`border-zinc-800/50 hover:bg-zinc-800/30 ${
                      index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/10"
                    }`}
                  >
                    <TableCell>
                      <div className="w-10 h-10 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                        <Image
                          src={player.photo || "/placeholder.svg?height=40&width=40"}
                          alt={player.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>
                      {player.country && (
                        <div className="flex items-center">
                          {player.flag && (
                            <div className="w-6 h-4 overflow-hidden rounded mr-2 border border-zinc-700">
                              <Image
                                src={player.flag || "/placeholder.svg"}
                                alt={player.country}
                                width={24}
                                height={16}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span>{player.country}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{player.age}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black font-bold text-sm">
                        {player.pace}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-black font-bold text-sm">
                        {player.shooting}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-black font-bold text-sm">
                        {player.passing}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full text-black font-bold text-sm">
                        {player.dribbling}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-black font-bold text-sm">
                        {player.defending}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-gray-500 to-zinc-600 rounded-full text-white font-bold text-sm">
                        {player.physicality}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-black font-bold text-lg">
                        {player.overall}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/players/edit/${player.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-700/50 bg-blue-900/20 hover:bg-blue-800/30 text-blue-400"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Изменить
                          </Button>
                        </Link>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Пагинация */}
      {!isLoading && !error && filteredPlayers.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-zinc-400">
            Показано {indexOfFirstPlayer + 1}-{Math.min(indexOfLastPlayer, filteredPlayers.length)} из{" "}
            {filteredPlayers.length} игроков
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      )}

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
    </div>
  )
}
