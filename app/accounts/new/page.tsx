"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function NewAccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Здесь будет вызов API для создания счета
      // const formData = new FormData(e.currentTarget)
      // const response = await createAccount(formData)

      toast({
        title: "Счет создан",
        description: "Новый счет успешно создан в системе",
      })

      router.push("/accounts")
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать счет. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Создание нового счета</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные счета</CardTitle>
          <CardDescription>Введите информацию для создания нового счета</CardDescription>
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
              <Label htmlFor="accountType">Тип счета</Label>
              <Select name="accountType" required>
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Выберите тип счета" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Текущий счет</SelectItem>
                  <SelectItem value="savings">Сберегательный счет</SelectItem>
                  <SelectItem value="credit">Кредитный счет</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="name">Название счета</Label>
              <Input id="name" name="name" placeholder="Например: Основной счет" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Создание..." : "Создать счет"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
