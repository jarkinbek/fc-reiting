"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, ArrowUpDown, Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const [playersPerPage] = useState(10)

  useEffect(() => {
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

    fetchPlayers()
  }, [])

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
              <Link href="/" className="text-sm font-medium text-green-400 border-b-2 border-green-500 pb-1">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="/placeholder.svg?height=600&width=1600" alt="Background" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 z-10"></div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative h-24 w-48">
                <Image
                  src="/placeholder.svg?height=96&width=192"
                  alt="EA Sports FC"
                  width={192}
                  height={96}
                  className="h-full w-auto"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              Объявление рейтингов игроков в FC 25
            </h1>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
              Смотрите рейтинги и игровые стили для всех 17 000+ игроков в EA SPORTS FC™ 25.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 -mt-8 relative z-30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-zinc-700/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Поиск игрока"
                    className="bg-zinc-900/80 border-zinc-700 rounded-lg pl-10 pr-4 py-6 w-full text-white placeholder:text-zinc-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Фильтры
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Сортировка
                  </Button>
                </div>
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
        </div>
      </section>

      {/* Players Table Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Рейтинги игроков</h2>
              <p className="text-zinc-400">
                {!isLoading && !error && filteredPlayers.length > 0 && (
                  <>
                    Страница {currentPage} из {totalPages}
                    {searchQuery &&
                      ` • Показано ${currentPlayers.length} из ${filteredPlayers.length} найденных игроков`}
                  </>
                )}
              </p>
            </div>
            <Link href="/add-player">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6">
                <Plus className="h-4 w-4 mr-2" />
                Добавить игрока
              </Button>
            </Link>
          </div>

          {/* Table Container with Shadow Effect */}
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-800/80">
                    <th className="py-4 px-4 text-left text-green-400 font-medium">Фото</th>
                    <th className="py-4 px-4 text-left text-green-400 font-medium">Имя</th>
                    <th className="py-4 px-4 text-left text-green-400 font-medium">Флаг</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Возраст</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Рост</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Вес</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Скорость</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Удары</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Пасы</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Дриблинг</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Оборона</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Физика</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Подкаты</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Перехваты</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Видение</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Контроль мяча</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Реакции</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Выносливость</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Агрессия</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Баланс</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">Хладнокровие</th>
                    <th className="py-4 px-4 text-center text-green-400 font-medium">
                      <div className="flex items-center justify-center">
                        <span>Рейтинг</span>
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={21} className="py-8 text-center text-zinc-400">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mr-3"></div>
                          <span>Загрузка данных...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={21} className="py-8 text-center text-red-400">
                        <p className="text-lg font-medium">Ошибка загрузки данных</p>
                        <p className="text-sm mt-2">{error}</p>
                      </td>
                    </tr>
                  ) : filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={21} className="py-8 text-center text-zinc-400">
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
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center w-8 h-6 overflow-hidden rounded shadow-sm">
                            <Image
                              src={player.flag || "/placeholder.svg?height=24&width=32"}
                              alt={player.country || "Country flag"}
                              width={32}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                        </td>
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
                        <td className="py-4 px-4 text-center text-zinc-300">{player.tackles}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.interceptions}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.vision}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.ball_control}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.reactions}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.stamina}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.aggression}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.balance}</td>
                        <td className="py-4 px-4 text-center text-zinc-300">{player.composure}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center justify-center min-w-[2.5rem] h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-black font-bold text-lg">
                            {player.overall}
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

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800 bg-black/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="EA Sports"
                width={120}
                height={40}
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm text-zinc-400">
                EA SPORTS FC™ 25 - официальная игра футбольной симуляции от Electronic Arts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Игра</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Особенности
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Ultimate Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Карьера
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Клубы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Форумы
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Обновления
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Подписаться</h3>
              <p className="text-sm text-zinc-400 mb-4">Получайте последние новости и обновления</p>
              <div className="flex">
                <Input type="email" placeholder="Email" className="bg-zinc-900 border-zinc-700 rounded-l-md w-full" />
                <Button className="bg-green-600 hover:bg-green-700 rounded-l-none">Отправить</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} Electronic Arts Inc. EA, EA SPORTS, и логотип EA SPORTS являются
              товарными знаками Electronic Arts Inc.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
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
