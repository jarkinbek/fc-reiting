"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPageTitle } from "@/components/admin/page-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, LineChart, TrendingUp } from "lucide-react"

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
import { Bar, Pie, Line } from "react-chartjs-2"

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
  overall: number
  country?: string
}

export default function AdminAnalyticsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (error) {
        console.error("Ошибка при загрузке игроков:", error)
        setError(error instanceof Error ? error.message : "Произошла ошибка при загрузке данных")
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

  const getCountryDistribution = () => {
    if (players.length === 0) return { labels: [], data: [] }

    const countryCount: Record<string, number> = {}

    players.forEach((player) => {
      const country = player.country || "Неизвестно"
      countryCount[country] = (countryCount[country] || 0) + 1
    })

    // Сортируем страны по количеству игроков
    const sortedCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Берем топ-10 стран

    return {
      labels: sortedCountries.map(([country]) => country),
      data: sortedCountries.map(([, count]) => count),
    }
  }

  // Данные для графиков
  const overallDistribution = getAttributeDistribution("overall")
  const ageDistribution = getAgeGroups()
  const paceShootingCorrelation = getAttributeCorrelation("pace", "shooting")
  const countryDistribution = getCountryDistribution()

  // Опции для графиков
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Распределение игроков по рейтингу",
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

  // Данные для графиков
  const barData = {
    labels: overallDistribution.labels,
    datasets: [
      {
        label: "Количество игроков",
        data: overallDistribution.data,
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

  const countryData = {
    labels: countryDistribution.labels,
    datasets: [
      {
        label: "Количество игроков",
        data: countryDistribution.data,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <AdminPageTitle title="Аналитика" description="Статистический анализ данных игроков" />

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Средний рейтинг
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{getAverageByAttribute("overall")}</div>
            )}
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
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{getAverageByAttribute("age")}</div>
            )}
            <p className="text-zinc-400 text-sm mt-1">лет</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-yellow-500" />
              Средняя скорость
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{getAverageByAttribute("pace")}</div>
            )}
            <p className="text-zinc-400 text-sm mt-1">из 99</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              Средний дриблинг
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{getAverageByAttribute("dribbling")}</div>
            )}
            <p className="text-zinc-400 text-sm mt-1">из 99</p>
          </CardContent>
        </Card>
      </div>

      {/* Графики */}
      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList className="bg-zinc-800 border-zinc-700">
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
          <TabsTrigger value="countries" className="data-[state=active]:bg-green-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Страны
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle>Распределение игроков по рейтингу</CardTitle>
              <CardDescription className="text-zinc-400">
                Гистограмма показывает, сколько игроков имеют определенные значения рейтинга
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] bg-zinc-800/50 animate-pulse rounded"></div>
              ) : (
                <div className="h-[400px]">
                  <Bar options={barOptions} data={barData} />
                </div>
              )}
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
              {isLoading ? (
                <div className="h-[400px] bg-zinc-800/50 animate-pulse rounded"></div>
              ) : (
                <div className="h-[400px] flex justify-center">
                  <div className="w-[400px]">
                    <Pie options={pieOptions} data={pieData} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle>Корреляция: Скорость и Удары</CardTitle>
              <CardDescription className="text-zinc-400">
                График показывает взаимосвязь между скоростью и ударами для топ-20 игроков
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] bg-zinc-800/50 animate-pulse rounded"></div>
              ) : (
                <div className="h-[400px]">
                  <Line options={lineOptions} data={paceShootingCorrelation} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle>Распределение игроков по странам</CardTitle>
              <CardDescription className="text-zinc-400">Топ-10 стран по количеству игроков</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] bg-zinc-800/50 animate-pulse rounded"></div>
              ) : (
                <div className="h-[400px]">
                  <Bar
                    options={{
                      ...barOptions,
                      indexAxis: "y" as const,
                      plugins: {
                        ...barOptions.plugins,
                        title: {
                          ...barOptions.plugins.title,
                          text: "Топ-10 стран по количеству игроков",
                        },
                      },
                    }}
                    data={countryData}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
