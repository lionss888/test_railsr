"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, AlertCircle } from "lucide-react"

interface StatsData {
  customers: number
  accounts: number
  cards: number
  transactions: number
  totalBalance: {
    RUB: number
    USD: number
    EUR: number
  }
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Используем API-маршрут для получения статистики
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
        setUseMockData(data.isMockData)
      } else {
        throw new Error(data.error || "Не удалось загрузить статистику")
      }
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setError(err.message || "Не удалось загрузить статистику")
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для повторной попытки загрузки данных
  const handleRetry = () => {
    fetchStats()
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Форматирование валюты
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки данных</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4 mt-2">
              <RefreshCw className="h-4 w-4 mr-2" /> Повторить
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {useMockData && !error && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Демонстрационные данные</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Отображаются демонстрационные данные. API Railsr недоступен или возникла ошибка при получении данных.
            </span>
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
              <RefreshCw className="h-4 w-4 mr-2" /> Повторить
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.customers || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Счета</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.accounts || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Карты</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.cards || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Транзакции</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.transactions || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общий баланс</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-xl font-bold">{formatCurrency(stats?.totalBalance.RUB || 0, "RUB")}</div>
                <div className="text-lg">{formatCurrency(stats?.totalBalance.USD || 0, "USD")}</div>
                <div className="text-lg">{formatCurrency(stats?.totalBalance.EUR || 0, "EUR")}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Последняя активность</CardTitle>
            <CardDescription>Последние действия в системе</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Создана новая карта</span>
                  <span className="text-muted-foreground">2 мин. назад</span>
                </div>
                <div className="flex justify-between">
                  <span>Выполнен перевод на 15,000 ₽</span>
                  <span className="text-muted-foreground">15 мин. назад</span>
                </div>
                <div className="flex justify-between">
                  <span>Создан новый клиент</span>
                  <span className="text-muted-foreground">1 час назад</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
