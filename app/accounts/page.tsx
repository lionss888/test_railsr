import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccountsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Счета и балансы</h1>
        <Button asChild>
          <Link href="/accounts/new">Создать счет</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Счета</CardTitle>
            <CardDescription>Управление счетами клиентов</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Создание и управление мультивалютными счетами клиентов.</p>
            <Button asChild className="mt-4">
              <Link href="/accounts/list">Список счетов</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Главная книга</CardTitle>
            <CardDescription>Управление записями главной книги</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Просмотр и управление записями главной книги (Ledger) для отслеживания всех финансовых операций.</p>
            <Button asChild className="mt-4">
              <Link href="/accounts/ledger">Главная книга</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика счетов</CardTitle>
          <CardDescription>Общая информация о счетах и балансах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Всего счетов</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Общий баланс (RUB)</p>
              <p className="text-2xl font-bold">0.00 ₽</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Общий баланс (USD)</p>
              <p className="text-2xl font-bold">$0.00</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Общий баланс (EUR)</p>
              <p className="text-2xl font-bold">€0.00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
