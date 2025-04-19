// Конфигурация для API
export const config = {
  railsrApiKey: process.env.RAILSR_API_KEY || "",
  railsrProgramId: process.env.RAILSR_PROGRAM_ID || "",
  railsrApiUrl: process.env.RAILSR_API_URL || "https://api.railsr.com/v3",
  webhookSecret: process.env.WEBHOOK_SECRET || "",
  // Флаг для отключения функциональности вебхуков
  webhooksEnabled: false,
}

// Проверка наличия необходимых переменных окружения
export function validateConfig() {
  const requiredVars = [
    { key: "RAILSR_API_KEY", value: config.railsrApiKey },
    { key: "RAILSR_PROGRAM_ID", value: config.railsrProgramId },
  ]

  const missingVars = requiredVars.filter((v) => !v.value)

  if (missingVars.length > 0) {
    const missingKeys = missingVars.map((v) => v.key).join(", ")
    throw new Error(`Missing required environment variables: ${missingKeys}`)
  }
}
