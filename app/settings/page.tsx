"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ConnectionStatus {
  status: "unknown" | "success" | "error"
  error?: string
  programInfo?: any
  config?: {
    apiKeyExists: boolean
    programIdExists: boolean
    apiUrl: string
  }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: "unknown",
  })

  // Проверка подключения к API
  const checkConnection = async () => {
    setIsLoading(true)
    setConnectionStatus({ status: "unknown" })

    try {
      // Используем API-маршрут для проверки подключения
      const response = await fetch("/api/settings/check-connection")
      const data = await response.json()

      if (data.success) {
        setConnectionStatus({
          status: "success",
          programInfo: data.data,
          config: data.config,
        })

        toast({
          title: "Подключение успешно",
          description: "Соединение с API Railsr установлено",
        })
      } else {
        setConnectionStatus({
          status: "error",
          error: data.error,
          config: data.config,
        })

        toast({
          title: "Ошибка подключения",
          description: data.error || "Не удалось подключиться к API Railsr",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("API connection error:", error)
      setConnectionStatus({
        status: "error",
        error: error.message || "Произошла ошибка при проверке подключения",
      })

      toast({
        title: "Ошибка подключения",
        description: "Не удалось выполнить запрос для проверки подключения",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Проверка подключения при загрузке страницы
  useEffect(() => {
    checkConnection()
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
              <Input
                id="apiKey"
                type="password"
                value={connectionStatus.config?.apiKeyExists ? "••••••••••••••••••••••" : ""}
                disabled
                placeholder="API ключ не настроен"
              />
              {!connectionStatus.config?.apiKeyExists && (
                <p className="text-sm text-red-500">API ключ не настроен в переменных окружения</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programId">ID программы</Label>
              <Input
                id="programId"
                value={connectionStatus.config?.programIdExists ? connectionStatus.config?.programIdExists : ""}
                disabled
                placeholder="ID программы не настроен"
              />
              {!connectionStatus.config?.programIdExists && (
                <p className="text-sm text-red-500">ID программы не настроен в переменных окружения</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL API</Label>
              <Input id="apiUrl" value={connectionStatus.config?.apiUrl || "https://api.railsr.com/v3"} disabled />
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Информация о переменных окружения</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                Для работы с API Railsr необходимо настроить следующие переменные окружения в проекте Vercel:
              </p>
              <ul className="mt-2 text-sm list-disc list-inside text-amber-700 dark:text-amber-400">
                <li>RAILSR_API_KEY - API ключ для доступа к Railsr API</li>
                <li>RAILSR_PROGRAM_ID - ID программы в Railsr</li>
                <li>RAILSR_API_URL - URL API Railsr (опционально)</li>
              </ul>
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
              {connectionStatus.status === "unknown" && <div>Проверка подключения...</div>}
              {connectionStatus.status === "success" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-5 h-5 mr-1" /> Подключено
                </div>
              )}
              {connectionStatus.status === "error" && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-1" /> Ошибка подключения
                </div>
              )}
            </div>

            {connectionStatus.status === "error" && connectionStatus.error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-800 dark:text-red-300">
                <p className="font-medium">Детали ошибки:</p>
                <p className="text-sm mt-1">{connectionStatus.error}</p>
              </div>
            )}

            {connectionStatus.status === "success" && connectionStatus.programInfo && (
              <>
                <div className="space-y-2">
                  <div className="font-medium">Информация о программе:</div>
                  <div className="bg-secondary p-4 rounded-md">
                    <pre className="text-xs overflow-auto">{JSON.stringify(connectionStatus.programInfo, null, 2)}</pre>
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
