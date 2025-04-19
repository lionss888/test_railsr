import { NextResponse } from "next/server"
import { RailsrAPI } from "@/lib/railsr-api"
import { CustomersAPI } from "@/lib/customers-api"
import { AccountsAPI } from "@/lib/accounts-api"
import { CardsAPI } from "@/lib/cards-api"
import { TransactionsAPI } from "@/lib/transactions-api"
import { WebhooksAPI } from "@/lib/webhooks-api"
import { config } from "@/lib/config"

export async function GET(request: Request) {
  try {
    // Проверяем наличие необходимых переменных окружения
    if (!config.railsrApiKey || !config.railsrProgramId) {
      return NextResponse.json({ error: "Missing API key or program ID" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint") || "program"

    // Создаем экземпляры API клиентов
    const baseApi = new RailsrAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
    const customersApi = new CustomersAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
    const accountsApi = new AccountsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
    const cardsApi = new CardsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
    const transactionsApi = new TransactionsAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)
    const webhooksApi = new WebhooksAPI(config.railsrApiKey, config.railsrProgramId, config.railsrApiUrl)

    let result

    // Выполняем запрос к выбранному эндпоинту
    switch (endpoint) {
      case "program":
        result = await baseApi.getProgramInfo()
        break
      case "customers":
        result = await customersApi.listCustomers()
        break
      case "accounts":
        const customerId = searchParams.get("customerId")
        if (customerId) {
          result = await accountsApi.listAccounts(customerId)
        } else {
          return NextResponse.json({ error: "Customer ID is required for accounts endpoint" }, { status: 400 })
        }
        break
      case "cards":
        const customerIdForCards = searchParams.get("customerId")
        if (customerIdForCards) {
          result = await cardsApi.listCards(customerIdForCards)
        } else {
          return NextResponse.json({ error: "Customer ID is required for cards endpoint" }, { status: 400 })
        }
        break
      case "transactions":
        const accountId = searchParams.get("accountId")
        if (accountId) {
          result = await transactionsApi.listTransactions(accountId)
        } else {
          return NextResponse.json({ error: "Account ID is required for transactions endpoint" }, { status: 400 })
        }
        break
      case "webhooks":
        result = await webhooksApi.listWebhooks()
        break
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    // Возвращаем успешный ответ
    return NextResponse.json({ success: true, endpoint, data: result })
  } catch (error) {
    console.error(`API test error for endpoint: ${error}`)

    // Возвращаем ошибку
    return NextResponse.json({ error: "Failed to connect to Railsr API", details: error }, { status: 500 })
  }
}
