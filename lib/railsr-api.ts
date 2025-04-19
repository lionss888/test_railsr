// Базовый класс для работы с Railsr API
export class RailsrAPI {
  private apiKey: string
  private programId: string
  private baseUrl: string

  constructor(apiKey: string, programId: string, baseUrl = "https://api.railsr.com/v3") {
    this.apiKey = apiKey
    this.programId = programId
    this.baseUrl = baseUrl
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

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Получение информации о программе
  async getProgramInfo() {
    return this.fetchAPI("/program")
  }
}
