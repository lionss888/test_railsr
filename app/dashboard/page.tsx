import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/customers/new">Новый клиент</Link>
          </Button>
          <Button asChild>
            <Link href="/transactions/new">Новая транзакция</Link>
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Часто используемые операции</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/customers/new">Создать клиента</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/accounts/new">Создать счет</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/cards/new?type=virtual">Выпустить виртуальную карту</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/transactions/new">Создать транзакцию</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/webhooks/new">Настроить вебхук</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Документация API</CardTitle>
            <CardDescription>Полезные ресурсы и документация</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Railsr API предоставляет широкие возможности для создания финансовых сервисов. Ниже приведены ссылки на
              полезные ресурсы и документацию.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="w-full">
                <a href="https://docs.railsr.com" target="_blank" rel="noopener noreferrer">
                  Документация API
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://docs.railsr.com/reference" target="_blank" rel="noopener noreferrer">
                  Справочник API
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://docs.railsr.com/guides" target="_blank" rel="noopener noreferrer">
                  Руководства
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://docs.railsr.com/webhooks" target="_blank" rel="noopener noreferrer">
                  Вебхуки
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
