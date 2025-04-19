import { RailsrAPI } from "./railsr-api"

export interface AccountData {
  customerId: string
  accountType: "current" | "savings" | "credit"
  currency: string
  name?: string
  metadata?: Record<string, any>
}

export class AccountsAPI extends RailsrAPI {
  // Создание нового счета
  async createAccount(accountData: AccountData) {
    return this.fetchAPI("/accounts", {
      method: "POST",
      body: JSON.stringify({
        customer_id: accountData.customerId,
        account_type: accountData.accountType,
        currency: accountData.currency,
        name: accountData.name,
        metadata: accountData.metadata,
      }),
    })
  }

  // Получение информации о счете
  async getAccount(accountId: string) {
    return this.fetchAPI(`/accounts/${accountId}`)
  }

  // Получение списка счетов клиента
  async listAccounts(customerId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/customers/${customerId}/accounts?page=${page}&per_page=${perPage}`)
  }

  // Получение списка всех счетов в системе
  async listAllAccounts(page = 1, perPage = 20) {
    return this.fetchAPI(`/accounts?page=${page}&per_page=${perPage}`)
  }

  // Получение баланса счета
  async getAccountBalance(accountId: string) {
    return this.fetchAPI(`/accounts/${accountId}/balance`)
  }

  // Получение выписки по счету
  async getAccountStatement(accountId: string, startDate: string, endDate: string) {
    return this.fetchAPI(`/accounts/${accountId}/statement?start_date=${startDate}&end_date=${endDate}`)
  }

  // Закрытие счета
  async closeAccount(accountId: string, reason: string) {
    return this.fetchAPI(`/accounts/${accountId}/close`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  // Получение реквизитов счета (IBAN, BIC и т.д.)
  async getAccountDetails(accountId: string) {
    return this.fetchAPI(`/accounts/${accountId}/details`)
  }

  // Получение записей главной книги (Ledger)
  async getLedgerEntries(accountId: string, page = 1, perPage = 20) {
    return this.fetchAPI(`/accounts/${accountId}/ledger?page=${page}&per_page=${perPage}`)
  }

  // Получение балансов по валютам
  // Этот метод пытается получить балансы разными способами в зависимости от API
  async getBalances() {
    try {
      // Сначала пробуем получить балансы по валютам через специальный эндпоинт
      return await this.fetchAPI(`/accounts/balances/by-currency`)
    } catch (error) {
      console.warn("Failed to fetch balances by currency, trying alternative method", error)

      try {
        // Если первый метод не сработал, пробуем получить все счета и суммировать балансы
        const accounts = await this.listAllAccounts(1, 100)

        if (!accounts.data || !Array.isArray(accounts.data)) {
          throw new Error("Invalid accounts data format")
        }

        // Группируем счета по валюте и суммируем балансы
        const balancesByCurrency: Record<string, number> = {}

        accounts.data.forEach((account: any) => {
          if (account.currency && account.balance) {
            if (!balancesByCurrency[account.currency]) {
              balancesByCurrency[account.currency] = 0
            }
            balancesByCurrency[account.currency] += Number.parseFloat(account.balance)
          }
        })

        // Преобразуем в формат, совместимый с API
        const result = {
          data: Object.entries(balancesByCurrency).map(([currency, balance]) => ({
            currency,
            total_balance: balance,
          })),
        }

        return result
      } catch (error) {
        console.error("Failed to calculate balances from accounts", error)

        // Возвращаем пустой результат в случае ошибки
        return { data: [] }
      }
    }
  }
}
