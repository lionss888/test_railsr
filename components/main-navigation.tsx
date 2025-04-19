"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { CreditCard, LayoutDashboard, Users, Wallet, BanknoteIcon, BellIcon, Settings } from "lucide-react"

export function MainNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"} className="justify-start">
        <Link href="/dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Дашборд
        </Link>
      </Button>
      <Button asChild variant={pathname.startsWith("/customers") ? "default" : "ghost"} className="justify-start">
        <Link href="/customers">
          <Users className="mr-2 h-4 w-4" />
          Клиенты
        </Link>
      </Button>
      <Button asChild variant={pathname.startsWith("/accounts") ? "default" : "ghost"} className="justify-start">
        <Link href="/accounts">
          <Wallet className="mr-2 h-4 w-4" />
          Счета
        </Link>
      </Button>
      <Button asChild variant={pathname.startsWith("/cards") ? "default" : "ghost"} className="justify-start">
        <Link href="/cards">
          <CreditCard className="mr-2 h-4 w-4" />
          Карты
        </Link>
      </Button>
      <Button asChild variant={pathname.startsWith("/transactions") ? "default" : "ghost"} className="justify-start">
        <Link href="/transactions">
          <BanknoteIcon className="mr-2 h-4 w-4" />
          Транзакции
        </Link>
      </Button>

      {/* Отображаем кнопку вебхуков только если они включены */}
      {config.webhooksEnabled && (
        <Button asChild variant={pathname.startsWith("/webhooks") ? "default" : "ghost"} className="justify-start">
          <Link href="/webhooks">
            <BellIcon className="mr-2 h-4 w-4" />
            Вебхуки
          </Link>
        </Button>
      )}

      <Button asChild variant={pathname.startsWith("/settings") ? "default" : "ghost"} className="justify-start">
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          Настройки
        </Link>
      </Button>
    </nav>
  )
}
