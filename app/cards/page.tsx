import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CardsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление картами</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/cards/new?type=virtual">Новая виртуальная карта</Link>
          </Button>
          <Button asChild>
            <Link href="/cards/new?type=physical">Новая физическая карта</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Виртуальные карты</CardTitle>
            <CardDescription>Управление виртуальными картами</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Создание и управление виртуальными картами для онлайн-платежей.</p>
            <Button asChild className="mt-4">
              <Link href="/cards/list?type=virtual">Список виртуальных карт</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Физические карты</CardTitle>
            <CardDescription>Управление физическими картами</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Выпуск и управление физическими картами для использования в точках продаж и банкоматах.</p>
            <Button asChild className="mt-4">
              <Link href="/cards/list?type=physical">Список физических карт</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика карт</CardTitle>
          <CardDescription>Общая информация о картах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Всего карт</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Виртуальные карты</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Физические карты</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Активные карты</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
