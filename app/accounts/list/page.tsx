"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Search, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AccountsAPI } from "@/lib/accounts-api"
import { config } from "@/lib/config"

// Интерфейс для данных счета из API
interface Account {
  id: string
  customer_id: string
  customer_name?: string // Это поле может отсутствовать в API
  account_type: string
  currency: string
  balance: number
  status: string
  created_at: string
  name?: string
  // Другие поля из API
}

export default function AccountsListPage() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Функция для загрузки данных счетов из API
    const fetchAccounts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляр API клиента
        const accountsApi = new AccountsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        // Примечание: в реальном API может потребоваться другой подход для получения всех счетов
        const response = await accountsApi.listAllAccounts(currentPage, 10)

        // Обрабатываем ответ API
        if (response && response.data) {
          // Преобразуем данные, если необходимо
          const accountsData = response.data.map((account: any) => ({
            ...account,
            // Если API не возвращает имя клиента, можно добавить заглушку
            customer_name: account.customer_name || "Клиент " + account.customer_id,
          }))

          setAccounts(accountsData)

          // Если API возвращает информацию о пагинации
          if (response.meta && response.meta.pagination) {
            setTotalPages(response.meta.pagination.total_pages || 1)
          }
        } else {
          setAccounts([])
          setError("Не удалось получить данные счетов")
        }
      } catch (err) {
        console.error("Error fetching accounts:", err)
        setError("Ошибка при загрузке данных счетов")
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список счетов",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [currentPage, toast])

  // Фильтрация счетов по поисковому запросу
  const filteredAccounts = accounts.filter((account) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      account.id.toLowerCase().includes(searchLower) ||
      (account.customer_name && account.customer_name.toLowerCase().includes(searchLower)) ||
      (account.name && account.name.toLowerCase().includes(searchLower)) ||
      account.currency.toLowerCase().includes(searchLower)
    )
  })

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Форматирование суммы
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
    }).format(amount)
  }

  // Получение названия типа счета
  const getAccountTypeName = (type: string) => {
    switch (type) {
      case "current":
        return "Текущий"
      case "savings":
        return "Сберегательный"
      case "credit":
        return "Кредитный"
      default:
        return type || "Неизвестно"
    }
  }

  // Получение цвета и текста для статуса счета
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Активен</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Неактивен
          </Badge>
        )
      case "closed":
        return <Badge variant="destructive">Закрыт</Badge>
      default:
        return <Badge variant="outline">{status || "Неизвестно"}</Badge>
    }
  }

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Список счетов</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск счетов..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/accounts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Новый счет
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Счета</CardTitle>
          <CardDescription>Список всех счетов в системе</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => setCurrentPage(currentPage)}>
                Повторить загрузку
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Валюта</TableHead>
                    <TableHead>Баланс</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {searchQuery ? "Счета не найдены" : "Нет счетов"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.id}</TableCell>
                        <TableCell>{account.customer_name || account.customer_id}</TableCell>
                        <TableCell>{account.name || "-"}</TableCell>
                        <TableCell>{getAccountTypeName(account.account_type)}</TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell className={account.balance < 0 ? "text-red-500" : ""}>
                          {formatAmount(account.balance, account.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/accounts/${account.id}`}>Подробнее</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Вперед
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
