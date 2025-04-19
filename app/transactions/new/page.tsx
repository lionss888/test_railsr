"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function NewTransactionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Здесь будет вызов API для создания транзакции
      // const formData = new FormData(e.currentTarget)
      // const response = await createTransaction(formData)

      toast({
        title: "Транзакция создана",
        description: "Новая транзакция успешно создана в системе",
      })

      router.push("/transactions")
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать транзакцию. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Создание новой транзакции</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные транзакции</CardTitle>
          <CardDescription>Введите информацию о новой транзакции</CardDescription>
        </CardHeader>
        <Tabs defaultValue="internal">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="internal">Внутренний перевод</TabsTrigger>
              <TabsTrigger value="external">Внешний перевод</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="internal">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="sourceAccountId">Счет отправителя</Label>
                  <Select name="sourceAccountId" required>
                    <SelectTrigger id="sourceAccountId">
                      <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">Счет #1 (RUB)</SelectItem>
                      <SelectItem value="account2">Счет #2 (USD)</SelectItem>
                      <SelectItem value="account3">Счет #3 (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationAccountId">Счет получателя</Label>
                  <Select name="destinationAccountId" required>
                    <SelectTrigger id="destinationAccountId">
                      <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">Счет #1 (RUB)</SelectItem>
                      <SelectItem value="account2">Счет #2 (USD)</SelectItem>
                      <SelectItem value="account3">Счет #3 (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Валюта</Label>
                    <Select name="currency" required>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">Российский рубль (RUB)</SelectItem>
                        <SelectItem value="USD">Доллар США (USD)</SelectItem>
                        <SelectItem value="EUR">Евро (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea id="description" name="description" placeholder="Введите описание транзакции" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Референс</Label>
                  <Input id="reference" name="reference" placeholder="Введите референс транзакции" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Создание..." : "Создать транзакцию"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="external">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="sourceAccountId">Счет отправителя</Label>
                  <Select name="sourceAccountId" required>
                    <SelectTrigger id="sourceAccountId">
                      <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">Счет #1 (RUB)</SelectItem>
                      <SelectItem value="account2">Счет #2 (USD)</SelectItem>
                      <SelectItem value="account3">Счет #3 (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationIban">IBAN получателя</Label>
                  <Input id="destinationIban" name="destinationIban" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Валюта</Label>
                    <Select name="currency" required>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">Российский рубль (RUB)</SelectItem>
                        <SelectItem value="USD">Доллар США (USD)</SelectItem>
                        <SelectItem value="EUR">Евро (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea id="description" name="description" placeholder="Введите описание транзакции" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Референс</Label>
                  <Input id="reference" name="reference" placeholder="Введите референс транзакции" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Создание..." : "Создать транзакцию"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  )
}
