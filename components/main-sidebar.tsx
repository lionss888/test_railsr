"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, FileText, Home, LayoutDashboard, Settings, Users, Wallet, Webhook } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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

export function MainSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <span className="font-bold text-xl">Railsr API</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>Railsr API Service</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
