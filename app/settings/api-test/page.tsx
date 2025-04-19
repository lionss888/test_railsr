"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function ApiTestPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [endpoint, setEndpoint] = useState("program")
  const [customerId, setCustomerId] = useState("")
  const [accountId, setAccountId] = useState("")
  const [result, setResult] = useState<any>(null)

  const testEndpoint = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Формируем URL с параметрами
      let url = `/api/railsr/test-endpoints?endpoint=${endpoint}`
      if (endpoint === "accounts" || endpoint === "cards") {
        url += `&customerId=${encodeURIComponent(customerId)}`
      } else if (endpoint === "transactions") {
        url += `&accountId=${encodeURIComponent(accountId)}`
      }

      // Выполняем запрос
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast({
          title: "Запрос выполнен успешно",
          description: `Эндпоинт: ${endpoint}`,
        })
      } else {
        setResult(data)
        toast({
          title: "Ошибка запроса",
          description: data.error || "Неизвестная ошибка",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("API test error:", error)
      toast({
        title: "Ошибка запроса",
        description: "Не удалось выполнить запрос к API",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Определяем, нужны ли дополнительные параметры для выбранного эндпоинта
  const needsCustomerId = endpoint === "accounts" || endpoint === "cards"
  const needsAccountId = endpoint === "transactions"

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Тестирование API Railsr</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Тестирование эндпоинтов API</CardTitle>
          <CardDescription>Выберите эндпоинт для тестирования</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Эндпоинт</Label>
            <Select value={endpoint} onValueChange={setEndpoint}>
              <SelectTrigger id="endpoint">
                <SelectValue placeholder="Выберите эндпоинт" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="program">Информация о программе</SelectItem>
                <SelectItem value="customers">Список клиентов</SelectItem>
                <SelectItem value="accounts">Список счетов клиента</SelectItem>
                <SelectItem value="cards">Список карт клиента</SelectItem>
                <SelectItem value="transactions">Список транзакций счета</SelectItem>
                <SelectItem value="webhooks">Список вебхуков</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsCustomerId && (
            <div className="space-y-2">
              <Label htmlFor="customerId">ID клиента</Label>
              <Input
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Введите ID клиента"
                required
              />
            </div>
          )}

          {needsAccountId && (
            <div className="space-y-2">
              <Label htmlFor="accountId">ID счета</Label>
              <Input
                id="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Введите ID счета"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testEndpoint}
            disabled={isLoading || (needsCustomerId && !customerId) || (needsAccountId && !accountId)}
          >
            {isLoading ? "Выполнение запроса..." : "Выполнить запрос"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Результат запроса</CardTitle>
          <CardDescription>Ответ от API Railsr</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : result ? (
            <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-96">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          ) : (
            <p className="text-muted-foreground">Выполните запрос для получения результата</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
