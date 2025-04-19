import { NextResponse } from "next/server"
import { RailsrAPI } from "@/lib/railsr-api"
import { config } from "@/lib/config"

export async function GET() {
  try {
    // Проверяем наличие необходимых переменных окружения
    if (!config.railsrApiKey || !config.railsrProgramId) {
      return NextResponse.json({ error: "Missing API key or program ID" }, { status: 400 })
    }

    // Создаем экземпляр API клиента
    const api = new RailsrAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

    // Получаем информацию о программе
    const programInfo = await api.getProgramInfo()

    // Возвращаем успешный ответ
    return NextResponse.json({ success: true, data: programInfo })
  } catch (error) {
    console.error("API test error:", error)

    // Возвращаем ошибку
    return NextResponse.json({ error: "Failed to connect to Railsr API", details: error }, { status: 500 })
  }
}
