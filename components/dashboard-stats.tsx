"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Функция для загрузки статистики из API
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляры API клиентов
        const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        const accountsApi = new AccountsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        const cardsApi = new CardsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        const transactionsApi = new TransactionsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Выполняем параллельные запросы для получения данных
        const [customersResponse, accountsResponse, cardsResponse, transactionsResponse] = await Promise.all([
          customersApi.listCustomers(1, 1), // Получаем только метаданные для подсчета
          accountsApi.listAllAccounts(1, 1), // Получаем только метаданные для подсчета
          cardsApi.listAllCards(1, 1), // Получаем только метаданные для подсчета
          transactionsApi.listAllTransactions(1, 1), // Получаем только метаданные для подсчета
        ])

        // Получаем балансы по валютам
        const balancesResponse = await accountsApi.getBalancesByCurrency()

        // Формируем объект с данными статистики
        const statsData: StatsData = {
          customers: customersResponse.meta?.pagination?.total || 0,
          accounts: accountsResponse.meta?.pagination?.total || 0,
          cards: cardsResponse.meta?.pagination?.total || 0,
          transactions: transactionsResponse.meta?.pagination?.total || 0,
          totalBalance: {
            RUB: 0,
            USD: 0,
            EUR: 0,
          },
        }

        // Заполняем данные о балансах
        if (balancesResponse && balancesResponse.data) {
          balancesResponse.data.forEach((balance: any) => {
            if (statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] !== undefined) {
              statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] = balance.total_balance
            }
          })
        }

        // Не загружаем статистику вебхуков если они отключены
        if (!config.webhooksEnabled) {
          // Убираем запросы связанные с вебхуками
        }

        setStats(statsData)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Не удалось загрузить статистику")
      } finally {
        setIsLoading(false)
      }
    }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
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
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
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
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
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
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
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
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
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
          ) : error ? (
            <div className="text-red-500 text-sm">Ошибка загрузки</div>
          ) : (
            <div className="space-y-2 text-sm">
              {/* Здесь будут отображаться последние события из API */}
              {/* Пока используем заглушки */}
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
  )
}
