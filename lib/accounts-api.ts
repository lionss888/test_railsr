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
  async getBalancesByCurrency() {
    return this.fetchAPI(`/accounts/balances/by-currency`)
  }
}
