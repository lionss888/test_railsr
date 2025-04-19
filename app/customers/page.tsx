import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CustomersPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление клиентами</h1>
        <Button asChild>
          <Link href="/customers/new">Создать клиента</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Клиенты</CardTitle>
            <CardDescription>Управление учетными записями пользователей</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Создание, просмотр и редактирование учетных записей клиентов.</p>
            <Button asChild className="mt-4">
              <Link href="/customers/list">Список клиентов</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KYC верификация</CardTitle>
            <CardDescription>Управление процессом верификации клиентов</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Отправка документов для верификации и проверка статуса KYC.</p>
            <Button asChild className="mt-4">
              <Link href="/customers/kyc">Верификация KYC</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика клиентов</CardTitle>
          <CardDescription>Общая информация о клиентах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Всего клиентов</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Верифицировано</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Ожидают верификации</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
