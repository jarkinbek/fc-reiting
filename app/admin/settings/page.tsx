"use client"

import type React from "react"

import { useState } from "react"
import { Database, Shield, Bell, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/toaster"
import { AdminPageTitle } from "@/components/admin/page-title"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  // Настройки базы данных
  const [dbSettings, setDbSettings] = useState({
    host: process.env.DB_HOST || "localhost",
    port: "3306",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "fc25",
  })

  // Настройки безопасности
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: "30",
    allowedIPs: "",
    logFailedAttempts: true,
  })

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newPlayerAdded: true,
    playerUpdated: false,
    playerDeleted: true,
    adminLogin: true,
    emailAddress: "admin@example.com",
  })

  const handleDbSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDbSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityToggleChange = (name: string, checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggleChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Имитация сохранения настроек
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Настройки сохранены",
        description: "Ваши настройки были успешно сохранены",
      })
    }, 1500)
  }

  const handleTestConnection = () => {
    setIsTestingConnection(true)

    // Имитация проверки соединения
    setTimeout(() => {
      setIsTestingConnection(false)
      toast({
        title: "Соединение успешно",
        description: "Соединение с базой данных установлено",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <AdminPageTitle title="Настройки" description="Управление настройками системы" />

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="bg-zinc-800 border-zinc-700">
          <TabsTrigger value="database" className="data-[state=active]:bg-green-600">
            <Database className="h-4 w-4 mr-2" />
            База данных
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-green-600">
            <Shield className="h-4 w-4 mr-2" />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600">
            <Bell className="h-4 w-4 mr-2" />
            Уведомления
          </TabsTrigger>
        </TabsList>

        {/* Настройки базы данных */}
        <TabsContent value="database">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Настройки базы данных
              </CardTitle>
              <CardDescription>Настройте параметры подключения к базе данных</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="host">Хост</Label>
                  <Input
                    id="host"
                    name="host"
                    value={dbSettings.host}
                    onChange={handleDbSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Порт</Label>
                  <Input
                    id="port"
                    name="port"
                    value={dbSettings.port}
                    onChange={handleDbSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    name="username"
                    value={dbSettings.username}
                    onChange={handleDbSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={dbSettings.password}
                    onChange={handleDbSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">База данных</Label>
                  <Input
                    id="database"
                    name="database"
                    value={dbSettings.database}
                    onChange={handleDbSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-blue-700/50 bg-blue-900/20 hover:bg-blue-800/30 text-blue-400"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Проверить соединение
                  </>
                )}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Настройки безопасности */}
        <TabsContent value="security">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Настройки безопасности
              </CardTitle>
              <CardDescription>Настройте параметры безопасности системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableTwoFactor">Двухфакторная аутентификация</Label>
                  <p className="text-sm text-zinc-500">Включить двухфакторную аутентификацию для администраторов</p>
                </div>
                <Switch
                  id="enableTwoFactor"
                  checked={securitySettings.enableTwoFactor}
                  onCheckedChange={(checked) => handleSecurityToggleChange("enableTwoFactor", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Тайм-аут сессии (минуты)</Label>
                <Input
                  id="sessionTimeout"
                  name="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecuritySettingsChange}
                  className="bg-zinc-800/70 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedIPs">Разрешенные IP-адреса (через запятую)</Label>
                <Input
                  id="allowedIPs"
                  name="allowedIPs"
                  value={securitySettings.allowedIPs}
                  onChange={handleSecuritySettingsChange}
                  className="bg-zinc-800/70 border-zinc-700"
                  placeholder="Оставьте пустым для доступа со всех IP"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="logFailedAttempts">Журналирование неудачных попыток входа</Label>
                  <p className="text-sm text-zinc-500">Записывать все неудачные попытки входа в систему</p>
                </div>
                <Switch
                  id="logFailedAttempts"
                  checked={securitySettings.logFailedAttempts}
                  onCheckedChange={(checked) => handleSecurityToggleChange("logFailedAttempts", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Настройки уведомлений */}
        <TabsContent value="notifications">
          <Card className="bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-amber-500" />
                Настройки уведомлений
              </CardTitle>
              <CardDescription>Настройте параметры уведомлений системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email-уведомления</Label>
                  <p className="text-sm text-zinc-500">Включить отправку уведомлений по электронной почте</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationToggleChange("emailNotifications", checked)}
                />
              </div>

              {notificationSettings.emailNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email для уведомлений</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={notificationSettings.emailAddress}
                    onChange={handleNotificationSettingsChange}
                    className="bg-zinc-800/70 border-zinc-700"
                  />
                </div>
              )}

              <div className="space-y-4 border-t border-zinc-800 pt-4">
                <h3 className="text-sm font-medium text-zinc-300">Уведомлять о событиях:</h3>

                <div className="flex items-center justify-between">
                  <Label htmlFor="newPlayerAdded" className="cursor-pointer">
                    Добавление нового игрока
                  </Label>
                  <Switch
                    id="newPlayerAdded"
                    checked={notificationSettings.newPlayerAdded}
                    onCheckedChange={(checked) => handleNotificationToggleChange("newPlayerAdded", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="playerUpdated" className="cursor-pointer">
                    Обновление данных игрока
                  </Label>
                  <Switch
                    id="playerUpdated"
                    checked={notificationSettings.playerUpdated}
                    onCheckedChange={(checked) => handleNotificationToggleChange("playerUpdated", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="playerDeleted" className="cursor-pointer">
                    Удаление игрока
                  </Label>
                  <Switch
                    id="playerDeleted"
                    checked={notificationSettings.playerDeleted}
                    onCheckedChange={(checked) => handleNotificationToggleChange("playerDeleted", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="adminLogin" className="cursor-pointer">
                    Вход администратора в систему
                  </Label>
                  <Switch
                    id="adminLogin"
                    checked={notificationSettings.adminLogin}
                    onCheckedChange={(checked) => handleNotificationToggleChange("adminLogin", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
