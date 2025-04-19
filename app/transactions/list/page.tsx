"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TransactionsAPI } from "@/lib/transactions-api"
import { AccountsAPI } from "@/lib/accounts-api"
import { config } from "@/lib/config"

// Интерфейс для данных транзакции из API
interface Transaction {
  id: string
  source_account_id: string
  destination_account_id?: string
  destination_iban?: string
  amount: number
  currency: string
  status: string
  created_at: string
  description?: string
  reference?: string
  // Другие поля из API
}

// Интерфейс для данных счета из API
interface Account {
  id: string
  name?: string
  currency: string
  // Другие поля из API
}

export default function TransactionsListPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Загрузка списка счетов
  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true)

      try {
        // Создаем экземпляр API клиента
        const accountsApi = new AccountsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        const response = await accountsApi.listAllAccounts(1, 100) // Получаем все счета

        if (response && response.data) {
          setAccounts(response.data)

          // Если есть счета, выбираем первый по умолчанию
          if (response.data.length > 0) {
            setSelectedAccount(response.data[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching accounts:", err)
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список счетов",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    fetchAccounts()
  }, [toast])

  // Загрузка транзакций для выбранного счета
  useEffect(() => {
    // Если счет не выбран, не загружаем транзакции
    if (!selectedAccount) {
      setTransactions([])
      setIsLoading(false)
      return
    }

    const fetchTransactions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляр API клиента
        const transactionsApi = new TransactionsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        const response = await transactionsApi.listTransactions(selectedAccount, currentPage, 10)

        // Обрабатываем ответ API
        if (response && response.data) {
          setTransactions(response.data)

          // Если API возвращает информацию о пагинации
          if (response.meta && response.meta.pagination) {
            setTotalPages(response.meta.pagination.total_pages || 1)
          }
        } else {
          setTransactions([])
          setError("Не удалось получить данные транзакций")
        }
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Ошибка при загрузке данных транзакций")
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список транзакций",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [selectedAccount, currentPage, toast])

  // Фильтрация транзакций по поисковому запросу
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.source_account_id.toLowerCase().includes(searchLower) ||
      (transaction.destination_account_id && transaction.destination_account_id.toLowerCase().includes(searchLower)) ||
      (transaction.destination_iban && transaction.destination_iban.toLowerCase().includes(searchLower)) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchLower)) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchLower))
    )
  })

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Форматирование суммы
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
    }).format(amount)
  }

  // Получение цвета и текста для статуса транзакции
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Выполнена</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            В обработке
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Ошибка</Badge>
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

  // Обработчик изменения выбранного счета
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId)
    setCurrentPage(1) // Сбрасываем страницу при смене счета
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Список транзакций</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск транзакций..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/transactions/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Новая транзакция
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Выбор счета</CardTitle>
          <CardDescription>Выберите счет для просмотра транзакций</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAccounts ? (
            <Skeleton className="h-10 w-full" />
          ) : accounts.length === 0 ? (
            <p>Нет доступных счетов</p>
          ) : (
            <Select value={selectedAccount} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name ? `${account.name} (${account.id})` : account.id} - {account.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Транзакции</CardTitle>
          <CardDescription>
            {selectedAccount
              ? `Список транзакций для счета ${selectedAccount}`
              : "Выберите счет для просмотра транзакций"}
          </CardDescription>
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
          ) : !selectedAccount ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Выберите счет для просмотра транзакций</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Счет отправителя</TableHead>
                    <TableHead>Счет получателя</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchQuery ? "Транзакции не найдены" : "Нет транзакций"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.source_account_id}</TableCell>
                        <TableCell>
                          {transaction.destination_account_id || transaction.destination_iban || "-"}
                        </TableCell>
                        <TableCell>{formatAmount(transaction.amount, transaction.currency)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/transactions/${transaction.id}`}>Подробнее</Link>
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
