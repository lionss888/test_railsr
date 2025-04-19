"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function NewCardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [cardType, setCardType] = useState<"virtual" | "physical">("virtual")

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "physical") {
      setCardType("physical")
    } else {
      setCardType("virtual")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Здесь будет вызов API для создания карты
      // const formData = new FormData(e.currentTarget)
      // const response = await createCard(formData)

      toast({
        title: "Карта создана",
        description: `Новая ${cardType === "virtual" ? "виртуальная" : "физическая"} карта успешно создана`,
      })

      router.push("/cards")
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать карту. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">
        Создание новой {cardType === "virtual" ? "виртуальной" : "физической"} карты
      </h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные карты</CardTitle>
          <CardDescription>Введите информацию для выпуска новой карты</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Клиент</Label>
              <Select name="customerId" required>
                <SelectTrigger id="customerId">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer1">Иван Иванов</SelectItem>
                  <SelectItem value="customer2">Петр Петров</SelectItem>
                  <SelectItem value="customer3">Анна Сидорова</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">Счет</Label>
              <Select name="accountId" required>
                <SelectTrigger id="accountId">
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
              <Label htmlFor="cardBrand">Платежная система</Label>
              <Select name="cardBrand" required>
                <SelectTrigger id="cardBrand">
                  <SelectValue placeholder="Выберите платежную систему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Имя на карте</Label>
              <Input id="cardName" name="cardName" placeholder="IVAN IVANOV" />
            </div>

            {cardType === "physical" && (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium">Адрес доставки</h3>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Адрес</Label>
                  <Input id="addressLine1" name="addressLine1" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Почтовый индекс</Label>
                    <Input id="postalCode" name="postalCode" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Страна</Label>
                    <Select name="country" required>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Выберите страну" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RU">Россия</SelectItem>
                        <SelectItem value="US">США</SelectItem>
                        <SelectItem value="GB">Великобритания</SelectItem>
                        <SelectItem value="DE">Германия</SelectItem>
                        <SelectItem value="FR">Франция</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Создание..." : `Создать ${cardType === "virtual" ? "виртуальную" : "физическую"} карту`}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
