"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { Search, PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WebhooksAPI } from "@/lib/webhooks-api"
import { config } from "@/lib/config"

// Интерфейс для данных вебхука из API
interface Webhook {
  id: string
  url: string
  event_types: string[]
  active: boolean
  created_at: string
  description?: string
  // Другие поля из API
}

export default function WebhooksListPage() {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Функция для загрузки данных вебхуков из API
    const fetchWebhooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Создаем экземпляр API клиента
        const webhooksApi = new WebhooksAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

        // Получаем данные из API
        const response = await webhooksApi.listWebhooks(currentPage, 10)

        // Обрабатываем ответ API
        if (response && response.data) {
          setWebhooks(response.data)

          // Если API возвращает информацию о пагинации
          if (response.meta && response.meta.pagination) {
            setTotalPages(response.meta.pagination.total_pages || 1)
          }
        } else {
          setWebhooks([])
          setError("Не удалось получить данные вебхуков")
        }
      } catch (err) {
        console.error("Error fetching webhooks:", err)
        setError("Ошибка при загрузке данных вебхуков")
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список вебхуков",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebhooks()
  }, [currentPage, toast])

  // Фильтрация вебхуков по поисковому запросу
  const filteredWebhooks = webhooks.filter((webhook) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      webhook.id.toLowerCase().includes(searchLower) ||
      webhook.url.toLowerCase().includes(searchLower) ||
      (webhook.description && webhook.description.toLowerCase().includes(searchLower)) ||
      webhook.event_types.some((type) => type.toLowerCase().includes(searchLower))
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

  // Обработчик изменения статуса вебхука
  const handleStatusChange = async (id: string, active: boolean) => {
    try {
      setIsLoading(true)

      // Создаем экземпляр API клиента
      const webhooksApi = new WebhooksAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

      // Отправляем запрос на обновление статуса вебхука
      await webhooksApi.updateWebhook(id, { active })

      // Обновляем локальное состояние
      setWebhooks((prev) => prev.map((webhook) => (webhook.id === id ? { ...webhook, active } : webhook)))

      toast({
        title: "Статус изменен",
        description: `Вебхук ${active ? "активирован" : "деактивирован"}`,
      })
    } catch (error) {
      console.error("Error updating webhook status:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус вебхука",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик удаления вебхука
  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот вебхук?")) {
      return
    }

    try {
      setIsLoading(true)

      // Создаем экземпляр API клиента
      const webhooksApi = new WebhooksAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

      // Отправляем запрос на удаление вебхука
      await webhooksApi.deleteWebhook(id)

      // Обновляем локальное состояние
      setWebhooks((prev) => prev.filter((webhook) => webhook.id !== id))

      toast({
        title: "Вебхук удален",
        description: "Вебхук успешно удален из системы",
      })
    } catch (error) {
      console.error("Error deleting webhook:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вебхук",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        <h1 className="text-3xl font-bold">Список вебхуков</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск вебхуков..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/webhooks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Новый вебхук
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Вебхуки</CardTitle>
          <CardDescription>Список всех вебхуков в системе</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
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
                    <TableHead>URL</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Типы событий</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Создан</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebhooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchQuery ? "Вебхуки не найдены" : "Нет вебхуков"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWebhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium">{webhook.id}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                        <TableCell>{webhook.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.event_types.slice(0, 2).map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {webhook.event_types.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{webhook.event_types.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={webhook.active}
                            onCheckedChange={(checked) => handleStatusChange(webhook.id, checked)}
                            disabled={isLoading}
                          />
                        </TableCell>
                        <TableCell>{formatDate(webhook.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/webhooks/${webhook.id}`}>Подробнее</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(webhook.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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
                    disabled={currentPage === 1 || isLoading}
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
                        disabled={isLoading}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
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
