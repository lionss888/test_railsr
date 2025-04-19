import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TransactionsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Транзакции и платежи</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/transactions/new">Новая транзакция</Link>
          </Button>
          <Button asChild>
            <Link href="/transactions/payment/new">Новый платеж</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Транзакции</CardTitle>
            <CardDescription>Управление переводами между счетами</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Создание и отслеживание транзакций между счетами внутри системы и внешними счетами.</p>
            <Button asChild className="mt-4">
              <Link href="/transactions/list">Список транзакций</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Платежи</CardTitle>
            <CardDescription>Управление платежами и прямыми дебетами</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Обработка платежей с использованием различных методов оплаты и настройка прямых дебетов.</p>
            <Button asChild className="mt-4">
              <Link href="/transactions/payments">Список платежей</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика транзакций</CardTitle>
          <CardDescription>Общая информация о транзакциях и платежах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Всего транзакций</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Всего платежей</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Общий объем (RUB)</p>
              <p className="text-2xl font-bold">0.00 ₽</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Успешные транзакции</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
