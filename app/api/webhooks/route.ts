import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function POST(request: Request) {
  // Если вебхуки отключены, возвращаем 503 Service Unavailable
  if (!config.webhooksEnabled) {
    return NextResponse.json({ error: "Webhooks functionality is temporarily disabled" }, { status: 503 })
  }

  // Код обработки вебхуков...
  // Поскольку этот код временно не будет выполняться, возвращаем заглушку

  return NextResponse.json({ status: "ok" })
}
