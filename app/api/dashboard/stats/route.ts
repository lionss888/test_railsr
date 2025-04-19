import { NextResponse } from "next/server"
import { CustomersAPI } from "@/lib/customers-api"
import { AccountsAPI } from "@/lib/accounts-api"
import { CardsAPI } from "@/lib/cards-api"
import { TransactionsAPI } from "@/lib/transactions-api"

// Моковые данные для использования при ошибках API
const MOCK_STATS = {
  customers: 5,
  accounts: 12,
  cards: 8,
  transactions: 47,
  totalBalance: {
    RUB: 250000,
    USD: 3500,
    EUR: 2800,
  },
}

export async function GET() {
  try {
    // Проверяем наличие необходимых переменных окружения
    const apiKey = process.env.RAILSR_API_KEY
    const programId = process.env.RAILSR_PROGRAM_ID
    const apiUrl = process.env.RAILSR_API_URL || "https://api.railsr.com/v3"

    // Если переменные окружения отсутствуют или включен режим моковых данных, возвращаем моковые данные
    if (!apiKey || !programId || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      return NextResponse.json({
        success: true,
        data: MOCK_STATS,
        isMockData: true,
      })
    }

    // Формируем статистику
    const statsData = {
      customers: 0,
      accounts: 0,
      cards: 0,
      transactions: 0,
      totalBalance: {
        RUB: 0,
        USD: 0,
        EUR: 0,
      },
    }

    // Создаем экземпляры API клиентов с включенным режимом отладки
    const debugMode = true
    const customersApi = new CustomersAPI(apiKey, programId, apiUrl, debugMode)
    const accountsApi = new AccountsAPI(apiKey, programId, apiUrl, debugMode)
    const cardsApi = new CardsAPI(apiKey, programId, apiUrl, debugMode)
    const transactionsApi = new TransactionsAPI(apiKey, programId, apiUrl, debugMode)

    // Выполняем запросы параллельно с обработкой ошибок для каждого запроса
    const [customersResponse, accountsResponse, cardsResponse, transactionsResponse, balancesResponse] =
      await Promise.allSettled([
        customersApi.listCustomers(1, 1).catch((err) => ({ meta: { pagination: { total: 0 } } })),
        accountsApi.listAllAccounts(1, 1).catch((err) => ({ meta: { pagination: { total: 0 } } })),
        cardsApi.listAllCards(1, 1).catch((err) => ({ meta: { pagination: { total: 0 } } })),
        transactionsApi.listAllTransactions(1, 1).catch((err) => ({ meta: { pagination: { total: 0 } } })),
        accountsApi.getBalances().catch((err) => ({ data: [] })),
      ])

    // Обрабатываем результаты запросов
    if (customersResponse.status === "fulfilled") {
      statsData.customers = customersResponse.value.meta?.pagination?.total || 0
    }

    if (accountsResponse.status === "fulfilled") {
      statsData.accounts = accountsResponse.value.meta?.pagination?.total || 0
    }

    if (cardsResponse.status === "fulfilled") {
      statsData.cards = cardsResponse.value.meta?.pagination?.total || 0
    }

    if (transactionsResponse.status === "fulfilled") {
      statsData.transactions = transactionsResponse.value.meta?.pagination?.total || 0
    }

    // Обрабатываем балансы
    if (
      balancesResponse.status === "fulfilled" &&
      balancesResponse.value.data &&
      Array.isArray(balancesResponse.value.data)
    ) {
      balancesResponse.value.data.forEach((balance: any) => {
        if (
          balance &&
          balance.currency &&
          statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] !== undefined
        ) {
          statsData.totalBalance[balance.currency as keyof typeof statsData.totalBalance] =
            balance.total_balance || balance.balance || 0
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: statsData,
      isMockData: false,
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)

    // В случае ошибки возвращаем моковые данные
    return NextResponse.json({
      success: true,
      data: MOCK_STATS,
      isMockData: true,
      error: error.message,
    })
  }
}
