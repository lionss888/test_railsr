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
import { CustomersAPI } from "@/lib/customers-api"
import { config } from "@/lib/config"
import { AlertCircle } from "lucide-react"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const formData = new FormData(e.currentTarget)

      // Создаем объект с данными клиента
      const customerData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        dateOfBirth: formData.get("dateOfBirth") as string,
        phoneNumber: (formData.get("phoneNumber") as string) || undefined,
        address: {
          addressLine1: formData.get("addressLine1") as string,
          city: formData.get("city") as string,
          country: formData.get("country") as string,
          postalCode: formData.get("postalCode") as string,
        },
      }

      // Валидация данных
      const validationErrors: Record<string, string> = {}

      if (!customerData.firstName) validationErrors.firstName = "Имя обязательно"
      if (!customerData.lastName) validationErrors.lastName = "Фамилия обязательна"
      if (!customerData.email) validationErrors.email = "Email обязателен"
      if (!customerData.dateOfBirth) validationErrors.dateOfBirth = "Дата рождения обязательна"
      if (!customerData.address.addressLine1) validationErrors.addressLine1 = "Адрес обязателен"
      if (!customerData.address.city) validationErrors.city = "Город обязателен"
      if (!customerData.address.country) validationErrors.country = "Страна обязательна"
      if (!customerData.address.postalCode) validationErrors.postalCode = "Почтовый индекс обязателен"

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setIsLoading(false)
        return
      }

      // Создаем экземпляр API клиента
      const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

      // Отправляем запрос на создание клиента
      const response = await customersApi.createCustomer(customerData)

      toast({
        title: "Клиент создан",
        description: `Новый клиент ${customerData.firstName} ${customerData.lastName} успешно создан`,
      })

      // Перенаправляем на страницу со списком клиентов
      router.push("/customers")
    } catch (error: any) {
      console.error("Error creating customer:", error)

      // Обработка ошибок API
      if (error.response && error.response.data && error.response.data.errors) {
        // Если API возвращает структурированные ошибки
        const apiErrors: Record<string, string> = {}

        error.response.data.errors.forEach((err: any) => {
          const field = err.field.replace(/^data\./, "")
          apiErrors[field] = err.message
        })

        setErrors(apiErrors)
      } else {
        // Общая ошибка
        toast({
          title: "Ошибка",
          description: "Не удалось создать клиента. Попробуйте еще раз.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Вспомогательная функция для отображения ошибки поля
  const fieldError = (field: string) => {
    return errors[field] ? (
      <div className="text-red-500 text-sm flex items-center mt-1">
        <AlertCircle className="h-4 w-4 mr-1" />
        {errors[field]}
      </div>
    ) : null
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Создание нового клиента</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные клиента</CardTitle>
          <CardDescription>Введите информацию о новом клиенте</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input id="firstName" name="firstName" className={errors.firstName ? "border-red-500" : ""} required />
                {fieldError("firstName")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input id="lastName" name="lastName" className={errors.lastName ? "border-red-500" : ""} required />
                {fieldError("lastName")}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" className={errors.email ? "border-red-500" : ""} required />
              {fieldError("email")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Дата рождения</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={errors.dateOfBirth ? "border-red-500" : ""}
                required
              />
              {fieldError("dateOfBirth")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Номер телефона</Label>
              <Input id="phoneNumber" name="phoneNumber" className={errors.phoneNumber ? "border-red-500" : ""} />
              {fieldError("phoneNumber")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Адрес</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                className={errors.addressLine1 ? "border-red-500" : ""}
                required
              />
              {fieldError("addressLine1")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input id="city" name="city" className={errors.city ? "border-red-500" : ""} required />
                {fieldError("city")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Почтовый индекс</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  className={errors.postalCode ? "border-red-500" : ""}
                  required
                />
                {fieldError("postalCode")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Страна</Label>
                <Select name="country" required>
                  <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
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
                {fieldError("country")}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Создание..." : "Создать клиента"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
