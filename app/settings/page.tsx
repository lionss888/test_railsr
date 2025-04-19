"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { config } from "@/lib/config"
import { RailsrAPI } from "@/lib/railsr-api"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "error">("unknown")
  const [programInfo, setProgramInfo] = useState<any>(null)

  // Проверка подключения к API
  const checkConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("unknown")

    try {
      const api = new RailsrAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
      const info = await api.getProgramInfo()

      setProgramInfo(info)
      setConnectionStatus("success")

      toast({
        title: "Подключение успешно",
        description: "Соединение с API Railsr установлено",
      })
    } catch (error) {
      console.error("API connection error:", error)
      setConnectionStatus("error")

      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключиться к API Railsr. Проверьте настройки.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Проверка подключения при загрузке страницы
  useEffect(() => {
    if (config.railsrApiKey && config.railsrProgramId) {
      checkConnection()
    }
  }, [])

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Настройки API</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Настройки подключения к Railsr API</CardTitle>
            <CardDescription>Параметры подключения к API Railsr</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API ключ</Label>
              <Input id="apiKey" type="password" value={config.railsrApiKey ? "••••••••••••••••••••••" : ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programId">ID программы</Label>
              <Input id="programId" value={config.railsrProgramId} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL API</Label>
              <Input id="apiUrl" value={config.railsrApiUrl} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookSecret">Секретный ключ для вебхуков</Label>
              <Input
                id="webhookSecret"
                type="password"
                value={config.webhookSecret ? "••••••••••••••••••••••" : ""}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={checkConnection} disabled={isLoading} className="w-full">
              {isLoading ? "Проверка..." : "Проверить подключение"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус подключения</CardTitle>
            <CardDescription>Информация о подключении к API Railsr</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="font-medium">Статус:</div>
              {connectionStatus === "unknown" && <div>Неизвестно</div>}
              {connectionStatus === "success" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-5 h-5 mr-1" /> Подключено
                </div>
              )}
              {connectionStatus === "error" && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-1" /> Ошибка подключения
                </div>
              )}
            </div>

            {programInfo && (
              <>
                <div className="space-y-2">
                  <div className="font-medium">Информация о программе:</div>
                  <div className="bg-secondary p-4 rounded-md">
                    <pre className="text-xs overflow-auto">{JSON.stringify(programInfo, null, 2)}</pre>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
