"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  Wallet,
  Webhook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navigationItems = [
  {
    title: "Дашборд",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Клиенты",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Счета",
    href: "/accounts",
    icon: Wallet,
  },
  {
    title: "Карты",
    href: "/cards",
    icon: CreditCard,
  },
  {
    title: "Транзакции",
    href: "/transactions",
    icon: BarChart3,
  },
  {
    title: "Вебхуки",
    href: "/webhooks/list",
    icon: Webhook,
  },
  {
    title: "Документация",
    href: "/docs",
    icon: FileText,
  },
  {
    title: "Настройки",
    href: "/settings",
    icon: Settings,
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span>Railsr API</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
