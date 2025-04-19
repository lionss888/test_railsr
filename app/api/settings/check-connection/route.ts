import { NextResponse } from "next/server"
import { RailsrAPI } from "@/lib/railsr-api"

export async function GET() {
  try {
    // Получаем переменные окружения на сервере
    const apiKey = process.env.RAILSR_API_KEY
    const programId = process.env.RAILSR_PROGRAM_ID
    const apiUrl = process.env.RAILSR_API_URL || "https://api.railsr.com/v3"

    // Проверяем наличие необходимых переменных
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "API ключ отсутствует. Проверьте переменные окружения.",
        },
        { status: 400 },
      )
    }

    if (!programId || !programId.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "ID программы отсутствует. Проверьте переменные окружения.",
        },
        { status: 400 },
      )
    }

    // Создаем экземпляр API клиента
    const api = new RailsrAPI(apiKey, programId, apiUrl)

    // Проверяем подключение
    const result = await api.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        config: {
          apiKeyExists: !!apiKey,
          programIdExists: !!programId,
          apiUrl,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Не удалось подключиться к API Railsr",
          config: {
            apiKeyExists: !!apiKey,
            programIdExists: !!programId,
            apiUrl,
          },
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error checking connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Произошла ошибка при проверке подключения",
      },
      { status: 500 },
    )
  }
}
