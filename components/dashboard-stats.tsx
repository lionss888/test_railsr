"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, AlertCircle } from "lucide-react"
import { CustomersAPI } from "@/lib/customers-api"
import { AccountsAPI } from "@/lib/accounts-api"
import { CardsAPI } from "@/lib/cards-api"
import { TransactionsAPI } from "@/lib/transactions-api"
import { config } from "@/lib/config"

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

// Моковые данные для использования при ошибках API
const MOCK_STATS: StatsData = {
  customers: 5,
  accounts: 12,
  cards: 8,
  transactions: 47,
  totalBalance: {
    RUB: 250000,
    USD: 3500,
    EUR: 2800,
  },
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Проверяем наличие необходимых переменных окружения
      if (!config.railsrApiKey || !config.railsrProgramId) {
        console.warn("Missing API key or program ID, using mock data")
        setStats(MOCK_STATS)
        setUseMockData(true)
        return
      }

      // Используем моковые данные для разработки, если включен соответствующий режим
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
        console.log("Using mock data (development mode)")
        setStats(MOCK_STATS)
        setUseMockData(true)
        return
      }

      // Формируем статистику
      const statsData: StatsData = {
        customers: 0,
        accounts: 0,
        cards: 0,
        transactions: 0,
        totalBalance: {
          RUB: 0,
          USD: 0,
          EUR: 0,
        },
      }

      // Создаем экземпляры API клиентов с включенным режимом отладки
      const debugMode = true
      const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl, debugMode)
      const accountsApi = new AccountsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl, debugMode)
      const cardsApi = new CardsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl, debugMode)
      const transactionsApi = new TransactionsAPI(
        config.railsrApiKey,
        config.railsrProgramId,
        config.railsrApiUrl,
        debugMode,
      )

      // Выполняем запросы по одному с обработкой ошибок для каждого запроса
      try {
        const customersResponse = await customersApi.listCustomers(1, 1)
        statsData.customers = customersResponse.meta?.pagination?.total || 0
      } catch (err) {
        console.warn("Failed to fetch customers count:", err)
      }

      try {
        const accountsResponse = await accountsApi.listAllAccounts(1, 1)
        statsData.accounts = accountsResponse.meta?.pagination?.total || 0
      } catch (err) {
        console.warn("Failed to fetch accounts count:", err)
      }

      try {
        const cardsResponse = await cardsApi.listAllCards(1, 1)
        statsData.cards = cardsResponse.meta?.pagination?.total || 0
      } catch (err) {
        console.warn("Failed to fetch cards count:", err)
      }

      try {
        const transactionsResponse = await transactionsApi.listAllTransactions(1, 1)
        statsData.transactions = transactionsResponse.meta?.pagination?.total || 0
      } catch (err) {
        console.warn("Failed to fetch transactions count:", err)
      }

      // Получаем балансы по валютам с обработкой ошибок
      try {
        const balancesResponse = await accountsApi.getBalances()

        if (balancesResponse && balancesResponse.data && Array.isArray(balancesResponse.data)) {
          balancesResponse.data.forEach((balance: any) => {
            if (
              balance &&
              balance.currency &&
              statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] !== undefined
            ) {
              statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] =
                balance.total_balance || balance.balance || 0
            }
          })
        }
      } catch (err) {
        console.warn("Failed to fetch balances:", err)
      }

      setStats(statsData)
      setUseMockData(false)
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setError(err.message || "Не удалось загрузить статистику")

      // Используем моковые данные при ошибке
      setStats(MOCK_STATS)
      setUseMockData(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для повторной попытки загрузки данных
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
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
