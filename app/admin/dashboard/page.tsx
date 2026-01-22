"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPageTitle } from "@/components/admin/page-title"
import { RecentActivityList } from "@/components/admin/recent-activity"
import { Users, Trophy, BarChart3, TrendingUp, Activity, Database, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    averageRating: 0,
    highestRated: { name: "", rating: 0 },
    recentlyAdded: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/players")

        if (!response.ok) {
          throw new Error("Не удалось загрузить данные игроков")
        }

        const players = await response.json()

        // Вычисляем статистику
        const totalPlayers = players.length
        const averageRating =
          players.length > 0
            ? Math.round(
                (players.reduce((sum: number, player: any) => sum + player.overall, 0) / players.length) * 10,
              ) / 10
            : 0

        const highestRated =
          players.length > 0
            ? players.reduce(
                (highest: any, player: any) =>
                  player.overall > highest.rating ? { name: player.name, rating: player.overall } : highest,
                { name: "", rating: 0 },
              )
            : { name: "Нет данных", rating: 0 }

        // Считаем игроков, добавленных за последние 7 дней (имитация)
        const recentlyAdded = Math.min(Math.floor(totalPlayers * 0.2), totalPlayers)

        setStats({
          totalPlayers,
          averageRating,
          highestRated,
          recentlyAdded,
        })
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <AdminPageTitle title="Панель управления" description="Обзор и статистика системы" />

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Всего игроков
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{stats.totalPlayers}</div>
            )}
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
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{stats.averageRating}</div>
            )}
            <p className="text-zinc-400 text-sm mt-1">общий рейтинг</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Лучший игрок
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-zinc-800 animate-pulse rounded w-32 mb-1"></div>
                <div className="h-5 bg-zinc-800 animate-pulse rounded w-16"></div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-white">{stats.highestRated.rating}</div>
                <p className="text-zinc-400 text-sm mt-1">{stats.highestRated.name}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              Недавно добавлено
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-zinc-800 animate-pulse rounded w-16"></div>
            ) : (
              <div className="text-3xl font-bold text-white">{stats.recentlyAdded}</div>
            )}
            <p className="text-zinc-400 text-sm mt-1">за последние 7 дней</p>
          </CardContent>
        </Card>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Последние действия */}
        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Последние действия
            </CardTitle>
            <CardDescription>История последних действий в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityList isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Быстрые ссылки */}
        <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-500" />
              Быстрые ссылки
            </CardTitle>
            <CardDescription>Часто используемые функции</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/players/add">
              <div className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg flex items-center transition-colors">
                <Users className="h-5 w-5 mr-3 text-green-500" />
                <div>
                  <h3 className="font-medium text-white">Добавить игрока</h3>
                  <p className="text-xs text-zinc-400">Создать новую запись игрока</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/players">
              <div className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg flex items-center transition-colors">
                <Trophy className="h-5 w-5 mr-3 text-yellow-500" />
                <div>
                  <h3 className="font-medium text-white">Управление игроками</h3>
                  <p className="text-xs text-zinc-400">Просмотр и редактирование игроков</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg flex items-center transition-colors">
                <BarChart3 className="h-5 w-5 mr-3 text-blue-500" />
                <div>
                  <h3 className="font-medium text-white">Аналитика</h3>
                  <p className="text-xs text-zinc-400">Просмотр статистики и отчетов</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/settings">
              <div className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg flex items-center transition-colors">
                <Settings className="h-5 w-5 mr-3 text-purple-500" />
                <div>
                  <h3 className="font-medium text-white">Настройки</h3>
                  <p className="text-xs text-zinc-400">Управление настройками системы</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
