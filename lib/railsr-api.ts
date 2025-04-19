// Базовый класс для работы с Railsr API
export class RailsrAPI {
  private apiKey: string
  private programId: string
  private baseUrl: string
  private debugMode: boolean

  constructor(apiKey: string, programId: string, baseUrl = "https://api.railsr.com/v3", debugMode = false) {
    this.apiKey = apiKey
    this.programId = programId
    this.baseUrl = baseUrl
    this.debugMode = debugMode
  }

  // Базовый метод для выполнения запросов к API
  protected async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Program-ID": this.programId,
      ...options.headers,
    }

    const config = {
      ...options,
      headers,
    }

    if (this.debugMode) {
      console.log(`API Request: ${url}`, { method: options.method || "GET", headers })
    }

    try {
      // Добавляем таймаут для запроса
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 секунд таймаут

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          errorData = { message: errorText || "Unknown error" }
        }

        console.error(`API Error (${response.status}):`, errorData)
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const responseText = await response.text()

      // Проверяем, что ответ не пустой
      if (!responseText || responseText.trim() === "") {
        if (this.debugMode) {
          console.warn("API returned empty response")
        }
        return { data: [] }
      }

      try {
        return JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse API response:", e)
        console.log("Raw response:", responseText)
        throw new Error(`Failed to parse API response: ${e.message}`)
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("API request timed out")
        throw new Error("API request timed out: The server took too long to respond")
      }

      if (error.message && error.message.includes("fetch")) {
        console.error("Network error:", error)
        throw new Error(`Network error: ${error.message || "Failed to connect to API"}`)
      }

      console.error("API request failed:", error)
      throw error
    }
  }

  // Получение информации о программе
  async getProgramInfo() {
    return this.fetchAPI("/program")
  }

  // Метод для проверки соединения с API
  async testConnection() {
    try {
      // Используем простой запрос для проверки соединения
      const result = await this.getProgramInfo()
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
