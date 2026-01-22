import type React from "react"
import { Clock, User, Plus, Pencil, Trash2 } from "lucide-react"
interface Activity {
  id: number
  action: string
  user: string
  target: string
  timestamp: string
  icon: React.ReactNode
  iconColor: string
}
interface RecentActivityListProps {
  isLoading: boolean
}
export function RecentActivityList({ isLoading }: RecentActivityListProps) {
  // Демонстрационные данные
  const activities: Activity[] = [
    {
      id: 1,
      action: "Добавлен новый игрок",
      user: "admin",
      target: "Лионель Месси",
      timestamp: "10 минут назад",
      icon: <Plus className="h-4 w-4" />,
      iconColor: "bg-green-500/20 text-green-500",
    },
    {
      id: 2,
      action: "Обновлены данные игрока",
      user: "admin",
      target: "Криштиану Роналду",
      timestamp: "2 часа назад",
      icon: <Pencil className="h-4 w-4" />,
      iconColor: "bg-blue-500/20 text-blue-500",
    },
    {
      id: 3,
      action: "Удален игрок",
      user: "admin",
      target: "Тестовый игрок",
      timestamp: "вчера, 15:30",
      icon: <Trash2 className="h-4 w-4" />,
      iconColor: "bg-red-500/20 text-red-500",
    },
    {
      id: 4,
      action: "Вход в систему",
      user: "admin",
      target: "",
      timestamp: "вчера, 09:15",
      icon: <User className="h-4 w-4" />,
      iconColor: "bg-purple-500/20 text-purple-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-800 animate-pulse rounded w-3/4"></div>
              <div className="h-3 bg-zinc-800 animate-pulse rounded w-1/2"></div>
            </div>
          </div>
        ))}
  </div>
 )
}
return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${activity.iconColor} flex-shrink-0`}>{activity.icon}</div>
          <div className="flex-1">
            <p className="text-sm text-white">
              <span className="font-medium">{activity.action}</span>
              {activity.target && <span>: {activity.target}</span>}
            </p>
            <div className="flex items-center text-xs text-zinc-500 mt-1">
              <User className="h-3 w-3 mr-1" />
              <span>{activity.user}</span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
 </div>
)
}
