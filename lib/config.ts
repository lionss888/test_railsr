import { DEV_MODE } from "./constants"

// Конфигурация для API
export const config = {
  railsrApiKey: process.env.RAILSR_API_KEY || "",
  railsrProgramId: process.env.RAILSR_PROGRAM_ID || "",
  railsrApiUrl: process.env.RAILSR_API_URL || "https://api.railsr.com/v3",
  webhookSecret: process.env.WEBHOOK_SECRET || "",
  webhooksEnabled: process.env.WEBHOOKS_ENABLED !== "false",
  debugMode: DEV_MODE || process.env.DEBUG_MODE === "true",
}

// Проверка наличия необходимых переменных окружения
export function validateConfig() {
  // В режиме разработки не требуем наличия переменных окружения
  if (DEV_MODE && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return true
  }

  const requiredVars = [
    { key: "RAILSR_API_KEY", value: config.railsrApiKey },
    { key: "RAILSR_PROGRAM_ID", value: config.railsrProgramId },
  ]

  const missingVars = requiredVars.filter((v) => !v.value)

  if (missingVars.length > 0) {
    const missingKeys = missingVars.map((v) => v.key).join(", ")
    console.error(`Missing required environment variables: ${missingKeys}`)
    return false
  }

  return true
}
