"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CustomersAPI } from "@/lib/customers-api"
import { config } from "@/lib/config"

// Интерфейс для данных клиента из API
interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  kyc_status?: string
  created_at: string
  // Другие поля из API
}

export default function CustomersListPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Функция для загрузки данных клиентов из API
    const fetchCustomers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляр API клиента
        const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        const response = await customersApi.listCustomers(currentPage, 10)

        // Обрабатываем ответ API
        if (response && response.data) {
          setCustomers(response.data)

          // Если API возвращает информацию о пагинации
          if (response.meta && response.meta.pagination) {
            setTotalPages(response.meta.pagination.total_pages || 1)
          }
        } else {
          setCustomers([])
          setError("Не удалось получить данные клиентов")
        }
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError("Ошибка при загрузке данных клиентов")
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список клиентов",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [currentPage, toast])

  // Фильтрация клиентов по поисковому запросу
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.id.toLowerCase().includes(searchLower)
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

  // Получение цвета и текста для статуса KYC
  const getKycStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Подтвержден</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Ожидает
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Отклонен</Badge>
      default:
        return <Badge variant="outline">Не проходил</Badge>
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
        <h1 className="text-3xl font-bold">Список клиентов</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск клиентов..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/customers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Новый клиент
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Клиенты</CardTitle>
          <CardDescription>Список всех клиентов в системе</CardDescription>
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
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>KYC статус</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchQuery ? "Клиенты не найдены" : "Нет клиентов"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{getKycStatusBadge(customer.kyc_status)}</TableCell>
                        <TableCell>{formatDate(customer.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/customers/${customer.id}`}>Подробнее</Link>
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
