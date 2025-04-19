"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, CreditCard, PlusCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CardsAPI } from "@/lib/cards-api"
import { CustomersAPI } from "@/lib/customers-api"
import { config } from "@/lib/config"

// Интерфейс для данных карты из API
interface CardData {
  id: string
  customer_id: string
  account_id: string
  card_type: "virtual" | "physical"
  card_brand: string
  last4: string
  status: string
  expiry_date: string
  created_at: string
  // Другие поля из API
}

// Интерфейс для данных клиента из API
interface Customer {
  id: string
  first_name: string
  last_name: string
  // Другие поля из API
}

export default function CardsListPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [cards, setCards] = useState<CardData[]>([])
  const [customers, setCustomers] = useState<Record<string, Customer>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "virtual" | "physical">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "virtual") {
      setActiveTab("virtual")
    } else if (type === "physical") {
      setActiveTab("physical")
    } else {
      setActiveTab("all")
    }
  }, [searchParams])

  // Загрузка данных клиентов
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true)

      try {
        // Создаем экземпляр API клиента
        const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        const response = await customersApi.listCustomers(1, 100) // Получаем всех клиентов

        if (response && response.data) {
          // Преобразуем массив клиентов в объект для быстрого доступа по ID
          const customersMap: Record<string, Customer> = {}
          response.data.forEach((customer: Customer) => {
            customersMap[customer.id] = customer
          })

          setCustomers(customersMap)
        }
      } catch (err) {
        console.error("Error fetching customers:", err)
      } finally {
        setIsLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [])

  // Загрузка данных карт
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляр API клиента
        const cardsApi = new CardsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        // Примечание: в реальном API может потребоваться другой подход для получения всех карт
        const response = await cardsApi.listAllCards(currentPage, 10, activeTab !== "all" ? activeTab : undefined)

        // Обрабатываем ответ API
        if (response && response.data) {
          setCards(response.data)

          // Если API возвращает информацию о пагинации
          if (response.meta && response.meta.pagination) {
            setTotalPages(response.meta.pagination.total_pages || 1)
          }
        } else {
          setCards([])
          setError("Не удалось получить данные карт")
        }
      } catch (err) {
        console.error("Error fetching cards:", err)
        setError("Ошибка при загрузке данных карт")
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список карт",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [activeTab, currentPage, toast])

  // Фильтрация карт по поисковому запросу
  const filteredCards = cards.filter((card) => {
    const searchLower = searchQuery.toLowerCase()
    const customerName = customers[card.customer_id]
      ? `${customers[card.customer_id].first_name} ${customers[card.customer_id].last_name}`
      : ""

    return (
      card.id.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      card.last4.includes(searchLower) ||
      card.card_brand.toLowerCase().includes(searchLower) ||
      `${card.card_brand} ${card.last4}`.toLowerCase().includes(searchLower)
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

  // Форматирование срока действия карты
  const formatExpiryDate = (expiryDate: string) => {
    const [year, month] = expiryDate.split("-")
    return `${month}/${year.slice(2)}`
  }

  // Получение имени клиента
  const getCustomerName = (customerId: string) => {
    const customer = customers[customerId]
    return customer ? `${customer.first_name} ${customer.last_name}` : `Клиент ${customerId}`
  }

  // Получение цвета и текста для статуса карты
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Активна</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Неактивна
          </Badge>
        )
      case "blocked":
        return <Badge variant="destructive">Заблокирована</Badge>
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

  // Обработчик изменения типа карт
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "virtual" | "physical")
    setCurrentPage(1) // Сбрасываем страницу при смене типа карт
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Список карт</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск карт..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href={`/cards/new?type=${activeTab === "all" ? "virtual" : activeTab}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Новая карта
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Карты</CardTitle>
          <CardDescription>Список всех карт в системе</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Все карты</TabsTrigger>
              <TabsTrigger value="virtual">Виртуальные</TabsTrigger>
              <TabsTrigger value="physical">Физические</TabsTrigger>
            </TabsList>
            <TabsContent value="all">{renderCardsTable()}</TabsContent>
            <TabsContent value="virtual">{renderCardsTable()}</TabsContent>
            <TabsContent value="physical">{renderCardsTable()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )

  function renderCardsTable() {
    return isLoading ? (
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
              <TableHead>Тип</TableHead>
              <TableHead>Номер карты</TableHead>
              <TableHead>Срок действия</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchQuery ? "Карты не найдены" : "Нет карт"}
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.id}</TableCell>
                  <TableCell>
                    {isLoadingCustomers ? <Skeleton className="h-4 w-24" /> : getCustomerName(card.customer_id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {card.card_type === "virtual" ? "Виртуальная" : "Физическая"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="capitalize mr-1">{card.card_brand}</span>
                      <span>•••• {card.last4}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatExpiryDate(card.expiry_date)}</TableCell>
                  <TableCell>{getStatusBadge(card.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/cards/${card.id}`}>Подробнее</Link>
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
    )
  }
}
