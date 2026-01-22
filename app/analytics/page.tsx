"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, BarChart3, PieChart, LineChart, Users, Trophy, Dumbbell, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Импортируем Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js"
import { Bar, Pie, Line, Radar } from "react-chartjs-2"

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
)

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

export default function AnalyticsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttribute, setSelectedAttribute] = useState("overall")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

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
        if (data.length > 0) {
          setSelectedPlayerId(data[0].id.toString())
        }
      } catch (err) {
        console.error("Ошибка при загрузке игроков:", err)
        setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке данных")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // Функции для анализа данных
  const getAverageByAttribute = (attribute: keyof Player) => {
    if (players.length === 0) return 0
    const sum = players.reduce((acc, player) => acc + Number(player[attribute]), 0)
    return Math.round((sum / players.length) * 10) / 10
  }

  const getMaxByAttribute = (attribute: keyof Player) => {
    if (players.length === 0) return 0
    return Math.max(...players.map((player) => Number(player[attribute])))
  }

  const getMinByAttribute = (attribute: keyof Player) => {
    if (players.length === 0) return 0
    return Math.min(...players.map((player) => Number(player[attribute])))
  }

  const getMedianByAttribute = (attribute: keyof Player) => {
    if (players.length === 0) return 0
    const values = [...players].map((player) => Number(player[attribute])).sort((a, b) => a - b)
    const mid = Math.floor(values.length / 2)
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2
  }

  const getStandardDeviationByAttribute = (attribute: keyof Player) => {
    if (players.length <= 1) return 0
    const mean = getAverageByAttribute(attribute)
    const squareDiffs = players.map((player) => {
      const diff = Number(player[attribute]) - mean
      return diff * diff
    })
    const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / squareDiffs.length
    return Math.round(Math.sqrt(avgSquareDiff) * 10) / 10
  }

  const getTopPlayersByAttribute = (attribute: keyof Player, count = 5) => {
    if (players.length === 0) return []
    return [...players].sort((a, b) => Number(b[attribute]) - Number(a[attribute])).slice(0, count)
  }

  const getAttributeDistribution = (attribute: keyof Player, bins = 10) => {
    if (players.length === 0) return { labels: [], data: [] }

    const values = players.map((player) => Number(player[attribute]))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    const binSize = range / bins

    const distribution = Array(bins).fill(0)
    const labels = []

    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize
      const binEnd = binStart + binSize
      labels.push(`${Math.round(binStart)}-${Math.round(binEnd)}`)

      values.forEach((value) => {
        if (value >= binStart && (value < binEnd || (i === bins - 1 && value <= binEnd))) {
          distribution[i]++
        }
      })
    }

    return { labels, data: distribution }
  }

  const getAgeGroups = () => {
    const ageGroups = {
      "16-20": 0,
      "21-25": 0,
      "26-30": 0,
      "31-35": 0,
      "36+": 0,
    }

    players.forEach((player) => {
      const age = player.age
      if (age <= 20) ageGroups["16-20"]++
      else if (age <= 25) ageGroups["21-25"]++
      else if (age <= 30) ageGroups["26-30"]++
      else if (age <= 35) ageGroups["31-35"]++
      else ageGroups["36+"]++
    })

    return {
      labels: Object.keys(ageGroups),
      data: Object.values(ageGroups),
    }
  }

  const getAttributeCorrelation = (attribute1: keyof Player, attribute2: keyof Player) => {
    if (players.length === 0) return { labels: [], data: [] }

    return {
      labels: players.slice(0, 20).map((player) => player.name),
      datasets: [
        {
          label: attribute1,
          data: players.slice(0, 20).map((player) => Number(player[attribute1])),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: attribute2,
          data: players.slice(0, 20).map((player) => Number(player[attribute2])),
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
      ],
    }
  }

  const getRadarChartData = (playerId: number) => {
    const player = players.find((p) => p.id === playerId)
    if (!player) return null

    return {
      labels: ["Скорость", "Удары", "Пасы", "Дриблинг", "Оборона", "Физика"],
      datasets: [
        {
          label: player.name,
          data: [player.pace, player.shooting, player.passing, player.dribbling, player.defending, player.physicality],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  // Функция для экспорта данных в CSV
  const exportToCSV = () => {
    if (players.length === 0) return

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

    // Создаем строки данных
    const rows = players.map((player) => headers.map((header) => player[header as keyof Player]))

    // Объединяем заголовки и данные
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `fc25_player_data_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Данные для графиков
  const attributeDistribution = getAttributeDistribution(selectedAttribute as keyof Player)
  const ageDistribution = getAgeGroups()
  const topPlayers = getTopPlayersByAttribute(selectedAttribute as keyof Player, 10)
  const attributeCorrelation = getAttributeCorrelation("overall", "pace")
  const heightWeightCorrelation = getAttributeCorrelation("height", "weight")
  const shootingPassingCorrelation = getAttributeCorrelation("shooting", "passing")
  const staminaAgeCorrelation = getAttributeCorrelation("stamina", "age")

  // Опции для графиков
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Распределение игроков по ${selectedAttribute}`,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Распределение игроков по возрастным группам",
      },
    },
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Корреляция между атрибутами",
      },
    },
  }

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Профиль игрока",
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  }

  // Данные для графиков
  const barData = {
    labels: attributeDistribution.labels,
    datasets: [
      {
        label: selectedAttribute,
        data: attributeDistribution.data,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }

  const pieData = {
    labels: ageDistribution.labels,
    datasets: [
      {
        label: "Количество игроков",
        data: ageDistribution.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
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
              <Link href="/analytics" className="text-sm font-medium text-green-400 border-b-2 border-green-500 pb-1">
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

        {/* Page Title */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                  Аналитика данных игроков
                </h1>
                <p className="text-zinc-400 mt-2">Исследовательский анализ данных (EDA) для игроков FC 25</p>
              </div>

              {/* Export Button */}
              {!isLoading && !error && players.length > 0 && (
                <Button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Экспорт в CSV
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="container mx-auto px-4">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
              <h3 className="text-red-400 font-bold text-lg">Ошибка загрузки данных</h3>
              <p className="text-red-300">{error}</p>
              <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white" onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          </div>
        )}

        {/* Analytics Content */}
        {!isLoading && !error && players.length > 0 && (
          <div className="container mx-auto px-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    Всего игроков
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{players.length}</div>
                  <p className="text-zinc-400 text-sm mt-1">в базе данных</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Средний рейтинг
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{getAverageByAttribute("overall")}</div>
                  <p className="text-zinc-400 text-sm mt-1">общий рейтинг</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Средний возраст
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{getAverageByAttribute("age")}</div>
                  <p className="text-zinc-400 text-sm mt-1">лет</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-purple-500" />
                    Средняя скорость
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{getAverageByAttribute("pace")}</div>
                  <p className="text-zinc-400 text-sm mt-1">из 99</p>
                </CardContent>
              </Card>
            </div>

            {/* Attribute Selector */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-white">Выберите атрибут для анализа:</h2>
                <Select value={selectedAttribute} onValueChange={(value) => setSelectedAttribute(value)}>
                  <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Выберите атрибут" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="overall">Общий рейтинг</SelectItem>
                    <SelectItem value="pace">Скорость</SelectItem>
                    <SelectItem value="shooting">Удары</SelectItem>
                    <SelectItem value="passing">Пасы</SelectItem>
                    <SelectItem value="dribbling">Дриблинг</SelectItem>
                    <SelectItem value="defending">Оборона</SelectItem>
                    <SelectItem value="physicality">Физика</SelectItem>
                    <SelectItem value="age">Возраст</SelectItem>
                    <SelectItem value="height">Рост</SelectItem>
                    <SelectItem value="weight">Вес</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs for different charts */}
            <Tabs defaultValue="distribution" className="mb-8">
              <TabsList className="bg-zinc-800 border-zinc-700 p-1">
                <TabsTrigger value="distribution" className="data-[state=active]:bg-green-600">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Распределение
                </TabsTrigger>
                <TabsTrigger value="age" className="data-[state=active]:bg-green-600">
                  <PieChart className="h-4 w-4 mr-2" />
                  Возрастные группы
                </TabsTrigger>
                <TabsTrigger value="correlation" className="data-[state=active]:bg-green-600">
                  <LineChart className="h-4 w-4 mr-2" />
                  Корреляции
                </TabsTrigger>
              </TabsList>

              <TabsContent value="distribution">
                <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader>
                    <CardTitle>Распределение игроков по {selectedAttribute}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Гистограмма показывает, сколько игроков имеют определенные значения выбранного атрибута
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <Bar options={barOptions} data={barData} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="age">
                <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader>
                    <CardTitle>Распределение игроков по возрастным группам</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Круговая диаграмма показывает процентное соотношение игроков в разных возрастных группах
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex justify-center">
                      <div className="w-[400px]">
                        <Pie options={pieOptions} data={pieData} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="correlation">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader>
                      <CardTitle>Корреляция: Общий рейтинг и Скорость</CardTitle>
                      <CardDescription className="text-zinc-400">
                        График показывает взаимосвязь между общим рейтингом и скоростью для топ-20 игроков
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line options={lineOptions} data={attributeCorrelation} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader>
                      <CardTitle>Корреляция: Рост и Вес</CardTitle>
                      <CardDescription className="text-zinc-400">
                        График показывает взаимосвязь между ростом и весом для топ-20 игроков
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line options={lineOptions} data={heightWeightCorrelation} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader>
                      <CardTitle>Корреляция: Удары и Пасы</CardTitle>
                      <CardDescription className="text-zinc-400">
                        График показывает взаимосвязь между ударами и пасами для топ-20 игроков
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line options={lineOptions} data={shootingPassingCorrelation} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader>
                      <CardTitle>Корреляция: Выносливость и Возраст</CardTitle>
                      <CardDescription className="text-zinc-400">
                        График показывает взаимосвязь между выносливостью и возрастом для топ-20 игроков
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line options={lineOptions} data={staminaAgeCorrelation} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Top Players by Selected Attribute */}
            <div className="mb-8">
              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader>
                  <CardTitle>Топ-10 игроков по {selectedAttribute}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Список лучших игроков по выбранному атрибуту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-green-400 font-medium">Игрок</th>
                          <th className="text-center py-3 px-4 text-green-400 font-medium">Возраст</th>
                          <th className="text-center py-3 px-4 text-green-400 font-medium">{selectedAttribute}</th>
                          <th className="text-center py-3 px-4 text-green-400 font-medium">Общий рейтинг</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPlayers.map((player, index) => (
                          <tr
                            key={player.id}
                            className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 ${
                              index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/10"
                            }`}
                          >
                            <td className="py-3 px-4 flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 mr-3">
                                <Image
                                  src={player.photo || "/placeholder.svg?height=32&width=32"}
                                  alt={player.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{player.name}</span>
                            </td>
                            <td className="py-3 px-4 text-center">{player.age}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-black font-bold text-sm">
                                {player[selectedAttribute as keyof Player]}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center justify-center min-w-[2.5rem] h-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black font-bold text-sm">
                                {player.overall}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Player Profiles */}
            {players.length > 0 && (
              <div className="mb-8">
                <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader>
                    <CardTitle>Профиль игрока</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Радарная диаграмма показывает основные атрибуты выбранного игрока
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Select
                          value={selectedPlayerId || undefined}
                          onValueChange={(value) => setSelectedPlayerId(value)}
                        >
                          <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Выберите игрока" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[300px]">
                            {players.map((player) => (
                              <SelectItem key={player.id} value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-[300px]">
                        {selectedPlayerId && getRadarChartData(Number.parseInt(selectedPlayerId)) && (
                          <Radar options={radarOptions} data={getRadarChartData(Number.parseInt(selectedPlayerId))!} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Statistical Summary */}
            <div className="mb-8">
              <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
                <CardHeader>
                  <CardTitle>Статистическая сводка</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Основные статистические показатели для выбранного атрибута
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-zinc-400 mb-1">Среднее значение</div>
                      <div className="text-2xl font-bold text-white">
                        {getAverageByAttribute(selectedAttribute as keyof Player)}
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-zinc-400 mb-1">Медиана</div>
                      <div className="text-2xl font-bold text-white">
                        {getMedianByAttribute(selectedAttribute as keyof Player)}
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-zinc-400 mb-1">Станд. отклонение</div>
                      <div className="text-2xl font-bold text-white">
                        {getStandardDeviationByAttribute(selectedAttribute as keyof Player)}
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-zinc-400 mb-1">Минимальное значение</div>
                      <div className="text-2xl font-bold text-white">
                        {getMinByAttribute(selectedAttribute as keyof Player)}
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-zinc-400 mb-1">Максимальное значение</div>
                      <div className="text-2xl font-bold text-white">
                        {getMaxByAttribute(selectedAttribute as keyof Player)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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
